import React from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import type { ButtonSize, ButtonVariant } from '../atoms/buttonStyles';
import { useFavorites } from '../../hooks/useFavorites';

export interface FavoriteButtonProps {
    recipeId: string;
    recipeTitle?: string;
    size?: ButtonSize | 'default';
    variant?: ButtonVariant;
    className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    recipeId,
    recipeTitle,
    size = 'small',
    variant = 'subtle',
    className = '',
}) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(recipeId);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipeId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.stopPropagation();
        }
    };

    const actionText = isFav ? 'Remove from favorites' : 'Add to favorites';
    const ariaLabel = recipeTitle
        ? `${isFav ? 'Remove' : 'Add'} "${recipeTitle}" ${isFav ? 'from' : 'to'} favorites`
        : actionText;

    return (
        <IconButton
            icon={IconHeart}
            activeIcon={IconHeartFilled}
            active={isFav}
            isToggle={true}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            variant={variant}
            size={size}
            title={actionText}
            ariaLabel={ariaLabel}
            activeClassName="text-destructive border-destructive/40 focus:ring-destructive/30"
            inactiveClassName="text-muted-foreground hover:text-destructive hover:border-destructive/20 focus:ring-destructive/20"
            className={`transition-transform duration-150 active:scale-90 ${className}`}
        />
    );
};
