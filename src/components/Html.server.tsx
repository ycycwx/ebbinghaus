/* eslint-disable react/no-danger */

import {getUniversalLocales} from '../util';
import {App} from './App';
import type {Manifest} from 'vite';

const preambleCode = `
import RefreshRuntime from "${import.meta.env.BASE_URL}@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;

const ManifestResolver = ({manifest}: {manifest?: Manifest}) => {
    if (!manifest) {
        return null;
    }
    const base = import.meta.env.BASE_URL;
    const entryChunk = Object.values(manifest).find(chunk => chunk.isEntry);
    if (!entryChunk) {
        return null;
    }

    const entryScript = (
        <script key={entryChunk.file} type="module" crossOrigin="crossorigin" src={`${base}${entryChunk.file}`} />
    );
    const importsScripts = entryChunk.imports?.map(file => {
        const importLinks = manifest[file];
        return <link key={importLinks.file} type="modulepreload" href={`${base}${importLinks.file}`} />;
    });
    const styleLinks = entryChunk.css?.map(file => {
        const importLinks = manifest[file];
        return <link key={importLinks.file} rel="stylesheet" href={`${base}${importLinks.file}`} />;
    });
    return <>{entryScript}{importsScripts}{styleLinks}</>;
};

interface HtmlProps {
    manifest?: Manifest;
    lang: string;
}

export const Html = ({manifest, lang}: HtmlProps) => {
    return (
        <html lang="en">
            <head>
                {import.meta.env.DEV && <script type="module" dangerouslySetInnerHTML={{__html: preambleCode}} />}
                {import.meta.env.DEV && <script type="module" src="/@vite/client" />}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Ebbinghaus</title>
                <link rel="shortcut icon" href="favicon.ico" />
                <ManifestResolver manifest={manifest} />
            </head>
            <body>
                <div id="root">
                    <App locales={getUniversalLocales(lang)} />
                </div>
                {import.meta.env.DEV && <script type="module" src="/src/client.tsx" />}
            </body>
        </html>
    );
};
