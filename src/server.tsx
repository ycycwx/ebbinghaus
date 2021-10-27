// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {renderToPipeableStream} from 'react-dom/server';
import {Html} from './components/Html.server';
import {getLocales} from './util/index.server';
import type {Request, Response} from 'express';
import type {Manifest} from 'vite';

export const render = (_: string, req: Request, res: Response, manifest?: Manifest) => {
    res.socket?.on('error', (error: any) => {
        console.error('Fatal', error);
    });

    renderToPipeableStream(
        <Html manifest={manifest} lang={getLocales(req)[0]} />
    ).pipe(res);
};
