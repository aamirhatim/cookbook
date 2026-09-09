import React from 'react';
import {
    IconChefHat,
    IconTrash,
    IconBookUpload,
    IconBookDownload,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';
import { ConfirmationButton } from '../atoms/ConfirmationButton';

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

    const handleRowClick = () => {
        (onEdit || onClick)?.(recipe);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowClick();
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

            {/* Action buttons using reusable ConfirmationButton */}
            <div
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Publish / unpublish button with 2-step confirmation */}
                <ConfirmationButton
                    icon={isPublished ? IconBookDownload : IconBookUpload}
                    variant="subtle"
                    confirmVariant="primary"
                    title={isPublished ? 'Unpublish recipe' : 'Publish recipe'}
                    confirmTitle={isPublished ? 'Click again to confirm unpublish' : 'Click again to confirm publish'}
                    ariaLabel={isPublished ? `Unpublish ${recipe.title}` : `Publish ${recipe.title}`}
                    confirmAriaLabel={isPublished ? `Confirm unpublish ${recipe.title}` : `Confirm publish ${recipe.title}`}
                    stopPropagation
                    onConfirm={() => onTogglePublish?.(recipe)}
                />

                {/* Inline 2-step Delete button */}
                <ConfirmationButton
                    icon={IconTrash}
                    variant="destructive-subtle"
                    confirmVariant="destructive"
                    title="Delete recipe"
                    confirmTitle="Click again to confirm deletion"
                    ariaLabel={`Delete ${recipe.title}`}
                    confirmAriaLabel={`Confirm deletion of ${recipe.title}`}
                    stopPropagation
                    onConfirm={() => onDelete?.(recipe)}
                />
            </div>
        </div>
    );
};

export default RecipeAdminRowItem;
