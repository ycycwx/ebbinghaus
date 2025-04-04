import fs from 'node:fs/promises';
import express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8080;
const base = process.env.BASE || '/';

const app = express();

/**
 * @type {import('vite').ViteDevServer}
 */
let vite;
if (isProd) {
    const compression = (await import('compression')).default;
    app.use(compression());

    const serveStatic = (await import('serve-static')).default;
    app.use(serveStatic('./dist/client', {index: false}));
}
else {
    const {createServer} = await import('vite');
    vite = await createServer({
        base,
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

app.use('*all', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '');
        const manifest = isProd ? await fs.readFile('./dist/client/manifest.json', 'utf-8') : undefined;
        const render = isProd
            ? (await import('./dist/server/server.js')).render
            : (await vite.ssrLoadModule('/src/server.tsx')).render;

        render(url, req, res, manifest);
    }
    catch (e) {
        if (!isProd) {
            vite.ssrFixStacktrace(e);
        }

        // eslint-disable-next-line no-console
        console.log(e.stack);
        res.status(500).end(e.stack);
    }
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running in port ${port}`);
});
