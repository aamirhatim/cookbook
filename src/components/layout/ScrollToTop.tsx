import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'recipe_book_scroll_positions';
const memoryScrollMap = new Map<string, number>();

function getStoredPosition(key: string, path: string): number | undefined {
    if (memoryScrollMap.has(key)) {
        return memoryScrollMap.get(key);
    }
    if (memoryScrollMap.has(path)) {
        return memoryScrollMap.get(path);
    }
    try {
        const item = sessionStorage.getItem(STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (typeof parsed[key] === 'number') return parsed[key];
            if (typeof parsed[path] === 'number') return parsed[path];
        }
    } catch {
        // Ignore storage errors
    }
    return undefined;
}

function saveStoredPosition(key: string, path: string, y: number) {
    memoryScrollMap.set(key, y);
    memoryScrollMap.set(path, y);
    try {
        const item = sessionStorage.getItem(STORAGE_KEY);
        const parsed = item ? JSON.parse(item) : {};
        parsed[key] = y;
        parsed[path] = y;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
        // Ignore storage errors
    }
}

/**
 * ScrollToTop component manages scroll restoration across router navigations:
 * - When navigating FORWARDS (PUSH / REPLACE): Resets scroll position to (0, 0) before paint.
 * - When navigating BACK (POP): Preserves and restores previous scroll position, even for
 *   dynamically loaded asynchronous content.
 */
export function ScrollToTop() {
    const location = useLocation();
    const navigationType = useNavigationType();

    // Disable browser's automatic scroll restoration so it doesn't fight React DOM updates
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    // Continuously record scroll position for the current location
    const currentLocationRef = useRef(location);
    currentLocationRef.current = location;

    useEffect(() => {
        const handleScroll = () => {
            const loc = currentLocationRef.current;
            saveStoredPosition(loc.key, loc.pathname + loc.search, window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            const loc = currentLocationRef.current;
            saveStoredPosition(loc.key, loc.pathname + loc.search, window.scrollY);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.key]);

    // Handle scroll on navigation
    useLayoutEffect(() => {
        const pathKey = location.pathname + location.search;

        if (navigationType !== 'POP') {
            // Navigating FORWARDS: Reset scroll to top before paint
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            } catch {
                window.scrollTo(0, 0);
            }
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } else {
            // Navigating BACK: Restore preserved scroll position
            const savedY = getStoredPosition(location.key, pathKey) ?? 0;

            try {
                window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
            } catch {
                window.scrollTo(0, savedY);
            }
            document.documentElement.scrollTop = savedY;
            document.body.scrollTop = savedY;

            // If target page has async content (e.g. recipe lists / details),
            // ensure the position is maintained as content expands into the DOM
            if (savedY > 0) {
                let cancelled = false;
                let frameId: number;
                const startTime = performance.now();

                const cancel = () => {
                    cancelled = true;
                    cancelAnimationFrame(frameId);
                    window.removeEventListener('wheel', cancel);
                    window.removeEventListener('touchstart', cancel);
                    window.removeEventListener('keydown', cancel);
                };

                window.addEventListener('wheel', cancel, { passive: true, once: true });
                window.addEventListener('touchstart', cancel, { passive: true, once: true });
                window.addEventListener('keydown', cancel, { passive: true, once: true });

                const tryRestore = () => {
                    if (cancelled) return;

                    try {
                        window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
                    } catch {
                        window.scrollTo(0, savedY);
                    }

                    if (
                        Math.abs(window.scrollY - savedY) <= 2 ||
                        performance.now() - startTime > 1500
                    ) {
                        cancel();
                        return;
                    }

                    frameId = requestAnimationFrame(tryRestore);
                };

                frameId = requestAnimationFrame(tryRestore);

                return () => {
                    cancel();
                };
            }
        }
    }, [location.key, location.pathname, location.search, navigationType]);

    return null;
}
