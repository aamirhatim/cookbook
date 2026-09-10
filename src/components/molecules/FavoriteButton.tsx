import React from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import type { ButtonColor, ButtonSize, ButtonVariant } from '../atoms/buttonStyles';
import { useFavorites } from '../../hooks/useFavorites';

export interface FavoriteButtonProps {
    recipeId: string;
    recipeTitle?: string;
    size?: ButtonSize | 'default';
    variant?: ButtonVariant;
    color?: ButtonColor;
    className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    recipeId,
    recipeTitle,
    size = 'small',
    variant = 'subtle',
    color = 'favorite',
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
            color={color}
            size={size}
            title={actionText}
            ariaLabel={ariaLabel}
            className={`transition-transform duration-150 active:scale-90 ${className}`}
        />
    );
};
