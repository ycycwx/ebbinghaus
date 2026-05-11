import {useSyncExternalStore} from 'react';

type BeforeInstallPromptEvent = Event & {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt: () => Promise<void>;
};

type NavigatorWithStandalone = Navigator & {
    readonly standalone?: boolean;
};

interface InstallSnapshot {
    canInstall: boolean;
    installed: boolean;
    isPrompting: boolean;
}

const defaultSnapshot: InstallSnapshot = {
    canInstall: false,
    installed: false,
    isPrompting: false,
};

let snapshot = defaultSnapshot;
let installPrompt: BeforeInstallPromptEvent | null = null;
let initialized = false;

const listeners = new Set<() => void>();

const getIsRunningStandalone = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.matchMedia('(display-mode: standalone)').matches
        || (navigator as NavigatorWithStandalone).standalone === true
    );
};

const emit = () => {
    listeners.forEach(listener => {
        listener();
    });
};

const setSnapshot = (nextSnapshot: InstallSnapshot) => {
    if (
        snapshot.canInstall === nextSnapshot.canInstall
        && snapshot.installed === nextSnapshot.installed
        && snapshot.isPrompting === nextSnapshot.isPrompting
    ) {
        return;
    }

    snapshot = nextSnapshot;
    emit();
};

const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();

    installPrompt = event as BeforeInstallPromptEvent;

    setSnapshot({
        canInstall: true,
        installed: false,
        isPrompting: false,
    });
};

const handleAppInstalled = () => {
    installPrompt = null;

    setSnapshot({
        canInstall: false,
        installed: true,
        isPrompting: false,
    });
};

const ensureInitialized = () => {
    if (initialized || typeof window === 'undefined') {
        return;
    }

    initialized = true;

    setSnapshot({
        canInstall: snapshot.canInstall,
        installed: getIsRunningStandalone(),
        isPrompting: snapshot.isPrompting,
    });

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    ensureInitialized();

    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => snapshot;

const getServerSnapshot = () => defaultSnapshot;

export const usePwaInstallSnapshot = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export const promptPwaInstall = async () => {
    if (!installPrompt || snapshot.isPrompting || snapshot.installed) {
        return;
    }

    setSnapshot({
        ...snapshot,
        isPrompting: true,
    });

    try {
        await installPrompt.prompt();

        const {outcome} = await installPrompt.userChoice;

        installPrompt = null;

        if (outcome === 'accepted') {
            setSnapshot({
                canInstall: false,
                installed: true,
                isPrompting: false,
            });
            return;
        }

        setSnapshot({
            canInstall: true,
            installed: false,
            isPrompting: false,
        });
    }
    catch (error) {
        console.error('PWA install prompt failed', error);

        installPrompt = null;

        setSnapshot({
            canInstall: true,
            installed: false,
            isPrompting: false,
        });
    }
};
