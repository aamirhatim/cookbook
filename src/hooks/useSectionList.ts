import { useCallback } from 'react';

export interface UseSectionListOptions<TItem, TSection> {
    sections: TSection[];
    onChange: (sections: TSection[]) => void;
    getItems: (section: TSection) => TItem[];
    setItems: (section: TSection, items: TItem[]) => TSection;
    createEmptyItem: () => TItem;
    createEmptySection: () => TSection;
    getTitle?: (section: TSection) => string;
    setTitle?: (section: TSection, title: string) => TSection;
}

export function useSectionList<TItem, TSection extends { title?: string }>({
    sections,
    onChange,
    getItems,
    setItems,
    createEmptyItem,
    createEmptySection,
    setTitle = (sec, title) => ({ ...sec, title }),
}: UseSectionListOptions<TItem, TSection>) {
    const safeSections = sections.length > 0 ? sections : [createEmptySection()];

    const updateSections = useCallback(
        (newSections: TSection[]) => {
            onChange(newSections);
        },
        [onChange]
    );

    const handleAddSection = useCallback(() => {
        updateSections([...safeSections, createEmptySection()]);
    }, [safeSections, createEmptySection, updateSections]);

    const handleRemoveSection = useCallback(
        (sectionIndex: number) => {
            const next = safeSections.filter((_, idx) => idx !== sectionIndex);
            updateSections(next.length > 0 ? next : [createEmptySection()]);
        },
        [safeSections, createEmptySection, updateSections]
    );

    const handleMoveSection = useCallback(
        (sectionIndex: number, direction: 'up' | 'down') => {
            const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
            if (targetIndex < 0 || targetIndex >= safeSections.length) return;
            const next = [...safeSections];
            const [moved] = next.splice(sectionIndex, 1);
            next.splice(targetIndex, 0, moved);
            updateSections(next);
        },
        [safeSections, updateSections]
    );

    const handleChangeTitle = useCallback(
        (sectionIndex: number, title: string) => {
            const next = safeSections.map((sec, idx) =>
                idx === sectionIndex ? setTitle(sec, title) : sec
            );
            updateSections(next);
        },
        [safeSections, setTitle, updateSections]
    );

    const handleAddItem = useCallback(
        (sectionIndex: number) => {
            const next = safeSections.map((sec, idx) => {
                if (idx !== sectionIndex) return sec;
                const items = [...getItems(sec), createEmptyItem()];
                return setItems(sec, items);
            });
            updateSections(next);
        },
        [safeSections, getItems, createEmptyItem, setItems, updateSections]
    );

    const handleUpdateItem = useCallback(
        (sectionIndex: number, itemIndex: number, updatedItem: TItem) => {
            const next = safeSections.map((sec, idx) => {
                if (idx !== sectionIndex) return sec;
                const items = getItems(sec).map((item, iIdx) =>
                    iIdx === itemIndex ? updatedItem : item
                );
                return setItems(sec, items);
            });
            updateSections(next);
        },
        [safeSections, getItems, setItems, updateSections]
    );

    const handleRemoveItem = useCallback(
        (sectionIndex: number, itemIndex: number) => {
            const next = safeSections.map((sec, idx) => {
                if (idx !== sectionIndex) return sec;
                const items = getItems(sec).filter((_, iIdx) => iIdx !== itemIndex);
                return setItems(sec, items);
            });
            updateSections(next);
        },
        [safeSections, getItems, setItems, updateSections]
    );

    const handleMoveItem = useCallback(
        (sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
            const next = safeSections.map((sec) => ({
                ...sec,
                _items: [...getItems(sec)],
            }));

            const currentItems = next[sectionIndex]._items;
            const [movedItem] = currentItems.splice(itemIndex, 1);
            if (!movedItem) return;

            if (direction === 'up') {
                if (itemIndex > 0) {
                    currentItems.splice(itemIndex - 1, 0, movedItem);
                } else if (sectionIndex > 0) {
                    next[sectionIndex - 1]._items.push(movedItem);
                } else {
                    currentItems.unshift(movedItem);
                    return;
                }
            } else {
                if (itemIndex < currentItems.length) {
                    currentItems.splice(itemIndex + 1, 0, movedItem);
                } else if (sectionIndex < next.length - 1) {
                    next[sectionIndex + 1]._items.unshift(movedItem);
                } else {
                    currentItems.push(movedItem);
                    return;
                }
            }

            const finalized = next.map((sec) => setItems(sec, sec._items));
            updateSections(finalized);
        },
        [safeSections, getItems, setItems, updateSections]
    );

    return {
        sections: safeSections,
        handleAddSection,
        handleRemoveSection,
        handleMoveSection,
        handleChangeTitle,
        handleAddItem,
        handleUpdateItem,
        handleRemoveItem,
        handleMoveItem,
    };
}
