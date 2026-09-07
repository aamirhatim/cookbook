import React, { useState, useEffect } from 'react';
import { Searchbar } from '../atoms/Searchbar';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { DropdownMenu } from './DropdownMenu';
import { TimeFilterMobileTray } from './TimeFilterMobileTray';
import { DifficultyFilterMobileTray } from './DifficultyFilterMobileTray';
import { CuisineFilterMobileTray } from './CuisineFilterMobileTray';
import type { Difficulty } from '../../types/recipe';
import type { Icon, IconProps } from '@tabler/icons-react';
import {
    IconStopwatch,
    IconTimeDuration5,
    IconTimeDuration15,
    IconTimeDuration30,
    IconTimeDuration60,
    IconHexagonAsterisk,
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
    IconWorldMap,
    IconCarrot,
    IconX,
} from '@tabler/icons-react';

export interface RecipeFilterCriteria {
    searchText: string;
    maxTimeMinutes: number | null;
    difficulties: Difficulty[];
    cuisines: string[];
    isVeg: boolean;
}

export interface RecipeFilterProps {
    onFilterChange: (filters: RecipeFilterCriteria) => void;
    availableCuisines?: string[];
    sticky?: boolean;
    isSticky?: boolean;
    position?: 'top' | 'bottom';
    className?: string;
}

const TIME_OPTIONS = [
    { id: 'time-5', label: '< 5 min', value: '5' },
    { id: 'time-15', label: '< 15 min', value: '15' },
    { id: 'time-30', label: '< 30 min', value: '30' },
    { id: 'time-60', label: '< 1 hr', value: '60' },
];

const TIME_ICON_MAP: Record<string, React.ComponentType<IconProps> | Icon> = {
    '5': IconTimeDuration5,
    '15': IconTimeDuration15,
    '30': IconTimeDuration30,
    '60': IconTimeDuration60,
};

const DIFFICULTY_OPTIONS: { id: string; label: string; value: Difficulty }[] = [
    { id: 'diff-easy', label: 'Easy', value: 'easy' },
    { id: 'diff-med', label: 'Medium', value: 'medium' },
    { id: 'diff-hard', label: 'Hard', value: 'hard' },
];

const DIFFICULTY_ICON_MAP: Record<Difficulty, React.ComponentType<IconProps> | Icon> = {
    easy: IconHexagonLetterE,
    medium: IconHexagonLetterM,
    hard: IconHexagonLetterH,
};

export const RecipeFilter: React.FC<RecipeFilterProps> = ({
    onFilterChange,
    availableCuisines = [],
    sticky = false,
    isSticky,
    position = 'bottom',
    className = '',
}) => {
    const isStickyActive = isSticky !== undefined ? isSticky : sticky;
    const isBottom = position === 'bottom';
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [isVeg, setIsVeg] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Debounce search input to avoid filtering on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 350);

        return () => {
            clearTimeout(handler);
        };
    }, [searchInput]);

    // Propagate filter changes up to parent
    useEffect(() => {
        const maxTime = timeFilter === 'all' ? null : parseInt(timeFilter, 10);
        onFilterChange({
            searchText: debouncedSearch,
            maxTimeMinutes: isNaN(maxTime as number) ? null : maxTime,
            difficulties,
            cuisines,
            isVeg,
        });
    }, [debouncedSearch, timeFilter, difficulties, cuisines, isVeg, onFilterChange]);

    const handleTimeSelect = (val: string) => {
        setTimeFilter((prev) => (prev === val || val === 'all' ? 'all' : val));
    };

    const handleDifficultyToggle = (val: string) => {
        const diff = val as Difficulty;
        setDifficulties((prev) =>
            prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
        );
    };

    const handleCuisineToggle = (val: string) => {
        setCuisines((prev) =>
            prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
        );
    };

    const hasActiveFilters =
        searchInput !== '' ||
        timeFilter !== 'all' ||
        difficulties.length > 0 ||
        cuisines.length > 0 ||
        isVeg;

    const handleResetFilters = () => {
        setSearchInput('');
        setDebouncedSearch('');
        setTimeFilter('all');
        setDifficulties([]);
        setCuisines([]);
        setIsVeg(false);
    };

    const cuisineOptions = availableCuisines.map((c) => ({
        id: `cuisine-${c}`,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        value: c,
    }));

    const timeIcon =
        timeFilter !== 'all' && TIME_ICON_MAP[timeFilter]
            ? TIME_ICON_MAP[timeFilter]
            : IconStopwatch;

    const difficultyIcon =
        difficulties.length === 1 && DIFFICULTY_ICON_MAP[difficulties[0]]
            ? DIFFICULTY_ICON_MAP[difficulties[0]]
            : IconHexagonAsterisk;

    const timeButtonTitle =
        timeFilter !== 'all'
            ? `Max cooking time: < ${timeFilter === '60' ? '1 hr' : `${timeFilter} min`}`
            : 'Max cooking time';

    const difficultyButtonTitle =
        difficulties.length === 1
            ? `Difficulty: ${difficulties[0].charAt(0).toUpperCase() + difficulties[0].slice(1)}`
            : difficulties.length > 1
            ? `Difficulty (${difficulties.length} selected)`
            : 'Difficulty';

    const stickyClasses = isStickyActive
        ? isBottom
            ? 'sticky bottom-0 z-20 bg-background/95 backdrop-blur-md py-3 border-t border-border/40'
            : 'sticky top-0 z-20 bg-background/95 backdrop-blur-md py-3.5 border-b border-border/40'
        : '';

    return (
        <div
            data-recipe-filter-bar="true"
            className={`flex ${isBottom ? 'flex-col-reverse' : 'flex-col'} gap-2.5 w-full ${stickyClasses} ${className}`}
        >
            <div className="flex items-center gap-2 w-full">
                <Searchbar
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder="Search recipes, ingredients, tags..."
                    className="flex-1"
                />

                {/* Filter Dropdowns & Toggles */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <DropdownMenu
                        icon={timeIcon}
                        title="Max cooking time"
                        buttonTitle={timeButtonTitle}
                        ariaLabel={timeButtonTitle}
                        type="radio"
                        items={TIME_OPTIONS}
                        selectedValues={timeFilter}
                        onSelect={handleTimeSelect}
                        hasActiveFilters={timeFilter !== 'all'}
                        placement={isBottom ? 'top' : 'bottom'}
                        open={activeDropdown === 'time'}
                        onOpenChange={(open) => setActiveDropdown(open ? 'time' : null)}
                        mobileLayout={({ close }) => (
                            <TimeFilterMobileTray
                                selectedValue={timeFilter}
                                onSelect={handleTimeSelect}
                                onClose={close}
                            />
                        )}
                    />

                    <DropdownMenu
                        icon={difficultyIcon}
                        title="Difficulty"
                        buttonTitle={difficultyButtonTitle}
                        ariaLabel={difficultyButtonTitle}
                        type="multi"
                        items={DIFFICULTY_OPTIONS}
                        selectedValues={difficulties}
                        onSelect={handleDifficultyToggle}
                        hasActiveFilters={difficulties.length > 0}
                        placement={isBottom ? 'top' : 'bottom'}
                        open={activeDropdown === 'diff'}
                        onOpenChange={(open) => setActiveDropdown(open ? 'diff' : null)}
                        mobileLayout={({ close }) => (
                            <DifficultyFilterMobileTray
                                selectedValues={difficulties}
                                onSelect={handleDifficultyToggle}
                                onClose={close}
                            />
                        )}
                    />

                    {cuisineOptions.length > 0 && (
                        <DropdownMenu
                            icon={IconWorldMap}
                            title="Cuisine"
                            type="multi"
                            items={cuisineOptions}
                            selectedValues={cuisines}
                            onSelect={handleCuisineToggle}
                            hasActiveFilters={cuisines.length > 0}
                            placement={isBottom ? 'top' : 'bottom'}
                            open={activeDropdown === 'cuisine'}
                            onOpenChange={(open) => setActiveDropdown(open ? 'cuisine' : null)}
                            mobileLayout={({ close }) => (
                                <CuisineFilterMobileTray
                                    items={cuisineOptions}
                                    selectedValues={cuisines}
                                    onSelect={handleCuisineToggle}
                                    onClose={close}
                                />
                            )}
                        />
                    )}

                    <ButtonIcon
                        icon={IconCarrot}
                        isToggle
                        active={isVeg}
                        onToggle={setIsVeg}
                        title={isVeg ? 'Vegetarian only (Active)' : 'Filter by Vegetarian'}
                        ariaLabel="Filter by Vegetarian"
                    />
                </div>
            </div>

            {/* Mobile Tray Slot: expands inside the filter, above existing search and filtering tools */}
            <div data-recipe-filter-tray-slot="true" className="w-full empty:hidden" />

            {/* Active filter badges / reset */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-muted-foreground">Filters:</span>
                    {timeFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium">
                            &lt; {timeFilter === '60' ? '1 hr' : `${timeFilter} min`}
                            <button
                                type="button"
                                onClick={() => setTimeFilter('all')}
                                className="hover:text-destructive"
                                aria-label="Remove time filter"
                            >
                                <IconX className="w-3 h-3" stroke={1} />
                            </button>
                        </span>
                    )}
                    {difficulties.map((diff) => (
                        <span
                            key={diff}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium capitalize"
                        >
                            {diff}
                            <button
                                type="button"
                                onClick={() => handleDifficultyToggle(diff)}
                                className="hover:text-destructive"
                                aria-label={`Remove ${diff} filter`}
                            >
                                <IconX className="w-3 h-3" stroke={1} />
                            </button>
                        </span>
                    ))}
                    {cuisines.map((c) => (
                        <span
                            key={c}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium capitalize"
                        >
                            {c}
                            <button
                                type="button"
                                onClick={() => handleCuisineToggle(c)}
                                className="hover:text-destructive"
                                aria-label={`Remove ${c} filter`}
                            >
                                <IconX className="w-3 h-3" stroke={1} />
                            </button>
                        </span>
                    ))}
                    {isVeg && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium">
                            Vegetarian
                            <button
                                type="button"
                                onClick={() => setIsVeg(false)}
                                className="hover:text-destructive"
                                aria-label="Remove vegetarian filter"
                            >
                                <IconX className="w-3 h-3" stroke={1} />
                            </button>
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-primary hover:underline font-medium ml-1"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
};

