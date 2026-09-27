import type { AppVersionInfo } from '../types/version';

export const CURRENT_APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';
export const BUILD_TIMESTAMP = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now();

/**
 * Fetches the version manifest from the server with cache-busting headers.
 */
export async function fetchRemoteVersion(): Promise<AppVersionInfo | null> {
    try {
        const response = await fetch(`/version.json?t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (data && typeof data.version === 'string') {
            return data as AppVersionInfo;
        }
        return null;
    } catch (error) {
        console.warn('[Version] Failed to fetch remote version:', error);
        return null;
    }
}

/**
 * Compares remote version with current active app version.
 */
export function isNewVersion(remote: AppVersionInfo): boolean {
    if (!remote.version) return false;
    return remote.version !== CURRENT_APP_VERSION;
}

/**
 * Detects whether the app is currently running in standalone PWA mode.
 */
export function isStandalonePwa(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
}
