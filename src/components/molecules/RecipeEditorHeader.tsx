import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconArrowLeft,
    IconBookUpload,
    IconBookDownload,
    IconTrash,
    IconCheck,
    IconX,
    IconDeviceFloppy,
} from '@tabler/icons-react';
import { ButtonIcon } from '../atoms/ButtonIcon';
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
    const [isConfirmingPublish, setIsConfirmingPublish] = useState(false);
    const resetPublishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
            if (resetPublishTimerRef.current) {
                clearTimeout(resetPublishTimerRef.current);
            }
        };
    }, []);

    const handlePublishClick = () => {
        if (isConfirmingPublish) {
            if (resetPublishTimerRef.current) {
                clearTimeout(resetPublishTimerRef.current);
            }
            setIsConfirmingPublish(false);
            onTogglePublish?.();
        } else {
            setIsConfirmingPublish(true);
            if (resetPublishTimerRef.current) {
                clearTimeout(resetPublishTimerRef.current);
            }
            resetPublishTimerRef.current = setTimeout(() => {
                setIsConfirmingPublish(false);
            }, 4000);
        }
    };

    const handleDeleteClick = async () => {
        if (isConfirmingDelete) {
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
            setIsConfirmingDelete(false);
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
        } else {
            setIsConfirmingDelete(true);
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
            resetTimerRef.current = setTimeout(() => {
                setIsConfirmingDelete(false);
            }, 4000);
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
                <ButtonIcon
                    icon={isConfirmingPublish ? IconCheck : (isPublished ? IconBookDownload : IconBookUpload)}
                    variant={isConfirmingPublish ? 'primary' : 'subtle'}
                    loading={publishing}
                    disabled={isBusy}
                    title={
                        isConfirmingPublish
                            ? (isPublished ? 'Click again to confirm unpublish' : 'Click again to confirm publish')
                            : (isPublished ? 'Unpublish recipe' : 'Publish recipe')
                    }
                    ariaLabel={
                        isConfirmingPublish
                            ? (isPublished ? `Confirm unpublish ${recipeTitle || 'recipe'}` : `Confirm publish ${recipeTitle || 'recipe'}`)
                            : (isPublished ? `Unpublish ${recipeTitle || 'recipe'}` : `Publish ${recipeTitle || 'recipe'}`)
                    }
                    onClick={handlePublishClick}
                    className={isConfirmingPublish ? 'animate-pulse ring-2 ring-primary/40' : ''}
                />

                {/* 4. Inline 2-step Delete Button (shown when editing existing recipe) */}
                {!isNew && (
                    <ButtonIcon
                        icon={isConfirmingDelete ? IconCheck : IconTrash}
                        variant={isConfirmingDelete ? 'destructive' : 'destructive-subtle'}
                        loading={isDeleting}
                        disabled={isBusy}
                        title={isConfirmingDelete ? 'Click again to confirm deletion' : 'Delete recipe'}
                        ariaLabel={
                            isConfirmingDelete
                                ? `Confirm deletion of ${recipeTitle || 'recipe'}`
                                : `Delete ${recipeTitle || 'recipe'}`
                        }
                        onClick={handleDeleteClick}
                        className={isConfirmingDelete ? 'animate-pulse ring-2 ring-destructive/40' : ''}
                    />
                )}
            </div>
        </header>
    );
};

export default RecipeEditorHeader;
