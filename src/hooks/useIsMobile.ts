import { useMediaQuery } from './useMediaQuery';

/**
 * Convenience hook that checks if the current viewport is considered mobile (< 640px / Tailwind 'sm' breakpoint).
 *
 * @returns boolean indicating whether screen width is <= 639px
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

export default useIsMobile;
