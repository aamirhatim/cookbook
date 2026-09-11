import React, { createContext, useContext, useState, useCallback } from 'react';
import { SignUpModal } from '../components/organisms/SignUpModal';
import { useAuth } from './AuthContext';

export interface AuthModalOptions {
    title?: string;
    description?: string;
    initialMode?: 'signup' | 'login';
    onSuccess?: () => void;
}

export interface AuthModalContextType {
    isOpen: boolean;
    openSignUpModal: (options?: AuthModalOptions) => void;
    openLoginModal: (options?: AuthModalOptions) => void;
    closeAuthModal: () => void;
    requireAuth: (action: () => void, options?: AuthModalOptions) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = (): AuthModalContextType => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState<AuthModalOptions>({});

    const openSignUpModal = useCallback((options?: AuthModalOptions) => {
        setModalOptions({
            ...options,
            initialMode: options?.initialMode || 'signup',
        });
        setIsOpen(true);
    }, []);

    const openLoginModal = useCallback((options?: AuthModalOptions) => {
        setModalOptions({
            ...options,
            initialMode: options?.initialMode || 'login',
        });
        setIsOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsOpen(false);
        setModalOptions({});
    }, []);

    const requireAuth = useCallback(
        (action: () => void, options?: AuthModalOptions) => {
            if (user) {
                action();
            } else {
                const openModal = options?.initialMode === 'signup' ? openSignUpModal : openLoginModal;
                openModal({
                    ...options,
                    onSuccess: () => {
                        options?.onSuccess?.();
                        action();
                    },
                });
            }
        },
        [user, openLoginModal, openSignUpModal]
    );

    return (
        <AuthModalContext.Provider
            value={{
                isOpen,
                openSignUpModal,
                openLoginModal,
                closeAuthModal,
                requireAuth,
            }}
        >
            {children}
            <SignUpModal
                isOpen={isOpen}
                onClose={closeAuthModal}
                title={modalOptions.title}
                description={modalOptions.description}
                initialMode={modalOptions.initialMode || 'signup'}
                onSuccess={modalOptions.onSuccess}
            />
        </AuthModalContext.Provider>
    );
};
