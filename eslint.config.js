import config from '@yotsubacy/config/eslint';

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
    {
        ignores: ['dist'],
    }
);
