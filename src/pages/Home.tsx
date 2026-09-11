import { useNavigate } from 'react-router-dom';
import { IconCarrot, IconHeart, IconNotebook, IconUser } from '@tabler/icons-react';
import { IconButton } from '../components/atoms/IconButton';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../hooks/useAuthModal';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { RecipeScrollSection } from '../components/organisms/RecipeScrollSection';
import { SectionHeader } from '../components/molecules/SectionHeader';
import type { Recipe } from '../types/recipe';

export function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { requireAuth } = useAuthModal();

    const handleAccountClick = () => {
        requireAuth(
            () => {
                navigate('/account');
            },
            {
                title: 'Account',
                description: 'Sign in or create an account to view and manage your profile.',
            }
        );
    };

    const handleRecipeClick = (recipe: Recipe) => {
        navigate(`/recipes/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div className="w-full space-y-6 lg:space-y-0 lg:flex lg:gap-4 lg:items-start">
            <header
                aria-label="Page Header"
                className="pt-2 flex justify-between items-center gap-4 lg:pt-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:flex-col lg:justify-between lg:items-center lg:w-auto lg:shrink-0 lg:py-2 lg:px-2"
            >
                <div className="min-w-0 flex-1 lg:flex-none lg:w-full lg:flex lg:flex-col lg:items-center">
                    <h1 className="text-4xl sm:text-5xl bungee-tint-regular palette-bungee-culinary text-foreground lg:writing-vertical-upright lg:text-5xl xl:text-6xl lg:tracking-tight lg:uppercase select-none text-left lg:text-center">
                        The Cookbook
                    </h1>
                </div>
                <div className="shrink-0 lg:mt-auto lg:w-full lg:flex lg:items-center lg:justify-center">
                    <IconButton
                        icon={IconUser}
                        onClick={handleAccountClick}
                        title="Account"
                        ariaLabel="Account"
                    />
                </div>
            </header>

            <main className="w-full lg:flex-1 lg:min-w-0 space-y-8">
                {user && (
                    <RecipeScrollSection
                        title="Favorites"
                        icon={IconHeart}
                        filter={{ onlyFavorites: true }}
                        showFavorite={false}
                        onRecipeClick={handleRecipeClick}
                    />
                )}

                <RecipeScrollSection
                    title="Veg life"
                    icon={IconCarrot}
                    filter={{
                        isVeg: true,
                        excludeTags: ['condiments', 'essentials'],
                    }}
                    showProteinVeg={false}
                    onRecipeClick={handleRecipeClick}
                />

                <section aria-label="All Recipes">
                    <SectionHeader
                        title="All Recipes"
                        icon={IconNotebook}
                    />

                    <RecipeListContainer
                        filterPosition="top"
                        onRecipeClick={handleRecipeClick}
                    />
                </section>
            </main>
        </div>
    );
}
