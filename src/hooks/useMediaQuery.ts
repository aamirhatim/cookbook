import { useEffect, useState } from 'react';

/**
 * Custom hook that listens to CSS media query matches.
 * Defaults gracefully to server/initial matching and adds listeners for changes.
 *
 * @param query CSS media query string, e.g. '(min-width: 768px)'
 * @returns boolean indicating if the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // Set initial match accurately
    setMatches(mediaQueryList.matches);

    // Modern MediaQueryList listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatch);
      return () => mediaQueryList.removeEventListener('change', updateMatch);
    } else {
      // Deprecated fallback for older browsers
      mediaQueryList.addListener(updateMatch);
      return () => mediaQueryList.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
}
