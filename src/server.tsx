// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {pipeToNodeWritable} from 'react-dom/server';
import {Html} from './components/Html.server';
import {getLocales} from './util/index.server';
import type {Request, Response} from 'express';
import type {Manifest} from 'vite';

export const render = (_: string, req: Request, res: Response, manifest?: Manifest) => {
    res.socket?.on('error', (error: any) => {
        console.error('Fatal', error);
    });

    let didError = false;
    const {startWriting, abort} = pipeToNodeWritable(
        <Html manifest={manifest} lang={getLocales(req)[0]} />,
        res,
        {
            onReadyToStream() {
                // eslint-disable-next-line no-param-reassign
                res.statusCode = didError ? 500 : 200;
                res.setHeader('Content-type', 'text/html');
                startWriting();
            },
            onError(x: any) {
                didError = true;
                console.error(x);
            },
        }
    );

    setTimeout(abort, 5000);
};
