import { useNavigate } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import { IconButton } from '../components/atoms/IconButton';
import { useAuthModal } from '../hooks/useAuthModal';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import type { Recipe } from '../types/recipe';

export function Home() {
    const navigate = useNavigate();
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
        <div className="space-y-6 w-full">
            <header className="pt-2 flex justify-between items-center gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        All Recipes
                    </h1>
                </div>
                <IconButton
                    icon={IconUser}
                    onClick={handleAccountClick}
                    title="Account"
                    ariaLabel="Account"
                    className="shrink-0"
                />
            </header>

            <main className="w-full">
                <RecipeListContainer
                    filterPosition="top"
                    onRecipeClick={handleRecipeClick}
                />
            </main>
        </div>
    );
}
