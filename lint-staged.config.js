export default {
    '**/*.{cjs,mjs,js,ts,tsx}': 'eslint --fix',
    'src/**/*.{ts,tsx}'() {
        return 'pnpm exec tsc';
    },
};
