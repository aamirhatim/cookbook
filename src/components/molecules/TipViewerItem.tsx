import React from 'react';
import { IconPoint } from '@tabler/icons-react';

export interface TipViewerItemProps {
    tip: string;
    className?: string;
}

export const TipViewerItem: React.FC<TipViewerItemProps> = ({
    tip,
    className = '',
}) => {
    return (
        <div className={`px-4 py-3 flex items-start gap-2.5 hover:bg-surface-hover/40 transition-colors ${className}`}>
            <div className="shrink-0 mt-0.5 text-primary" aria-hidden="true">
                <IconPoint className="w-5 h-5 -ml-0.5" stroke={1.5} />
            </div>
            <p className="text-sm text-foreground leading-relaxed select-text min-w-0 flex-1">
                {tip}
            </p>
        </div>
    );
};
