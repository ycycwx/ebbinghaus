import {createContext, useContext} from 'react';
import type {Locale} from 'date-fns';
import type enUS from './json/enUS.json';

export type LocaleConfigKeys = keyof typeof enUS;

export interface LocalesContext {
    date: Locale;
    text: Record<LocaleConfigKeys, string>;
}

const context = createContext<LocalesContext | null>(null);

export const Locales = context.Provider;

const useLocales = () => {
    const locales = useContext(context);
    if (!locales) {
        throw new Error('`useLocales` must be used with `Locales`');
    }
    return locales;
};

export const useLocaleDate = () => useLocales().date;

export function useLocaleText(key: LocaleConfigKeys[]): string[];
export function useLocaleText(key: LocaleConfigKeys): string;
export function useLocaleText(): LocalesContext['text'];
export function useLocaleText(key?: LocaleConfigKeys | LocaleConfigKeys[]) {
    const text = useLocales().text;
    if (typeof key === 'undefined') {
        return text;
    }
    if (Array.isArray(key)) {
        return key.map(key => text[key]);
    }
    return text[key];
}
