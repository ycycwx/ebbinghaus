import {renderToPipeableStream} from 'react-dom/server';
import {Html} from './components/Html.server';
import {getLocales} from './util/index.server';
import type {Request, Response} from 'express';
import type {Manifest} from 'vite';

export const render = (_: string, req: Request, res: Response, manifest?: Manifest) => {
    res.socket?.on('error', error => {
        console.error('Fatal', error);
    });

    const html = <Html manifest={manifest} lang={getLocales(req)[0]} />;
    renderToPipeableStream(html).pipe(res);
};
