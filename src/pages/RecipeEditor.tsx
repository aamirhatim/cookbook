import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    IconLoader2,
    IconAlertCircle,
} from '@tabler/icons-react';
import type { Recipe } from '../types/recipe';
import { RecipeEditorHeader } from '../components/molecules/RecipeEditorHeader';
import { RecipeMetadataForm } from '../components/molecules/RecipeMetadataForm';
import { CollapsibleSection } from '../components/molecules/CollapsibleSection';
import { IngredientsFormList } from '../components/organisms/IngredientsFormList';
import { InstructionsFormList } from '../components/organisms/InstructionsFormList';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { useToast } from '../hooks/useToast';
import { publishRecipe, unpublishRecipe } from '../services/recipes';

export function RecipeEditor() {
    const { recipeId } = useParams<{ recipeId: string }>();
    const location = useLocation();
    const { showToast } = useToast();
    const initialRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;

    const {
        isNew,
        recipe,
        loading,
        saving,
        error,
        formData,
        selectedImageFile,
        removeExistingImage,
        handleChange,
        handleImageSelect,
        handleImageRemove,
        handleSave,
        handleCancel,
    } = useRecipeForm(recipeId, initialRecipe);

    const [publishing, setPublishing] = useState(false);
    const [isIngredientsCollapsed, setIsIngredientsCollapsed] = useState(false);
    const [isInstructionsCollapsed, setIsInstructionsCollapsed] = useState(false);

    const handleTogglePublish = async () => {
        const nextPublished = !formData.isPublished;
        if (!isNew && recipeId) {
            try {
                setPublishing(true);
                if (nextPublished) {
                    await publishRecipe(recipeId);
                    showToast(`Recipe "${formData.title || 'Recipe'}" published.`, 'success');
                } else {
                    await unpublishRecipe(recipeId);
                    showToast(`Recipe "${formData.title || 'Recipe'}" unpublished.`, 'success');
                }
                handleChange('isPublished', nextPublished);
            } catch (err) {
                console.error('Failed to update publish state:', err);
                showToast('Failed to update recipe publishing status.', 'error');
            } finally {
                setPublishing(false);
            }
        } else {
            handleChange('isPublished', nextPublished);
            if (nextPublished) {
                showToast(`Recipe "${formData.title || 'Recipe'}" will be published on save.`, 'success');
            } else {
                showToast(`Recipe "${formData.title || 'Recipe'}" will be unpublished on save.`, 'success');
            }
        }
    };

    const ingredientCount = (formData.ingredients || []).reduce(
        (acc, s) => acc + (s.items?.length || 0),
        0
    );
    const instructionCount = (formData.instructions || []).reduce(
        (acc, s) => acc + (s.steps?.length || 0),
        0
    );

    return (
        <div className="space-y-6 w-full pb-20">
            {/* Header with Actions */}
            <RecipeEditorHeader
                onSave={handleSave}
                onCancel={handleCancel}
                onTogglePublish={handleTogglePublish}
                publishing={publishing}
                saving={saving}
                isNew={isNew}
                recipeId={recipeId}
                recipeTitle={recipe?.title || formData.title}
                isPublished={formData.isPublished}
                disabled={saving || publishing}
            />

            {/* Main Content Area */}
            <div className="w-full min-w-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <IconLoader2 className="w-8 h-8 animate-spin text-primary mb-3" stroke={1.5} />
                        <p className="text-sm">Loading recipe details...</p>
                    </div>
                ) : !isNew && !recipe ? (
                    <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                            <IconAlertCircle className="w-6 h-6" stroke={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-foreground">Recipe Not Found</h2>
                            <p className="text-sm text-muted-foreground">{error || "This recipe could not be loaded or doesn't exist."}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            Return to Recipes
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Top Section: Metadata form */}
                        <RecipeMetadataForm
                            formData={formData}
                            onChange={handleChange}
                            selectedImageFile={selectedImageFile}
                            removeExistingImage={removeExistingImage}
                            onSelectImage={handleImageSelect}
                            onRemoveImage={handleImageRemove}
                            disabled={saving}
                        />

                        <div className="h-px bg-border my-6" />

                        {/* Bottom Section: Ingredients & Instructions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start w-full min-w-0">
                            <CollapsibleSection
                                title="Ingredients"
                                count={ingredientCount}
                                isCollapsed={isIngredientsCollapsed}
                                onToggle={() => setIsIngredientsCollapsed(!isIngredientsCollapsed)}
                                className="w-full min-w-0"
                            >
                                <IngredientsFormList
                                    ingredients={formData.ingredients || []}
                                    onChange={(ingredients) => handleChange('ingredients', ingredients)}
                                />
                            </CollapsibleSection>

                            <CollapsibleSection
                                title="Instructions"
                                count={instructionCount}
                                isCollapsed={isInstructionsCollapsed}
                                onToggle={() => setIsInstructionsCollapsed(!isInstructionsCollapsed)}
                                className="w-full min-w-0"
                            >
                                <InstructionsFormList
                                    instructions={formData.instructions || []}
                                    onChange={(instructions) => handleChange('instructions', instructions)}
                                />
                            </CollapsibleSection>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeEditor;
