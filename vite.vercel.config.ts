import {defineConfig} from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import {vercel} from './plugins/vercel';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        vercel(),
    ],
    build: {
        manifest: true,
    },
});
