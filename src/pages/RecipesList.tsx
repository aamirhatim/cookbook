import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { ButtonIcon } from '../components/atoms/ButtonIcon';
import type { Recipe } from '../types/recipe';

export function RecipesList() {
    const navigate = useNavigate();

    const handleRecipeClick = (recipe: Recipe) => {
        navigate(`/recipes/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div className="space-y-6 w-full">
            <header className="pt-2 flex items-center space-x-3">
                <ButtonIcon
                    icon={IconArrowLeft}
                    onClick={() => navigate(-1)}
                    title="Go back"
                    ariaLabel="Go back"
                    className="shrink-0"
                />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Recipes
                    </h1>
                </div>
            </header>

            <main className="w-full">
                <RecipeListContainer onRecipeClick={handleRecipeClick} />
            </main>
        </div>
    );
}
