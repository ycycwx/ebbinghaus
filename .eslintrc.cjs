// @ts-check

const {resolve} = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: [
        require.resolve('@yotsubacy/config/eslint/browser'),
        require.resolve('@yotsubacy/config/eslint/react'),
        require.resolve('@yotsubacy/config/eslint/typescript'),
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    rules: {
        'import/extensions': ['error', {json: 'always'}],
    },
};
