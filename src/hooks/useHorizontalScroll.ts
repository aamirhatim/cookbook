import { useRef, useState, useEffect, useCallback } from 'react';

export interface UseHorizontalScrollOptions {
    itemsToScroll?: number;
    dependencies?: unknown[];
}

/**
 * Custom hook to manage horizontal scroll state, boundaries, and programmatic scrolling.
 */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>({
    itemsToScroll = 2,
    dependencies = [],
}: UseHorizontalScrollOptions = {}) {
    const containerRef = useRef<T>(null);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

    const updateScrollBounds = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }, []);

    useEffect(() => {
        updateScrollBounds();
        const el = containerRef.current;
        if (!el) return;

        const handleResize = () => updateScrollBounds();
        window.addEventListener('resize', handleResize);

        const observer = new ResizeObserver(() => updateScrollBounds());
        observer.observe(el);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateScrollBounds, ...dependencies]);

    const scroll = useCallback(
        (direction: 'left' | 'right') => {
            const el = containerRef.current;
            if (!el) return;

            let scrollDistance = 260 * itemsToScroll;
            const children = el.children;
            const targetIdx = itemsToScroll;

            if (children.length > targetIdx) {
                const first = children[0] as HTMLElement;
                const target = children[targetIdx] as HTMLElement;
                scrollDistance = target.offsetLeft - first.offsetLeft;
            } else if (children.length >= 2) {
                const first = children[0] as HTMLElement;
                const second = children[1] as HTMLElement;
                scrollDistance = (second.offsetLeft - first.offsetLeft) * itemsToScroll;
            } else if (el.firstElementChild) {
                scrollDistance = (el.firstElementChild as HTMLElement).offsetWidth * itemsToScroll;
            }

            el.scrollBy({
                left: direction === 'left' ? -scrollDistance : scrollDistance,
                behavior: 'smooth',
            });
        },
        [itemsToScroll]
    );

    return {
        containerRef,
        canScrollLeft,
        canScrollRight,
        scroll,
        updateScrollBounds,
    };
}

export default useHorizontalScroll;
