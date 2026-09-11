import { useNavigate } from 'react-router-dom';
import { IconCarrot, IconHeart, IconMilk, IconNotebook, IconPlant2 } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { RecipeScrollSection } from '../components/organisms/RecipeScrollSection';
import { SectionHeader } from '../components/molecules/SectionHeader';
import type { Recipe } from '../types/recipe';

export function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { recipes } = useRecipes();

    const handleRecipeClick = (recipe: Recipe) => {
        navigate(`/recipes/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div className="w-full space-y-8">
            {user && (
                <RecipeScrollSection
                    title="Favorites"
                    icon={IconHeart}
                    recipes={recipes}
                    filter={{ onlyFavorites: true }}
                    showFavorite={false}
                    onRecipeClick={handleRecipeClick}
                />
            )}

            <RecipeScrollSection
                title="Veg life"
                icon={IconCarrot}
                recipes={recipes}
                filter={{
                    isVeg: true,
                    excludeTags: ['condiments', 'essentials'],
                }}
                showProteinVeg={false}
                onRecipeClick={handleRecipeClick}
            />

            <RecipeScrollSection
                title="For the pantry"
                icon={IconMilk}
                recipes={recipes}
                showTags={false}
                filter={{
                    includeTags: ['condiments', 'pantry'],
                }}
                onRecipeClick={handleRecipeClick}
            />

            <RecipeScrollSection
                title="Desi foods"
                icon={IconPlant2}
                recipes={recipes}
                showCuisine={false}
                filter={{
                    cuisine: ['india', 'pakistan', 'southeast asia', 'sri lanka'],
                }}
                onRecipeClick={handleRecipeClick}
            />

            <section aria-label="All Recipes">
                <SectionHeader
                    title="All Recipes"
                    icon={IconNotebook}
                />

                <RecipeListContainer
                    recipes={recipes}
                    filterPosition="top"
                    onRecipeClick={handleRecipeClick}
                />
            </section>
        </div>
    );
}
