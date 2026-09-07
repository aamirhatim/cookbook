import React, { useState, useEffect } from 'react';
import { Searchbar } from '../atoms/Searchbar';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { DropdownMenu } from './DropdownMenu';
import type { Difficulty } from '../../types/recipe';
import { IconStopwatch, IconHexagonAsterisk, IconWorldMap, IconCarrot, IconX } from '@tabler/icons-react';

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
  className?: string;
}

const TIME_OPTIONS = [
  { id: 'time-all', label: 'Any time', value: 'all' },
  { id: 'time-15', label: '< 15 min', value: '15' },
  { id: 'time-30', label: '< 30 min', value: '30' },
  { id: 'time-60', label: '< 1 hr', value: '60' },
];

const DIFFICULTY_OPTIONS: { id: string; label: string; value: Difficulty }[] = [
  { id: 'diff-easy', label: 'Easy', value: 'easy' },
  { id: 'diff-med', label: 'Medium', value: 'medium' },
  { id: 'diff-hard', label: 'Hard', value: 'hard' },
];

export const RecipeFilter: React.FC<RecipeFilterProps> = ({
  onFilterChange,
  availableCuisines = [],
  className = '',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [isVeg, setIsVeg] = useState<boolean>(false);

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
    setTimeFilter(val);
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

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
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
            icon={IconStopwatch}
            title="Filter by Time"
            type="radio"
            items={TIME_OPTIONS}
            selectedValues={timeFilter}
            onSelect={handleTimeSelect}
            hasActiveFilters={timeFilter !== 'all'}
          />

          <DropdownMenu
            icon={IconHexagonAsterisk}
            title="Filter by Difficulty"
            type="multi"
            items={DIFFICULTY_OPTIONS}
            selectedValues={difficulties}
            onSelect={handleDifficultyToggle}
            hasActiveFilters={difficulties.length > 0}
          />

          {cuisineOptions.length > 0 && (
            <DropdownMenu
              icon={IconWorldMap}
              title="Filter by Cuisine"
              type="multi"
              items={cuisineOptions}
              selectedValues={cuisines}
              onSelect={handleCuisineToggle}
              hasActiveFilters={cuisines.length > 0}
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

