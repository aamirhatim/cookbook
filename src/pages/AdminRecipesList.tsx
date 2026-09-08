import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { ButtonIcon } from '../components/atoms/ButtonIcon';
import { useToast } from '../hooks/useToast';
import { deleteRecipe } from '../services/recipes';
import type { Recipe } from '../types/recipe';

export function AdminRecipesList() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleEditRecipe = (recipe: Recipe) => {
        navigate(`/admin/recipes/${recipe.id}`, { state: { recipe } });
    };

    const handleDeleteRecipe = async (recipe: Recipe) => {
        try {
            await deleteRecipe(recipe.id);
            showToast(`Recipe "${recipe.title}" deleted.`, 'success');
        } catch (error) {
            console.error('Failed to delete recipe:', error);
            showToast('Failed to delete recipe. Please try again.', 'error');
        }
    };

    const handleTogglePublish = (recipe: Recipe) => {
        showToast(`Publishing settings for "${recipe.title}" coming soon.`, 'info');
    };

    return (
        <div className="space-y-6 w-full">
            <header className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                    <ButtonIcon
                        icon={IconArrowLeft}
                        onClick={() => navigate(-1)}
                        title="Go back"
                        ariaLabel="Go back"
                        className="shrink-0"
                    />
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                            Recipes Editor
                        </h1>
                    </div>
                </div>

                <ButtonIcon
                    icon={IconPlus}
                    onClick={() => navigate('/admin/recipes/new')}
                    title="Add new recipe"
                    ariaLabel="Add new recipe"
                    className="shrink-0"
                />
            </header>

            <main className="w-full">
                <RecipeListContainer
                    viewMode="admin"
                    onRecipeClick={handleEditRecipe}
                    onEditRecipe={handleEditRecipe}
                    onDeleteRecipe={handleDeleteRecipe}
                    onTogglePublishRecipe={handleTogglePublish}
                />
            </main>
        </div>
    );
}

export default AdminRecipesList;
