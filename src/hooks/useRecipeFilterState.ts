import { useState, useEffect, useRef } from 'react';
import type { Difficulty } from '../types/recipe';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';

export interface RecipeFilterCriteria {
    searchText: string;
    maxTimeMinutes: number | null;
    difficulties: Difficulty[];
    cuisines: string[];
    isVeg: boolean;
    onlyFavorites: boolean;
}

export interface UseRecipeFilterStateOptions {
    onFilterChange: (filters: RecipeFilterCriteria) => void;
}

/**
 * Custom hook encapsulating search debouncing, recipe filter state, and auth guards.
 */
export function useRecipeFilterState({ onFilterChange }: UseRecipeFilterStateOptions) {
    const { user } = useAuth();
    const { requireAuth } = useAuthModal();

    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [isVeg, setIsVeg] = useState<boolean>(false);
    const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Keep onFilterChange ref updated to prevent unnecessary re-runs
    const onFilterChangeRef = useRef(onFilterChange);
    useEffect(() => {
        onFilterChangeRef.current = onFilterChange;
    }, [onFilterChange]);

    const hasActiveFilters =
        timeFilter !== 'all' ||
        difficulties.length > 0 ||
        cuisines.length > 0 ||
        isVeg ||
        onlyFavorites;

    // Reset favorites filter if user signs out
    useEffect(() => {
        if (!user && onlyFavorites) {
            setOnlyFavorites(false);
        }
    }, [user, onlyFavorites]);

    // Debounce search input to avoid re-filtering on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 350);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Propagate filter criteria changes up to parent
    useEffect(() => {
        const maxTime = timeFilter === 'all' ? null : parseInt(timeFilter, 10);
        onFilterChangeRef.current({
            searchText: debouncedSearch,
            maxTimeMinutes: isNaN(maxTime as number) ? null : maxTime,
            difficulties,
            cuisines,
            isVeg,
            onlyFavorites,
        });
    }, [debouncedSearch, timeFilter, difficulties, cuisines, isVeg, onlyFavorites]);

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

    return {
        searchInput,
        setSearchInput,
        debouncedSearch,
        timeFilter,
        difficulties,
        cuisines,
        isVeg,
        setIsVeg,
        onlyFavorites,
        activeDropdown,
        setActiveDropdown,
        hasActiveFilters,
        handleTimeSelect,
        handleDifficultyToggle,
        handleCuisineToggle,
        handleResetFilters,
        handleToggleFavorites,
    };
}
