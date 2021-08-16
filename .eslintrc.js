module.exports = {
    root: true,
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', './src', './server', './types'],
            },
        },
    },
    extends: [
        '@ecomfe/eslint-config/strict',
        '@ecomfe/eslint-config/import/strict',
        '@ecomfe/eslint-config/react/strict',
        '@ecomfe/eslint-config/typescript/strict',
    ],
    rules: {
        'import/order': [
            'warn',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
            },
        ],
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
            },
        ],
        '@typescript-eslint/prefer-ts-expect-error': ['error'],
    },
};
