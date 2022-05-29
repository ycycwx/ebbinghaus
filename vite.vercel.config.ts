import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {vercel} from './plugins/vercel';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        vercel(),
    ],
    build: {
        manifest: true,
    },
});
