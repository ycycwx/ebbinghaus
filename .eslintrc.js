module.exports = {
    root: true,
    extends: [
        require.resolve('@yotsubacy/config/eslint/browser'),
        require.resolve('@yotsubacy/config/eslint/react'),
        require.resolve('@yotsubacy/config/eslint/typescript'),
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
};
