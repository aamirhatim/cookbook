import React from 'react';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { DropdownMenu } from './DropdownMenu';
import { TimeFilterMobileTray } from './TimeFilterMobileTray';
import { DifficultyFilterMobileTray } from './DifficultyFilterMobileTray';
import { CuisineFilterMobileTray } from './CuisineFilterMobileTray';
import type { Difficulty } from '../../types/recipe';
import {
    IconStopwatch,
    IconHexagonAsterisk,
    IconWorldMap,
    IconCarrot,
    IconHeart,
    IconHeartFilled,
    IconWashDrycleanOff,
} from '@tabler/icons-react';
import {
    TIME_OPTIONS,
    TIME_ICON_MAP,
    DIFFICULTY_OPTIONS,
    DIFFICULTY_ICON_MAP,
} from './recipeFilterConstants';

export interface CuisineOption {
    id: string;
    label: string;
    value: string;
}

export interface FilterButtonGroupProps {
    timeFilter: string;
    onTimeSelect: (val: string) => void;
    difficulties: Difficulty[];
    onDifficultyToggle: (diff: Difficulty) => void;
    cuisineOptions?: CuisineOption[];
    cuisines: string[];
    onCuisineToggle: (cuisine: string) => void;
    isVeg: boolean;
    onVegToggle: (active: boolean) => void;
    onlyFavorites: boolean;
    onFavoritesToggle: (active: boolean) => void;
    hasActiveFilters: boolean;
    onResetFilters: () => void;
    activeDropdown: string | null;
    onActiveDropdownChange: (dropdown: string | null) => void;
    position?: 'top' | 'bottom';
    showFavorites?: boolean;
}

/**
 * FilterButtonGroup molecule rendering the complete set of cooking filter controls:
 * Time, Difficulty, Cuisine, Vegetarian, Favorites, and Reset.
 */
export const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({
    timeFilter,
    onTimeSelect,
    difficulties,
    onDifficultyToggle,
    cuisineOptions = [],
    cuisines,
    onCuisineToggle,
    isVeg,
    onVegToggle,
    onlyFavorites,
    onFavoritesToggle,
    hasActiveFilters,
    onResetFilters,
    activeDropdown,
    onActiveDropdownChange,
    position = 'bottom',
    showFavorites = true,
}) => {
    const isBottom = position === 'bottom';

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

    return (
        <>
            <DropdownMenu
                icon={timeIcon}
                title="Max cooking time"
                buttonTitle={timeButtonTitle}
                ariaLabel={timeButtonTitle}
                type="radio"
                items={TIME_OPTIONS}
                selectedValues={timeFilter}
                onSelect={onTimeSelect}
                hasActiveFilters={timeFilter !== 'all'}
                placement={isBottom ? 'top' : 'bottom'}
                open={activeDropdown === 'time'}
                onOpenChange={(open) => onActiveDropdownChange(open ? 'time' : null)}
                mobileLayout={({ close }) => (
                    <TimeFilterMobileTray
                        selectedValue={timeFilter}
                        onSelect={onTimeSelect}
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
                onSelect={(val) => onDifficultyToggle(val as Difficulty)}
                hasActiveFilters={difficulties.length > 0}
                placement={isBottom ? 'top' : 'bottom'}
                open={activeDropdown === 'diff'}
                onOpenChange={(open) => onActiveDropdownChange(open ? 'diff' : null)}
                mobileLayout={({ close }) => (
                    <DifficultyFilterMobileTray
                        selectedValues={difficulties}
                        onSelect={(val) => onDifficultyToggle(val as Difficulty)}
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
                    onSelect={onCuisineToggle}
                    hasActiveFilters={cuisines.length > 0}
                    placement={isBottom ? 'top' : 'bottom'}
                    open={activeDropdown === 'cuisine'}
                    onOpenChange={(open) => onActiveDropdownChange(open ? 'cuisine' : null)}
                    mobileLayout={({ close }) => (
                        <CuisineFilterMobileTray
                            items={cuisineOptions}
                            selectedValues={cuisines}
                            onSelect={onCuisineToggle}
                            onClose={close}
                        />
                    )}
                />
            )}

            <ButtonIcon
                icon={IconCarrot}
                isToggle
                active={isVeg}
                onToggle={onVegToggle}
                title={isVeg ? 'Vegetarian only (Active)' : 'Filter by Vegetarian'}
                ariaLabel="Filter by Vegetarian"
            />

            {showFavorites && (
                <ButtonIcon
                    icon={IconHeart}
                    activeIcon={IconHeartFilled}
                    isToggle
                    active={onlyFavorites}
                    onToggle={onFavoritesToggle}
                    title={onlyFavorites ? 'Favorites only (Active)' : 'Filter by Favorites'}
                    ariaLabel="Filter by Favorites"
                    activeClassName="text-destructive border-destructive/40 focus:ring-destructive/30"
                    inactiveClassName="text-muted-foreground hover:text-destructive hover:border-destructive/20"
                />
            )}

            <ButtonIcon
                icon={IconWashDrycleanOff}
                onClick={onResetFilters}
                disabled={!hasActiveFilters}
                title={hasActiveFilters ? 'Reset all filters' : 'No filters applied'}
                ariaLabel="Reset all filters"
                className={hasActiveFilters ? 'text-destructive/80 hover:text-destructive hover:border-destructive/30' : ''}
            />
        </>
    );
};

export default FilterButtonGroup;
