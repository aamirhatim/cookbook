import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';
import { useToast } from '../hooks/useToast';
import { addFavoriteRecipe, removeFavoriteRecipe } from '../services/users';

export interface FavoritesContextType {
    favorites: string[];
    isFavorite: (recipeId: string) => boolean;
    toggleFavorite: (recipeId: string) => Promise<void>;
    addFavorite: (recipeId: string) => Promise<void>;
    removeFavorite: (recipeId: string) => Promise<void>;
    loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { requireAuth } = useAuthModal();
    const { showToast } = useToast();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Subscribe to the authenticated user's profile document for real-time favorites updates
    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(
            userDocRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
                } else {
                    setFavorites([]);
                }
                setLoading(false);
            },
            (err) => {
                console.error('Error subscribing to favorites:', err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // O(1) set for fast lookup
    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    const isFavorite = useCallback(
        (recipeId: string): boolean => {
            return favoritesSet.has(recipeId);
        },
        [favoritesSet]
    );

    const toggleFavorite = useCallback(
        async (recipeId: string): Promise<void> => {
            if (!user) {
                requireAuth(() => toggleFavorite(recipeId), {
                    title: 'Save to Favorites',
                    description: 'Sign in or create an account to save recipes to your favorites.',
                });
                return;
            }

            const isCurrentlyFav = favoritesSet.has(recipeId);
            const prevFavorites = favorites;

            // Optimistic update
            setFavorites((prev) =>
                isCurrentlyFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
            );

            try {
                if (isCurrentlyFav) {
                    await removeFavoriteRecipe(user.uid, recipeId);
                } else {
                    await addFavoriteRecipe(user.uid, recipeId);
                }
                // Intentionally silent on success (no toast)
            } catch (err) {
                console.error('Failed to toggle favorite:', err);
                // Rollback optimistic update
                setFavorites(prevFavorites);
                showToast('Failed to update favorites. Please try again.', 'error');
            }
        },
        [user, favoritesSet, favorites, requireAuth, showToast]
    );

    const addFavorite = useCallback(
        async (recipeId: string): Promise<void> => {
            if (!user) {
                requireAuth(() => addFavorite(recipeId), {
                    title: 'Save to Favorites',
                    description: 'Sign in or create an account to save recipes to your favorites.',
                });
                return;
            }

            if (favoritesSet.has(recipeId)) return;

            const prevFavorites = favorites;
            setFavorites((prev) => [...prev, recipeId]);

            try {
                await addFavoriteRecipe(user.uid, recipeId);
            } catch (err) {
                console.error('Failed to add favorite:', err);
                setFavorites(prevFavorites);
                showToast('Failed to add favorite. Please try again.', 'error');
            }
        },
        [user, favoritesSet, favorites, requireAuth, showToast]
    );

    const removeFavorite = useCallback(
        async (recipeId: string): Promise<void> => {
            if (!user) return;

            if (!favoritesSet.has(recipeId)) return;

            const prevFavorites = favorites;
            setFavorites((prev) => prev.filter((id) => id !== recipeId));

            try {
                await removeFavoriteRecipe(user.uid, recipeId);
            } catch (err) {
                console.error('Failed to remove favorite:', err);
                setFavorites(prevFavorites);
                showToast('Failed to remove favorite. Please try again.', 'error');
            }
        },
        [user, favoritesSet, favorites, showToast]
    );

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
                addFavorite,
                removeFavorite,
                loading,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};
