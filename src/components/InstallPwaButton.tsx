import {useCallback, useEffect, useState} from 'react';
import {Button} from '@chakra-ui/react';
import {useLocaleText} from '../locales';

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

const isRunningStandalone = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.matchMedia('(display-mode: standalone)').matches
        || (navigator as NavigatorWithStandalone).standalone === true
    );
};

export const InstallPwaButton = () => {
    const installText = useLocaleText('pwa.install');
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(isRunningStandalone);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setInstallPrompt(null);
            setInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const onClick = useCallback(
        async () => {
            if (!installPrompt) {
                return;
            }

            const promptEvent = installPrompt;
            setInstallPrompt(null);

            await promptEvent.prompt();
            await promptEvent.userChoice;
        },
        [installPrompt]
    );

    if (installed || !installPrompt) {
        return null;
    }

    return (
        <Button size="sm" onClick={onClick}>
            {installText}
        </Button>
    );
};
