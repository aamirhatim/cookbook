import React from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';

export interface SectionHeaderProps {
    /** Title text displayed in the header */
    title: string;
    /** Optional icon displayed before the title */
    icon?: React.ComponentType<IconProps> | Icon | React.ReactNode;
    /** Optional content rendered on the right side of the header bar (e.g. navigation buttons) */
    rightAction?: React.ReactNode;
    /** Optional className for the root wrapper */
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    icon,
    rightAction,
    className = '',
}) => {
    const renderIcon = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) {
            return icon;
        }
        const IconComponent = icon as React.ComponentType<IconProps>;
        return <IconComponent className="w-8 h-8 text-foreground shrink-0" stroke={1} />;
    };

    return (
        <div className={`flex items-center justify-between mb-3 px-1 gap-4 ${className}`.trim()}>
            <div className="flex items-center gap-3 min-w-0">
                {renderIcon()}
                <h2 className="text-4xl caacupe-one-regular text-foreground truncate">
                    {title}
                </h2>
            </div>

            {rightAction && (
                <div className="flex items-center gap-2 shrink-0">
                    {rightAction}
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
