/* eslint-disable no-console, import/unambiguous, import/no-commonjs, global-require, init-declarations */

// @ts-check

const path = require('path');
const express = require('express');

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
    const resolve = (/** @type {string} */ p) => path.resolve(__dirname, p);

    const app = express();

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite;
    // eslint-disable-next-line no-negated-condition
    if (!isProd) {
        vite = await require('vite').createServer({
            root,
            logLevel: 'info',
            server: {
                middlewareMode: 'ssr',
                watch: {
                    usePolling: true,
                    interval: 100,
                },
            },
        });
        app.use(vite.middlewares);
    }
    else {
        app.use(require('compression')());
        app.use(
            require('serve-static')(resolve('dist/client'), {
                index: false,
            })
        );
    }

    // eslint-disable-next-line consistent-return
    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;
            // @ts-expect-error
            // eslint-disable-next-line import/extensions
            const manifest = isProd ? require('./dist/client/manifest.json') : undefined;
            const render = isProd
                // @ts-expect-error
                ? require('./dist/server/server').render
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
