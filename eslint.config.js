import {flatConfigs} from '@yotsubacy/config/eslint';

export default flatConfigs.config(
    ['node', 'browser', 'react', 'typescript'],
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: ['dist'],
    }
);
