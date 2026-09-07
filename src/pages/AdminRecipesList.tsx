import { signOut } from 'firebase/auth';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { ButtonIcon } from '../components/atoms/ButtonIcon';
import type { Recipe } from '../types/recipe';

export function AdminRecipesList() {
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
                <ButtonIcon
                    icon={IconLogout}
                    onClick={handleSignOut}
                    title="Sign Out"
                    ariaLabel="Sign Out"
                />
            </header>

            <main className="w-full">
                <RecipeListContainer onRecipeClick={handleRecipeClick} />
            </main>
        </div>
    );
}

