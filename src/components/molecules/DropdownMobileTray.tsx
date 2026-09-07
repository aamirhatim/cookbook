import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Icon, IconProps } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { DropdownItem } from './DropdownList';
import { RadioSelectItem } from '../atoms/RadioSelectItem';
import { MultiSelectItem } from '../atoms/MultiSelectItem';

export interface DropdownMobileTrayProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ComponentType<IconProps> | Icon;
  type: 'radio' | 'multi';
  items: DropdownItem[];
  selectedValues: string | string[];
  onSelect: (value: string) => void;
  mobileLayout?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  anchorRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const DropdownMobileTray: React.FC<DropdownMobileTrayProps> = ({
  visible,
  onClose,
  title,
  icon: IconComponent,
  type,
  items,
  selectedValues,
  onSelect,
  mobileLayout,
  anchorRef,
  className = '',
}) => {
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        trayRef.current &&
        !trayRef.current.contains(target) &&
        (!anchorRef?.current || !anchorRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose, anchorRef]);

  if (!visible) return null;

  const isSelected = (val: string) =>
    Array.isArray(selectedValues) ? selectedValues.includes(val) : selectedValues === val;

  const slotElement =
    anchorRef?.current?.closest('[data-recipe-filter-bar]')?.querySelector('[data-recipe-filter-tray-slot]') ||
    document.querySelector('[data-recipe-filter-tray-slot]');

  const trayContent = (
    <div
      ref={trayRef}
      role="dialog"
      aria-label={title}
      className={`w-full py-2.5 border-b border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${className}`}
    >
      {/* Header with Title and Close button */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/30">
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent size={18} className="text-primary shrink-0" stroke={1.5} />}
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
          aria-label="Close tray"
        >
          <IconX size={18} stroke={1.5} />
        </button>
      </div>

      {/* Body: custom mobileLayout or default items */}
      <div className="max-h-[220px] overflow-y-auto">
        {mobileLayout ? (
          typeof mobileLayout === 'function' ? mobileLayout({ close: onClose }) : mobileLayout
        ) : items.length === 0 ? (
          <div className="py-3 text-xs text-muted-foreground text-center">No options available</div>
        ) : (
          <div role={type === 'radio' ? 'radiogroup' : 'group'} className="flex flex-col divide-y divide-border/30">
            {items.map((item) =>
              type === 'radio' ? (
                <RadioSelectItem
                  key={item.id}
                  label={item.label}
                  selected={isSelected(item.value)}
                  onChange={() => onSelect(item.value)}
                />
              ) : (
                <MultiSelectItem
                  key={item.id}
                  label={item.label}
                  checked={isSelected(item.value)}
                  onChange={() => onSelect(item.value)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (slotElement) {
    return createPortal(trayContent, slotElement);
  }

  return trayContent;
};
