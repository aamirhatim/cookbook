import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconArrowLeft,
    IconBookUpload,
    IconBookDownload,
    IconTrash,
    IconX,
    IconDeviceFloppy,
} from '@tabler/icons-react';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { ConfirmationButton } from '../atoms/ConfirmationButton';
import { useToast } from '../../hooks/useToast';
import { deleteRecipe } from '../../services/recipes';

export interface RecipeEditorHeaderProps {
    onBack: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    onTogglePublish?: () => void | Promise<void>;
    publishing?: boolean;
    saving?: boolean;
    isNew?: boolean;
    recipeId?: string;
    recipeTitle?: string;
    isPublished?: boolean;
    disabled?: boolean;
}

export const RecipeEditorHeader: React.FC<RecipeEditorHeaderProps> = ({
    onBack,
    onSave,
    onCancel,
    onTogglePublish,
    publishing = false,
    saving = false,
    isNew = false,
    recipeId,
    recipeTitle,
    isPublished = false,
    disabled = false,
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirmed = async () => {
        if (!recipeId || recipeId === 'new') return;

        setIsDeleting(true);
        try {
            await deleteRecipe(recipeId);
            showToast(`Recipe "${recipeTitle || 'Recipe'}" deleted.`, 'success');
            navigate('/admin/recipes', { replace: true });
        } catch (err) {
            console.error('Failed to delete recipe:', err);
            showToast('Failed to delete recipe. Please try again.', 'error');
            setIsDeleting(false);
        }
    };

    const isBusy = disabled || saving || isDeleting || publishing;

    return (
        <header className="pt-2 flex items-center justify-between gap-2 sm:gap-3">
            {/* Back Button */}
            <ButtonIcon
                icon={IconArrowLeft}
                onClick={onBack}
                disabled={isBusy}
                title="Go back"
                ariaLabel="Go back"
                className="shrink-0"
            />

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* 1. Cancel Button */}
                {onCancel && (
                    <ButtonIcon
                        icon={IconX}
                        variant="subtle"
                        disabled={isBusy}
                        title="Cancel"
                        ariaLabel="Cancel"
                        onClick={onCancel}
                    />
                )}

                {/* 2. Save Button */}
                {onSave && (
                    <ButtonIcon
                        icon={IconDeviceFloppy}
                        variant="subtle"
                        loading={saving}
                        disabled={isBusy}
                        title="Save Recipe"
                        ariaLabel="Save Recipe"
                        onClick={onSave}
                    />
                )}

                {/* 3. Publish / unpublish button with 2-step confirmation */}
                <ConfirmationButton
                    icon={isPublished ? IconBookDownload : IconBookUpload}
                    variant="subtle"
                    confirmVariant="primary"
                    loading={publishing}
                    disabled={isBusy}
                    title={isPublished ? 'Unpublish recipe' : 'Publish recipe'}
                    confirmTitle={isPublished ? 'Click again to confirm unpublish' : 'Click again to confirm publish'}
                    ariaLabel={isPublished ? `Unpublish ${recipeTitle || 'recipe'}` : `Publish ${recipeTitle || 'recipe'}`}
                    confirmAriaLabel={isPublished ? `Confirm unpublish ${recipeTitle || 'recipe'}` : `Confirm publish ${recipeTitle || 'recipe'}`}
                    onConfirm={() => onTogglePublish?.()}
                />

                {/* 4. Inline 2-step Delete Button (shown when editing existing recipe) */}
                {!isNew && (
                    <ConfirmationButton
                        icon={IconTrash}
                        variant="destructive-subtle"
                        confirmVariant="destructive"
                        loading={isDeleting}
                        disabled={isBusy}
                        title="Delete recipe"
                        confirmTitle="Click again to confirm deletion"
                        ariaLabel={`Delete ${recipeTitle || 'recipe'}`}
                        confirmAriaLabel={`Confirm deletion of ${recipeTitle || 'recipe'}`}
                        onConfirm={handleDeleteConfirmed}
                    />
                )}
            </div>
        </header>
    );
};

export default RecipeEditorHeader;
