import React from 'react';
import { IconChevronDown } from '@tabler/icons-react';

export interface CollapsibleSectionProps {
    title: string;
    count?: number;
    isCollapsed: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    count,
    isCollapsed,
    onToggle,
    children,
    className = '',
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full min-w-0 ${className}`}>
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-2 text-left group select-none focus:outline-none w-fit rounded-lg py-1 px-1 -ml-1 hover:bg-surface-hover/80 transition-colors"
                aria-expanded={!isCollapsed}
                title={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
            >
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                </span>
                {count !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {count}
                    </span>
                )}
                <IconChevronDown
                    className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                        isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                    stroke={2}
                />
            </button>

            {!isCollapsed && children}
        </div>
    );
};
