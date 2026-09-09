import React from 'react';
import { IconCircleCheck, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItemProps {
    id: string;
    message: string;
    type?: ToastType;
    onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({
    id,
    message,
    type = 'info',
    onDismiss
}) => {
    const renderIcon = () => {
        switch (type) {
            case 'success':
                return <IconCircleCheck className="w-5 h-5 text-primary flex-shrink-0" stroke={1} />;
            case 'error':
                return <IconAlertCircle className="w-5 h-5 text-destructive flex-shrink-0" stroke={1} />;
            case 'info':
            default:
                return <IconInfoCircle className="w-5 h-5 text-accent flex-shrink-0" stroke={1} />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-primary/40';
            case 'error':
                return 'border-destructive/40';
            case 'info':
            default:
                return 'border-border';
        }
    };

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-between gap-3 px-3 py-1.5 bg-surface text-surface-foreground border ${getBorderColor()} shadow-xl rounded-2xl w-full pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200`}
        >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {renderIcon()}
                <p className="text-sm font-medium text-foreground truncate select-none">
                    {message}
                </p>
            </div>

            <IconButton
                icon={IconX}
                size="small"
                onClick={() => onDismiss(id)}
                ariaLabel="Dismiss notification"
                title="Dismiss"
                className="shrink-0"
            />
        </div>
    );
};
