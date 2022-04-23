module.exports = {
    root: true,
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', './src', './server', './types'],
            },
        },
        'import/ignore': ['@chakra-ui/react'],
    },
    extends: [
        require.resolve('@yotsubacy/config/eslint/browser'),
        require.resolve('@yotsubacy/config/eslint/react'),
        require.resolve('@yotsubacy/config/eslint/typescript'),
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    rules: {
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
            },
        ],
        '@typescript-eslint/prefer-ts-expect-error': ['error'],
    },
};
