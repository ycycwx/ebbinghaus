/* eslint-disable import/unambiguous, import/no-commonjs */

module.exports = {
    '**/*.{js,ts,tsx}': 'eslint --fix',
    'src/**/*.{ts,tsx}'() {
        return 'pnpm exec tsc';
    },
};
