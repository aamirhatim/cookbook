import React, { useState, useMemo } from 'react';
import { Searchbar } from './Searchbar';
import { IconButton } from '../atoms/IconButton';
import { FilterButtonGroup } from './FilterButtonGroup';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
    useRecipeFilterState,
    type RecipeFilterCriteria,
} from '../../hooks/useRecipeFilterState';
import {
    IconAdjustmentsHorizontal,
    IconSearch,
} from '@tabler/icons-react';

export type { RecipeFilterCriteria };

export interface RecipeFilterProps {
    onFilterChange: (filters: RecipeFilterCriteria) => void;
    availableCuisines?: string[];
    sticky?: boolean;
    isSticky?: boolean;
    position?: 'top' | 'bottom';
    className?: string;
    showFavoritesFilter?: boolean;
}

/**
 * RecipeFilter component orchestrating the search bar and filter controls.
 * Supports a responsive two-mode toggle on mobile (< 640px) and a unified toolbar on desktop.
 */
export const RecipeFilter: React.FC<RecipeFilterProps> = ({
    onFilterChange,
    availableCuisines = [],
    sticky = false,
    isSticky,
    position = 'bottom',
    className = '',
    showFavoritesFilter = true,
}) => {
    const isStickyActive = isSticky !== undefined ? isSticky : sticky;
    const isBottom = position === 'bottom';
    const isMobile = useIsMobile();

    const [toolbarMode, setToolbarMode] = useState<'search' | 'filters'>('search');
    const [shouldAutoFocusSearch, setShouldAutoFocusSearch] = useState(false);

    const {
        searchInput,
        setSearchInput,
        debouncedSearch,
        timeFilter,
        difficulties,
        cuisines,
        proteins,
        onlyFavorites,
        activeDropdown,
        setActiveDropdown,
        hasActiveFilters,
        handleTimeSelect,
        handleDifficultyToggle,
        handleCuisineToggle,
        handleProteinToggle,
        handleResetFilters,
        handleToggleFavorites,
    } = useRecipeFilterState({ onFilterChange });

    // Memoize cuisine options to avoid unnecessary re-allocations on search keystrokes
    const cuisineOptions = useMemo(
        () =>
            availableCuisines.map((c) => ({
                id: `cuisine-${c}`,
                label: c.charAt(0).toUpperCase() + c.slice(1),
                value: c,
            })),
        [availableCuisines]
    );

    const handleOpenFilters = () => {
        setShouldAutoFocusSearch(false);
        setToolbarMode('filters');
    };

    const handleCollapseToSearch = () => {
        setShouldAutoFocusSearch(true);
        setActiveDropdown(null);
        setToolbarMode('search');
    };

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
                            onFocus={() => setShouldAutoFocusSearch(false)}
                        />

                        <IconButton
                            icon={IconAdjustmentsHorizontal}
                            onClick={handleOpenFilters}
                            active={hasActiveFilters}
                            title={hasActiveFilters ? 'Filters applied (Tap to edit)' : 'Filter recipes'}
                            ariaLabel={hasActiveFilters ? 'Filters applied (Tap to edit)' : 'Filter recipes'}
                            className="shrink-0"
                        />
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto no-scrollbar py-0.5">
                        <div className="flex items-center gap-1.5 w-max mx-auto px-1">
                            {/* Collapsed Search Button */}
                            <IconButton
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
                            <FilterButtonGroup
                                timeFilter={timeFilter}
                                onTimeSelect={handleTimeSelect}
                                difficulties={difficulties}
                                onDifficultyToggle={handleDifficultyToggle}
                                cuisineOptions={cuisineOptions}
                                cuisines={cuisines}
                                onCuisineToggle={handleCuisineToggle}
                                proteins={proteins}
                                onProteinToggle={handleProteinToggle}
                                onlyFavorites={onlyFavorites}
                                onFavoritesToggle={handleToggleFavorites}
                                hasActiveFilters={hasActiveFilters}
                                onResetFilters={handleResetFilters}
                                activeDropdown={activeDropdown}
                                onActiveDropdownChange={setActiveDropdown}
                                position={position}
                                showFavorites={showFavoritesFilter}
                            />
                        </div>
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
                        <FilterButtonGroup
                            timeFilter={timeFilter}
                            onTimeSelect={handleTimeSelect}
                            difficulties={difficulties}
                            onDifficultyToggle={handleDifficultyToggle}
                            cuisineOptions={cuisineOptions}
                            cuisines={cuisines}
                            onCuisineToggle={handleCuisineToggle}
                            proteins={proteins}
                            onProteinToggle={handleProteinToggle}
                            onlyFavorites={onlyFavorites}
                            onFavoritesToggle={handleToggleFavorites}
                            hasActiveFilters={hasActiveFilters}
                            onResetFilters={handleResetFilters}
                            activeDropdown={activeDropdown}
                            onActiveDropdownChange={setActiveDropdown}
                            position={position}
                            showFavorites={showFavoritesFilter}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Tray Slot: expands inside the filter, above existing search and filtering tools */}
            <div data-recipe-filter-tray-slot="true" className="w-full empty:hidden" />
        </div>
    );
};

export default RecipeFilter;
