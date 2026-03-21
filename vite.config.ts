import {defineConfig} from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({
            plugins: [reactCompilerPreset],
        }),
    ],
    build: {
        manifest: true,
    },
});
