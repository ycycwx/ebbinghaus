import config from '@yotsubacy/config/eslint';
import {globalIgnores} from 'eslint/config';

export default config(
    ['node', 'react', 'typescript', 'browser'],
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    globalIgnores(['dist'])
);
