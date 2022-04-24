// modified from
// https://github.com/i18next/i18next-http-middleware/blob/a02441633468c72881c0c5dc97168dbf4045479b/lib/languageLookups/header.js

import type {Request} from 'express';

const specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];

export const getLocales = (req: Request): string[] => {
    const headers = req.headers;
    const acceptLanguage = headers['accept-language'];
    if (!acceptLanguage) {
        return [];
    }

    let lookupRegex = /(([a-z]{2})-?([A-Z]{2})?)\s*;?\s*(q=([0-9.]+))?/gi;
    if (acceptLanguage.indexOf('-') > 0) {
        const foundSpecialCase = specialCases.find(s => acceptLanguage.toLowerCase().indexOf(`-${s}`) > 0);
        if (foundSpecialCase) {
            lookupRegex = /(([a-z]{2})-?([A-Z]{4})?)\s*;?\s*(q=([0-9.]+))?/gi;
        }
    }

    const lngs: Array<{lng: string, q: number}> = [];
    let m: RegExpExecArray | null = null;

    do {
        m = lookupRegex.exec(acceptLanguage);
        if (m) {
            const lng = m[1];
            const weight = m[5] || '1';
            const q = Number(weight);

            if (lng && !isNaN(q)) {
                lngs.push({lng, q});
            }
        }
    }
    while (m);

    lngs.sort((a, b) => b.q - a.q);

    return lngs.map(({lng}) => lng);
};
