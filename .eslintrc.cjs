const {resolve} = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
    root: true,
    extends: [
        require.resolve('@yotsubacy/config/eslint/browser'),
        require.resolve('@yotsubacy/config/eslint/react'),
        require.resolve('@yotsubacy/config/eslint/typescript'),
    ],
    parserOptions: {
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
