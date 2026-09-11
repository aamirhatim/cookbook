import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight, type Icon, type IconProps } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import { SectionHeader } from '../molecules/SectionHeader';
import { RecipeTile } from './RecipeTile';
import { subscribeToRecipes } from '../../services/recipes';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useFavorites } from '../../hooks/useFavorites';
import type { Recipe } from '../../types/recipe';

export interface RecipeScrollSectionFilter {
    isVeg?: boolean;
    cuisine?: string;
    includeTags?: string[];
    excludeTags?: string[];
    authorId?: string;
    onlyFavorites?: boolean;
    predicate?: (recipe: Recipe) => boolean;
}

export interface RecipeScrollSectionProps {
    title: string;
    icon?: React.ComponentType<IconProps> | Icon | React.ReactNode;
    recipes?: Recipe[];
    filter?: RecipeScrollSectionFilter;
    onRecipeClick?: (recipe: Recipe) => void;
    className?: string;
    showTags?: boolean;
    showCuisine?: boolean;
    showProteinVeg?: boolean;
    showFavorite?: boolean;
}

export const RecipeScrollSection: React.FC<RecipeScrollSectionProps> = ({
    title,
    icon,
    recipes: propRecipes,
    filter,
    onRecipeClick,
    className = '',
    showTags,
    showCuisine,
    showProteinVeg,
    showFavorite,
}) => {
    const isMobile = useIsMobile();
    const { isFavorite, favorites, loading: favoritesLoading } = useFavorites();
    const [internalRecipes, setInternalRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(!propRecipes);

    useEffect(() => {
        if (propRecipes) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToRecipes(
            filter?.authorId ? { authorId: filter.authorId } : {},
            (fetched) => {
                setInternalRecipes(fetched);
                setLoading(false);
            },
            (error) => {
                console.error('Failed to subscribe to recipes:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [propRecipes, filter?.authorId]);

    const allRecipes = propRecipes ?? internalRecipes;

    const displayedRecipes = React.useMemo(() => {
        if (!filter) return allRecipes;
        return allRecipes.filter((recipe) => {
            if (filter.onlyFavorites && !isFavorite(recipe.id)) {
                return false;
            }
            if (filter.isVeg !== undefined && Boolean(recipe.isVeg) !== filter.isVeg) {
                return false;
            }
            if (filter.cuisine && recipe.cuisine?.toLowerCase() !== filter.cuisine.toLowerCase()) {
                return false;
            }
            if (filter.includeTags && filter.includeTags.length > 0) {
                const lowerIncluded = filter.includeTags.map((t) => t.toLowerCase());
                if (!recipe.tags?.some((t) => lowerIncluded.includes(t.toLowerCase()))) {
                    return false;
                }
            }
            if (filter.excludeTags && filter.excludeTags.length > 0) {
                const lowerExcluded = filter.excludeTags.map((t) => t.toLowerCase());
                if (recipe.tags?.some((t) => lowerExcluded.includes(t.toLowerCase()))) {
                    return false;
                }
            }
            if (filter.predicate && !filter.predicate(recipe)) {
                return false;
            }
            return true;
        });
    }, [allRecipes, filter, isFavorite]);

    const {
        containerRef,
        canScrollLeft,
        canScrollRight,
        scroll,
        updateScrollBounds,
    } = useHorizontalScroll<HTMLDivElement>({
        itemsToScroll: isMobile ? 1 : 2,
        dependencies: [displayedRecipes, isMobile],
    });

    const isFavoritesEmpty = Boolean(filter?.onlyFavorites && !favoritesLoading && favorites.length === 0);

    if (isFavoritesEmpty) {
        return null;
    }

    if (!loading && displayedRecipes.length === 0) {
        return null;
    }

    const buttonSize = isMobile ? 'medium' : 'small';

    const scrollActions = (
        <>
            <IconButton
                icon={IconChevronLeft}
                size={buttonSize}
                variant="secondary"
                ariaLabel="Scroll left"
                title="Scroll left"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
            />
            <IconButton
                icon={IconChevronRight}
                size={buttonSize}
                variant="secondary"
                ariaLabel="Scroll right"
                title="Scroll right"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
            />
        </>
    );

    return (
        <section aria-label={title} className={`w-full relative ${className}`}>
            <SectionHeader
                title={title}
                icon={icon}
                rightAction={scrollActions}
            />

            {/* Horizontal scrollable track */}
            <div
                ref={containerRef}
                onScroll={updateScrollBounds}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory scroll-px-1 py-1 px-1 focus:outline-none"
                tabIndex={0}
                role="region"
                aria-label={`${title} recipes`}
            >
                {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={`skeleton-${idx}`}
                            className="w-[240px] sm:w-[280px] shrink-0 snap-start rounded-2xl bg-surface border border-border overflow-hidden flex flex-col"
                        >
                            <div className="aspect-[16/10] w-full bg-surface-hover animate-pulse border-b border-border" />
                            <div className="p-4 flex-1 flex flex-col justify-between gap-3 w-full">
                                <div className="h-7 bg-surface-hover rounded-md w-3/4 animate-pulse" />
                                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                                    <div className="h-3.5 bg-surface-hover rounded w-1/3 animate-pulse" />
                                    <div className="h-3.5 bg-surface-hover rounded w-1/4 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    displayedRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="w-[240px] sm:w-[280px] shrink-0 snap-start"
                        >
                            <RecipeTile
                                recipe={recipe}
                                onClick={onRecipeClick}
                                showTags={showTags}
                                showCuisine={showCuisine}
                                showProteinVeg={showProteinVeg}
                                showFavorite={showFavorite}
                            />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default RecipeScrollSection;
