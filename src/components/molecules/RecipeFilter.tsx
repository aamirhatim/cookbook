import React, { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { DropdownMenu } from './DropdownMenu';
import { TimeFilterMobileTray } from './TimeFilterMobileTray';
import { DifficultyFilterMobileTray } from './DifficultyFilterMobileTray';
import { CuisineFilterMobileTray } from './CuisineFilterMobileTray';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { Difficulty } from '../../types/recipe';
import {
    IconStopwatch,
    IconHexagonAsterisk,
    IconWorldMap,
    IconCarrot,
    IconHeart,
    IconHeartFilled,
    IconAdjustmentsHorizontal,
    IconSearch,
    IconWashDrycleanOff,
} from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import {
    TIME_OPTIONS,
    TIME_ICON_MAP,
    DIFFICULTY_OPTIONS,
    DIFFICULTY_ICON_MAP,
} from './recipeFilterConstants';

export interface RecipeFilterCriteria {
    searchText: string;
    maxTimeMinutes: number | null;
    difficulties: Difficulty[];
    cuisines: string[];
    isVeg: boolean;
    onlyFavorites: boolean;
}

export interface RecipeFilterProps {
    onFilterChange: (filters: RecipeFilterCriteria) => void;
    availableCuisines?: string[];
    sticky?: boolean;
    isSticky?: boolean;
    position?: 'top' | 'bottom';
    className?: string;
}

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
    const isMobile = useMediaQuery('(max-width: 639px)');
    const { user } = useAuth();
    const { requireAuth } = useAuthModal();
    const [toolbarMode, setToolbarMode] = useState<'search' | 'filters'>('search');
    const [shouldAutoFocusSearch, setShouldAutoFocusSearch] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [isVeg, setIsVeg] = useState<boolean>(false);
    const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const hasActiveFilters =
        timeFilter !== 'all' ||
        difficulties.length > 0 ||
        cuisines.length > 0 ||
        isVeg ||
        onlyFavorites;

    // If user signs out, reset favorites filter
    useEffect(() => {
        if (!user && onlyFavorites) {
            setOnlyFavorites(false);
        }
    }, [user, onlyFavorites]);

    // Debounce search input to avoid filtering on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 350);
        return () => clearTimeout(handler);
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
            onlyFavorites,
        });
    }, [debouncedSearch, timeFilter, difficulties, cuisines, isVeg, onlyFavorites, onFilterChange]);

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

    const handleResetFilters = () => {
        setTimeFilter('all');
        setDifficulties([]);
        setCuisines([]);
        setIsVeg(false);
        setOnlyFavorites(false);
        setActiveDropdown(null);
    };

    const handleOpenFilters = () => {
        setShouldAutoFocusSearch(false);
        setToolbarMode('filters');
    };

    const handleCollapseToSearch = () => {
        setShouldAutoFocusSearch(true);
        setActiveDropdown(null);
        setToolbarMode('search');
    };

    const handleToggleFavorites = (active: boolean) => {
        if (active && !user) {
            requireAuth(() => setOnlyFavorites(true), {
                title: 'View Favorites',
                description: 'Sign in or create an account to view your favorited recipes.',
            });
            return;
        }
        setOnlyFavorites(active);
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

    const renderFilterButtons = () => (
        <>
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

            <ButtonIcon
                icon={IconHeart}
                activeIcon={IconHeartFilled}
                isToggle
                active={onlyFavorites}
                onToggle={handleToggleFavorites}
                title={onlyFavorites ? 'Favorites only (Active)' : 'Filter by Favorites'}
                ariaLabel="Filter by Favorites"
                activeClassName="text-destructive border-destructive/40 focus:ring-destructive/30"
                inactiveClassName="text-muted-foreground hover:text-destructive hover:border-destructive/20"
            />

            <ButtonIcon
                icon={IconWashDrycleanOff}
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                title={hasActiveFilters ? 'Reset all filters' : 'No filters applied'}
                ariaLabel="Reset all filters"
                className={hasActiveFilters ? 'text-destructive/80 hover:text-destructive hover:border-destructive/30' : ''}
            />
        </>
    );

    return (
        <div
            data-recipe-filter-bar="true"
            className={`flex ${isBottom ? 'flex-col-reverse' : 'flex-col'} gap-2.5 w-full ${stickyClasses} ${className}`}
        >
            {isMobile ? (
                /* Mobile: Toggle view between Search Mode and Filters Mode */
                toolbarMode === 'search' ? (
                    <div className="flex items-center gap-2 w-full">
                        <Searchbar
                            value={searchInput}
                            onChange={setSearchInput}
                            placeholder="Search recipes, ingredients, tags..."
                            className="flex-1 min-w-0"
                            autoFocus={shouldAutoFocusSearch}
                        />

                        <ButtonIcon
                            icon={IconAdjustmentsHorizontal}
                            onClick={handleOpenFilters}
                            active={hasActiveFilters}
                            title={hasActiveFilters ? 'Filters applied (Tap to edit)' : 'Filter recipes'}
                            ariaLabel={hasActiveFilters ? 'Filters applied (Tap to edit)' : 'Filter recipes'}
                            className="shrink-0"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-1.5 w-full overflow-x-auto no-scrollbar py-0.5">
                        {/* Collapsed Search Button */}
                        <ButtonIcon
                            icon={IconSearch}
                            onClick={handleCollapseToSearch}
                            active={Boolean(debouncedSearch || searchInput)}
                            title={
                                searchInput
                                    ? `Search: "${searchInput}" (Tap to expand)`
                                    : 'Search recipes (Tap to expand)'
                            }
                            ariaLabel={
                                searchInput
                                    ? `Search: "${searchInput}" (Tap to expand)`
                                    : 'Search recipes (Tap to expand)'
                            }
                            className="shrink-0"
                        />

                        {/* Divider line between search button and filter buttons */}
                        <div className="h-6 w-px bg-border shrink-0 mx-0.5" aria-hidden="true" />

                        {/* Centered Filter Buttons & Reset */}
                        {renderFilterButtons()}
                    </div>
                )
            ) : (
                /* Desktop / Tablet: Always show full Search bar and all filter buttons */
                <div className="flex items-center gap-2 w-full">
                    <Searchbar
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search recipes, ingredients, tags..."
                        className="flex-1 min-w-0"
                    />

                    <div className="flex items-center gap-1.5 shrink-0">
                        {renderFilterButtons()}
                    </div>
                </div>
            )}

            {/* Mobile Tray Slot: expands inside the filter, above existing search and filtering tools */}
            <div data-recipe-filter-tray-slot="true" className="w-full empty:hidden" />
        </div>
    );
};
