export const registerServiceWorker = () => {
    if (import.meta.env.DEV) {
        return;
    }

    if (!('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
            console.error('Service worker registration failed', error);
        });
    });
};
