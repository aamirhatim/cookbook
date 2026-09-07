import React from 'react';
import { IconCircleCheck, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';

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
                return <IconCircleCheck className="w-5 h-5 text-primary flex-shrink-0" stroke={1.5} />;
            case 'error':
                return <IconAlertCircle className="w-5 h-5 text-destructive flex-shrink-0" stroke={1.5} />;
            case 'info':
            default:
                return <IconInfoCircle className="w-5 h-5 text-accent flex-shrink-0" stroke={1.5} />;
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
            className={`flex items-center justify-between gap-3 px-3 bg-surface text-surface-foreground border ${getBorderColor()} shadow-xl rounded-2xl w-full pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200`}
        >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {renderIcon()}
                <p className="text-sm font-medium text-foreground truncate select-none">
                    {message}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onDismiss(id)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-xl transition-colors -mr-2 flex-shrink-0"
                aria-label="Dismiss notification"
                title="Dismiss"
            >
                <IconX className="w-4 h-4" stroke={1.5} />
            </button>
        </div>
    );
};
