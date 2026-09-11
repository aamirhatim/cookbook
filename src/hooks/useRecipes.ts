import { useState, useEffect } from 'react';
import { subscribeToRecipes } from '../services/recipes';
import type { Recipe, RecipeFilters } from '../types/recipe';

export interface UseRecipesResult {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
}

export function useRecipes(filters?: RecipeFilters): UseRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const authorId = filters?.authorId;
    const includeUnpublished = filters?.includeUnpublished;

    useEffect(() => {
        setLoading(true);
        setError(null);

        const queryFilters: RecipeFilters = {
            ...(authorId ? { authorId } : {}),
            ...(includeUnpublished !== undefined ? { includeUnpublished } : {}),
        };

        const unsubscribe = subscribeToRecipes(
            queryFilters,
            (fetched) => {
                setRecipes(fetched);
                setLoading(false);
            },
            (err) => {
                console.error('Error in useRecipes subscription:', err);
                setError('Failed to load recipes. Please try again.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [authorId, includeUnpublished]);

    return { recipes, loading, error };
}
