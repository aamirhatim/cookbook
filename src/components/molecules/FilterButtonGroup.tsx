import React from 'react';
import { IconButton } from '../atoms/IconButton';
import { DropdownMenu } from './DropdownMenu';
import { TimeFilterMobileTray } from './TimeFilterMobileTray';
import { DifficultyFilterMobileTray } from './DifficultyFilterMobileTray';
import { CuisineFilterMobileTray } from './CuisineFilterMobileTray';
import { ProteinFilterMobileTray } from './ProteinFilterMobileTray';
import type { Difficulty } from '../../types/recipe';
import {
    IconStopwatch,
    IconHexagonAsterisk,
    IconWorldMap,
    IconCube,
    IconHeart,
    IconHeartFilled,
    IconWashDrycleanOff,
} from '@tabler/icons-react';
import {
    TIME_OPTIONS,
    TIME_ICON_MAP,
    DIFFICULTY_OPTIONS,
    DIFFICULTY_ICON_MAP,
    PROTEIN_FILTER_OPTIONS,
    PROTEIN_FILTER_ICON_MAP,
    type ProteinFilterValue,
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
    proteins: ProteinFilterValue[];
    onProteinToggle: (protein: ProteinFilterValue) => void;
    isVeg?: boolean;
    onVegToggle?: (active: boolean) => void;
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
 * Time, Difficulty, Cuisine, Protein & Veg, Favorites, and Reset.
 */
export const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({
    timeFilter,
    onTimeSelect,
    difficulties,
    onDifficultyToggle,
    cuisineOptions = [],
    cuisines,
    onCuisineToggle,
    proteins,
    onProteinToggle,
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

    const proteinIcon =
        proteins.length === 1 && PROTEIN_FILTER_ICON_MAP[proteins[0]]
            ? PROTEIN_FILTER_ICON_MAP[proteins[0]]
            : IconCube;

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

    const proteinButtonTitle =
        proteins.length === 1
            ? `Protein: ${PROTEIN_FILTER_OPTIONS.find((o) => o.value === proteins[0])?.label || proteins[0]}`
            : proteins.length > 1
                ? `Protein (${proteins.length} selected)`
                : 'Filter by protein and vegetarian';

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

            <DropdownMenu
                icon={proteinIcon}
                title="Protein & Veg"
                buttonTitle={proteinButtonTitle}
                ariaLabel={proteinButtonTitle}
                type="multi"
                items={PROTEIN_FILTER_OPTIONS}
                selectedValues={proteins}
                onSelect={(val) => onProteinToggle(val as ProteinFilterValue)}
                hasActiveFilters={proteins.length > 0}
                placement={isBottom ? 'top' : 'bottom'}
                open={activeDropdown === 'protein'}
                onOpenChange={(open) => onActiveDropdownChange(open ? 'protein' : null)}
                mobileLayout={({ close }) => (
                    <ProteinFilterMobileTray
                        selectedValues={proteins}
                        onSelect={(val) => onProteinToggle(val as ProteinFilterValue)}
                        onClose={close}
                    />
                )}
            />

            {showFavorites && (
                <IconButton
                    icon={IconHeart}
                    activeIcon={IconHeartFilled}
                    isToggle
                    active={onlyFavorites}
                    onToggle={onFavoritesToggle}
                    title={onlyFavorites ? 'Favorites only (Active)' : 'Filter by Favorites'}
                    ariaLabel="Filter by Favorites"
                />
            )}

            <IconButton
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
