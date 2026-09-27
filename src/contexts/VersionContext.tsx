import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import type { VersionContextType } from '../types/version';
import {
    CURRENT_APP_VERSION,
    fetchRemoteVersion,
    isNewVersion,
    isStandalonePwa,
} from '../services/version';
import { useToast } from '../hooks/useToast';

export const VersionContext = createContext<VersionContextType | undefined>(undefined);

const RELOAD_THROTTLE_KEY = 'cookbook_pwa_last_reload_time';
const RELOAD_THROTTLE_MS = 10000; // 10 seconds guard to prevent loops
const ROUTE_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes between route checks
const PERIODIC_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes periodic check

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { showToast } = useToast();

    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const [isOfflineReady, setIsOfflineReady] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [latestVersion, setLatestVersion] = useState<string | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [lastChecked, setLastChecked] = useState<number | null>(null);

    const updateServiceWorkerRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
    const latestVersionRef = useRef<string | null>(null);

    // Synchronize latestVersionRef with state
    useEffect(() => {
        latestVersionRef.current = latestVersion;
    }, [latestVersion]);

    /**
     * Executes page reload safely with loop protection and a brief notification.
     */
    const executeAutoReload = useCallback(() => {
        const lastReload = sessionStorage.getItem(RELOAD_THROTTLE_KEY);
        const now = Date.now();
        if (lastReload && now - parseInt(lastReload, 10) < RELOAD_THROTTLE_MS) {
            console.warn('[Version] Auto-reload throttled to prevent loop.');
            return;
        }
        sessionStorage.setItem(RELOAD_THROTTLE_KEY, now.toString());

        const targetVersion = latestVersionRef.current || 'latest';

        if (document.hidden) {
            window.location.reload();
        } else {
            showToast(`A new version (v${targetVersion}) of The Cookbook is installed! Updating...`, 'info', 2500);
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        }
    }, [showToast]);

    /**
     * Checks for updates by querying both the service worker and version.json.
     */
    const checkForUpdates = useCallback(
        async (silent: boolean = false): Promise<boolean> => {
            setIsChecking(true);
            try {
                // 1. Service Worker update check
                if (registration) {
                    try {
                        await registration.update();
                    } catch (swErr) {
                        console.warn('[Version] Service worker update check error:', swErr);
                    }
                }

                // 2. Remote version manifest check
                const remoteInfo = await fetchRemoteVersion();
                setLastChecked(Date.now());

                if (remoteInfo && isNewVersion(remoteInfo)) {
                    console.log(`[Version] Newer version published: ${remoteInfo.version} (current: ${CURRENT_APP_VERSION})`);
                    setLatestVersion(remoteInfo.version);
                    setIsUpdateAvailable(true);

                    if (!silent) {
                        showToast(`New version v${remoteInfo.version} found! Installing update...`, 'info', 3000);
                    }

                    // Trigger service worker activation or reload
                    if (updateServiceWorkerRef.current) {
                        await updateServiceWorkerRef.current(true);
                    } else {
                        executeAutoReload();
                    }
                    return true;
                }

                if (!silent) {
                    showToast(`The Cookbook is up to date (v${CURRENT_APP_VERSION}).`, 'success', 3000);
                }
                return false;
            } catch (err) {
                console.error('[Version] Error while checking for updates:', err);
                if (!silent) {
                    showToast('Unable to check for updates right now. Please check your connection.', 'error');
                }
                return false;
            } finally {
                setIsChecking(false);
            }
        },
        [registration, executeAutoReload, showToast]
    );

    /**
     * Manually applies the update if available.
     */
    const applyUpdate = useCallback(() => {
        if (updateServiceWorkerRef.current) {
            updateServiceWorkerRef.current(true);
        } else {
            executeAutoReload();
        }
    }, [executeAutoReload]);

    // Initialize standalone detection & service worker registration
    useEffect(() => {
        setIsStandalone(isStandalonePwa());

        // Register Service Worker with vite-plugin-pwa virtual register
        const updateSW = registerSW({
            immediate: true,
            onNeedReload() {
                console.log('[Version] Service Worker activated with update. Triggering auto-update...');
                setIsUpdateAvailable(true);
                executeAutoReload();
            },
            onOfflineReady() {
                console.log('[Version] App is ready for offline usage.');
                setIsOfflineReady(true);
            },
            onRegisteredSW(swScriptUrl, reg) {
                console.log('[Version] Service Worker registered:', swScriptUrl);
                if (reg) {
                    setRegistration(reg);

                    // Listen for newly installed workers
                    reg.addEventListener('updatefound', () => {
                        const installingWorker = reg.installing;
                        if (installingWorker) {
                            installingWorker.addEventListener('statechange', () => {
                                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[Version] New content installed in background.');
                                    setIsUpdateAvailable(true);
                                }
                            });
                        }
                    });
                }
            },
            onRegisterError(error) {
                console.error('[Version] Service Worker registration failed:', error);
            },
        });

        updateServiceWorkerRef.current = updateSW;

        // Perform initial background check after 2 seconds
        const initialTimer = setTimeout(() => {
            checkForUpdates(true);
        }, 2000);

        return () => {
            clearTimeout(initialTimer);
        };
    }, [checkForUpdates, executeAutoReload]);

    // Set up lifecycle listeners (visibility, focus, online, periodic, vite:preloadError)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkForUpdates(true);
            }
        };

        const handleFocus = () => {
            checkForUpdates(true);
        };

        const handleOnline = () => {
            checkForUpdates(true);
        };

        const handlePreloadError = () => {
            console.warn('[Version] Chunk loading error detected. Reloading to fetch latest assets...');
            executeAutoReload();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('online', handleOnline);
        window.addEventListener('vite:preloadError', handlePreloadError);

        // Periodic background interval check
        const intervalId = setInterval(() => {
            checkForUpdates(true);
        }, PERIODIC_CHECK_INTERVAL_MS);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('vite:preloadError', handlePreloadError);
            clearInterval(intervalId);
        };
    }, [checkForUpdates, executeAutoReload]);

    // Route transition check: checks if > 5 minutes have elapsed since last check
    useEffect(() => {
        if (!lastChecked || Date.now() - lastChecked > ROUTE_CHECK_INTERVAL_MS) {
            checkForUpdates(true);
        }
    }, [location.pathname, lastChecked, checkForUpdates]);

    return (
        <VersionContext.Provider
            value={{
                currentVersion: CURRENT_APP_VERSION,
                latestVersion,
                isChecking,
                isUpdateAvailable,
                isOfflineReady,
                isStandalone,
                lastChecked,
                checkForUpdates,
                applyUpdate,
            }}
        >
            {children}
        </VersionContext.Provider>
    );
};
