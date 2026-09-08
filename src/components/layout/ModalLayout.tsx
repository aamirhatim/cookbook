import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';

export interface ModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Lock body scroll and attach Escape key listener
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (closeOnEscape && e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    }[maxWidth];

    const content = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="presentation"
        >
            {/* Scrim / Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={closeOnBackdropClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Dialog Panel */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title || 'Modal Dialog'}
                className={`relative w-full ${maxWidthClasses} bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-auto transition-all animate-in fade-in zoom-in-95 duration-200 focus:outline-none`}
                tabIndex={-1}
            >
                {/* Close Button */}
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-hover active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <IconX className="w-5 h-5" stroke={1.5} />
                    </button>
                )}

                {/* Modal Body */}
                <div className="p-5 sm:p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};
