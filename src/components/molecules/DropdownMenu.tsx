import React, { useState, useRef, useEffect } from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import { DropdownList, DropdownItem } from './DropdownList';
import { DropdownMobileTray } from './DropdownMobileTray';
import { useIsMobile } from '../../hooks/useIsMobile';

export type DropdownMenuVariant = 'default' | 'mobile';

export interface DropdownMenuProps {
    icon: React.ComponentType<IconProps> | Icon;
    title: string;
    type: 'radio' | 'multi';
    items: DropdownItem[];
    selectedValues: string | string[];
    onSelect: (value: string) => void;
    className?: string;
    hasActiveFilters?: boolean;
    placement?: 'top' | 'bottom';
    variant?: DropdownMenuVariant;
    mobileLayout?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    buttonTitle?: string;
    ariaLabel?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    icon,
    title,
    type,
    items,
    selectedValues,
    onSelect,
    className = '',
    hasActiveFilters = false,
    placement = 'bottom',
    variant,
    mobileLayout,
    open: controlledOpen,
    onOpenChange,
    buttonTitle,
    ariaLabel,
}) => {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const containerRef = useRef<HTMLDivElement>(null);

    const isMobileScreen = useIsMobile();
    const isMobileVariant = variant === 'mobile' || (variant !== 'default' && isMobileScreen);

    const setOpen = (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
    };

    const toggleOpen = () => {
        setOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen || isMobileVariant) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, isMobileVariant]);

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            <IconButton
                icon={icon}
                onClick={toggleOpen}
                active={isOpen || hasActiveFilters}
                title={buttonTitle || title}
                ariaLabel={ariaLabel || buttonTitle || title}
            />

            {isMobileVariant ? (
                <DropdownMobileTray
                    visible={isOpen}
                    onClose={() => setOpen(false)}
                    title={title}
                    icon={icon}
                    type={type}
                    items={items}
                    selectedValues={selectedValues}
                    onSelect={onSelect}
                    mobileLayout={mobileLayout}
                    anchorRef={containerRef}
                />
            ) : (
                <DropdownList
                    visible={isOpen}
                    title={title}
                    icon={icon}
                    type={type}
                    items={items}
                    selectedValues={selectedValues}
                    onSelect={onSelect}
                    placement={placement}
                />
            )}
        </div>
    );
};

