import type {Plugin} from 'vite';

export const vercel = (): Plugin => ({
    name: 'vercel',
    enforce: 'pre',
    transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
            return html.replace(
                '<script type="module" src="/src/client.tsx"></script>',
                '<script type="module" src="/src/vercel.tsx"></script>'
            );
        },
    },
});
