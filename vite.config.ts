import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'The Cookbook',
                short_name: 'Cookbook',
                description: 'A personal collection of delicious recipes, meal plans, and cooking inspirations.',
                theme_color: '#d97706',
                background_color: '#fafaf9',
                display: 'standalone',
                orientation: 'portrait-primary',
                start_url: '/',
                scope: '/',
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'google-fonts-stylesheets',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-webfonts',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'firebase-storage-images',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                            },
                        },
                    },
                ],
            },
        }),
    ],
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
        host: true,
    },
});