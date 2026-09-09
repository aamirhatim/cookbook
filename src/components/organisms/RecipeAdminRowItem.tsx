import React, { useState, useRef, useEffect } from 'react';
import {
    IconChefHat,
    IconTrash,
    IconCheck,
    IconBookUpload,
    IconBookDownload,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';
import { ButtonIcon } from '../atoms/ButtonIcon';

export interface RecipeAdminRowItemProps {
    recipe: Recipe;
    onEdit?: (recipe: Recipe) => void;
    onDelete?: (recipe: Recipe) => void;
    onTogglePublish?: (recipe: Recipe) => void;
    onClick?: (recipe: Recipe) => void;
    className?: string;
}

export const RecipeAdminRowItem: React.FC<RecipeAdminRowItemProps> = ({
    recipe,
    onEdit,
    onDelete,
    onTogglePublish,
    onClick,
    className = '',
}) => {
    const isPublished = Boolean(recipe.isPublished);
    const [isConfirmingPublish, setIsConfirmingPublish] = useState(false);
    const resetPublishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clean up timers on unmount
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

    const handleRowClick = () => {
        (onEdit || onClick)?.(recipe);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowClick();
        }
    };

    const handlePublishClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isConfirmingPublish) {
            if (resetPublishTimerRef.current) {
                clearTimeout(resetPublishTimerRef.current);
            }
            setIsConfirmingPublish(false);
            onTogglePublish?.(recipe);
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

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isConfirmingDelete) {
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
            setIsConfirmingDelete(false);
            onDelete?.(recipe);
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

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleRowClick}
            onKeyDown={handleKeyDown}
            aria-label={`Recipe: ${recipe.title}`}
            className={`w-full text-left flex items-center justify-between py-2 sm:py-2.5 px-0 gap-3 hover:bg-surface-hover/60 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer select-none ${className}`}
        >
            {/* Compact square recipe thumbnail */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 aspect-square rounded-lg overflow-hidden bg-surface-hover border border-border/70 shrink-0 relative flex items-center justify-center">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <IconChefHat className="w-5 h-5" stroke={1.5} />
                    </div>
                )}
            </div>

            {/* Recipe title without any extra metadata */}
            <div className="min-w-0 flex-1 py-0.5">
                <h3 className="text-sm sm:text-base font-medium sm:font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {recipe.title}
                </h3>
            </div>

            {/* Action buttons following standard ButtonIcon style */}
            <div
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Publish / unpublish button with 2-step confirmation */}
                <ButtonIcon
                    icon={isConfirmingPublish ? IconCheck : (isPublished ? IconBookDownload : IconBookUpload)}
                    variant={isConfirmingPublish ? 'primary' : 'subtle'}
                    title={
                        isConfirmingPublish
                            ? (isPublished ? 'Click again to confirm unpublish' : 'Click again to confirm publish')
                            : (isPublished ? 'Unpublish recipe' : 'Publish recipe')
                    }
                    ariaLabel={
                        isConfirmingPublish
                            ? (isPublished ? `Confirm unpublish ${recipe.title}` : `Confirm publish ${recipe.title}`)
                            : (isPublished ? `Unpublish ${recipe.title}` : `Publish ${recipe.title}`)
                    }
                    onClick={handlePublishClick}
                    className={isConfirmingPublish ? 'animate-pulse ring-2 ring-primary/40' : ''}
                />

                {/* Inline 2-step Delete button */}
                <ButtonIcon
                    icon={isConfirmingDelete ? IconCheck : IconTrash}
                    variant={isConfirmingDelete ? 'destructive' : 'destructive-subtle'}
                    title={isConfirmingDelete ? 'Click again to confirm deletion' : 'Delete recipe'}
                    ariaLabel={
                        isConfirmingDelete
                            ? `Confirm deletion of ${recipe.title}`
                            : `Delete ${recipe.title}`
                    }
                    onClick={handleDeleteClick}
                    className={isConfirmingDelete ? 'animate-pulse ring-2 ring-destructive/40' : ''}
                />
            </div>
        </div>
    );
};

export default RecipeAdminRowItem;
