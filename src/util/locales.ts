import zhCN from 'date-fns/locale/zh-CN/index.js';
import enUS from 'date-fns/locale/en-US/index.js';
import * as locales from '../locales';

const zhCnLang = ['zh-CN', 'zh'];

export const getUniversalLocales = (lang: string) => {
    const isZhCN = zhCnLang.includes(lang);
    const date = isZhCN ? zhCN : enUS;
    const text = isZhCN ? locales.zhCN : locales.enUS;
    return {date, text};
};
