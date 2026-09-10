import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';
import { IconButton } from '../components/atoms/IconButton';
import { useToast } from '../hooks/useToast';
import { deleteRecipe, publishRecipe, unpublishRecipe } from '../services/recipes';
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

    const handleTogglePublish = async (recipe: Recipe) => {
        try {
            if (recipe.isPublished) {
                await unpublishRecipe(recipe.id);
                showToast(`Recipe "${recipe.title}" unpublished.`, 'success');
            } else {
                await publishRecipe(recipe.id);
                showToast(`Recipe "${recipe.title}" published.`, 'success');
            }
        } catch (error) {
            console.error('Failed to update recipe publish status:', error);
            showToast('Failed to update publishing status. Please try again.', 'error');
        }
    };

    return (
        <main className="w-full">
            <RecipeListContainer
                viewMode="admin"
                filterPosition="top"
                stickyFilter={false}
                leftAction={
                    <IconButton
                        icon={IconPlus}
                        onClick={() => navigate('/admin/recipes/new')}
                        title="Add new recipe"
                        ariaLabel="Add new recipe"
                        className="shrink-0"
                    />
                }
                onRecipeClick={handleEditRecipe}
                onEditRecipe={handleEditRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onTogglePublishRecipe={handleTogglePublish}
            />
        </main>
    );
}

export default AdminRecipesList;
