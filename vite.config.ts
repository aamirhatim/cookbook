import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
                    icons: ['@tabler/icons-react'],
                    router: ['react-router-dom'],
                },
            },
        },
    },
    server: {
        port: 5173,
        host: true
    }
});

