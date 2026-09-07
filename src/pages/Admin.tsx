import { signOut } from 'firebase/auth';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import type { Recipe } from '../types/recipe';

export function Admin() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleRecipeClick = (recipe: Recipe) => {
        navigate(`/admin/recipes/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div className="space-y-6 w-full">
            <header className="pt-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Recipes Editor
                    </h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
                    title="Sign Out"
                    aria-label="Sign Out"
                >
                    <IconLogout className="w-5 h-5" stroke={1} />
                </button>
            </header>

            <main className="w-full">
                <RecipeListContainer onRecipeClick={handleRecipeClick} />
            </main>
        </div>
    );
}

