import {zhCN, enUS} from 'date-fns/locale';
import * as locales from '../locales';

const zhCnLang = ['zh-CN', 'zh'];

export const getUniversalLocales = (lang: string) => {
    const isZhCN = zhCnLang.includes(lang);
    const date = isZhCN ? zhCN : enUS;
    const text = isZhCN ? locales.zhCN : locales.enUS;
    return {date, text};
};
