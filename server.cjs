// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console, global-require */

// @ts-check

const path = require('node:path');
const express = require('express');

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
    const resolve = (/** @type {string} */ p) => path.resolve(__dirname, p);

    const app = express();

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite;
    if (isProd) {
        app.use(require('compression')());
        app.use(
            require('serve-static')(resolve('dist/client'), {
                index: false,
            })
        );
    }
    else {
        vite = await require('vite').createServer({
            root,
            logLevel: 'info',
            appType: 'custom',
            server: {
                middlewareMode: true,
                watch: {
                    usePolling: true,
                    interval: 100,
                },
            },
        });
        app.use(vite.middlewares);
    }

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;
            // @ts-expect-error
            const manifest = isProd ? require('./dist/client/manifest.json') : undefined;
            const render = isProd
                // eslint-disable-next-line import/extensions
                ? (await import('./dist/server/server.mjs')).render
                : (await vite.ssrLoadModule('/src/server.tsx')).render;

            render(url, req, res, manifest);
        }
        catch (e) {
            !isProd && vite.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    app.use(express.static(resolve('dist')));

    return {app, vite};
}

const PORT = process.env.PORT || 8080;

createServer().then(({app}) =>
    app.listen(PORT, () => {
        console.log(`Server is running in port ${PORT}`);
    })
);
