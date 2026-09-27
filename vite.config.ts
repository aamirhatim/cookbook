import fs from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(
    fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
);
const appVersion = packageJson.version || '1.0.0';

function versionJsonPlugin(): Plugin {
    return {
        name: 'generate-version-json',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url && (req.url === '/version.json' || req.url.startsWith('/version.json?'))) {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.end(
                        JSON.stringify(
                            {
                                version: appVersion,
                                buildTime: Date.now(),
                            },
                            null,
                            4
                        )
                    );
                    return;
                }
                next();
            });
        },
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'version.json',
                source: JSON.stringify(
                    {
                        version: appVersion,
                        buildTime: Date.now(),
                    },
                    null,
                    4
                ),
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(appVersion),
        __BUILD_TIME__: JSON.stringify(Date.now()),
    },
    plugins: [
        react(),
        versionJsonPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: null,
            includeAssets: ['icons/*.png'],
            manifest: {
                name: 'The Cookbook',
                short_name: 'Cookbook',
                description: 'A personal collection of delicious recipes, meal plans, and cooking inspirations.',
                theme_color: '#F0EEE9',
                background_color: '#F0EEE9',
                display: 'standalone',
                orientation: 'portrait-primary',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/icons/maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,woff2,png}'],
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