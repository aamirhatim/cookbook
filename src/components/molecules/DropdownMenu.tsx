import React, { useState, useRef, useEffect } from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { DropdownList, DropdownItem } from './DropdownList';

export interface DropdownMenuProps {
  icon: React.ComponentType<IconProps> | Icon;
  title: string;
  type: 'radio' | 'multi';
  items: DropdownItem[];
  selectedValues: string | string[];
  onSelect: (value: string) => void;
  className?: string;
  hasActiveFilters?: boolean;
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <ButtonIcon
        icon={icon}
        onClick={toggleOpen}
        active={isOpen || hasActiveFilters}
        title={title}
        ariaLabel={title}
      />

      <DropdownList
        visible={isOpen}
        type={type}
        items={items}
        selectedValues={selectedValues}
        onSelect={onSelect}
      />
    </div>
  );
};

