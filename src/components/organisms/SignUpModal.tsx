import React, { useState, useEffect } from 'react';
import { ModalLayout } from '../layout/ModalLayout';
import { AuthModalHeader } from '../molecules/AuthModalHeader';
import { SignUpForm, SignUpFormData } from '../molecules/SignUpForm';
import { EmailPasswordForm } from '../molecules/EmailPasswordForm';
import { GoogleSignInButton } from '../atoms/GoogleSignInButton';
import { registerUser, signInWithGoogle, signInWithEmail, parseAuthError } from '../../services/auth';
import { useToast } from '../../hooks/useToast';

export interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    initialMode?: 'signup' | 'login';
    onSuccess?: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    initialMode = 'signup',
    onSuccess,
}) => {
    const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError(null);
        }
    }, [isOpen, initialMode]);

    const handleSuccess = (message: string) => {
        showToast(message, 'success');
        onSuccess?.();
        onClose();
    };

    const handleSignUp = async (data: SignUpFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerUser(data);
            handleSuccess('Account created successfully! Welcome to Recipe Book.');
        } catch (err) {
            console.error('Modal signup error:', err);
            setError(parseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async (credentials: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmail(credentials);
            handleSuccess('Signed in successfully!');
        } catch (err) {
            console.error('Modal signin error:', err);
            setError(parseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            handleSuccess('Signed in successfully with Google!');
        } catch (err) {
            console.error('Modal Google sign-in error:', err);
            setError(parseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const displayTitle = title || (mode === 'signup' ? 'Create an Account' : 'Welcome Back');
    const displayDescription =
        description ||
        (mode === 'signup'
            ? 'Sign up to start saving recipes, cooking notes, and collections.'
            : 'Sign in to access your saved recipes and profile.');

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title={displayTitle} maxWidth="sm">
            <div className="space-y-4">
                <AuthModalHeader
                    title={displayTitle}
                    description={displayDescription}
                    mode={mode}
                    onModeChange={(nextMode) => {
                        setMode(nextMode);
                        setError(null);
                    }}
                />

                {/* Error Callout */}
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Form based on Mode */}
                <div className="text-left">
                    {mode === 'signup' ? (
                        <SignUpForm
                            onSubmit={handleSignUp}
                            onCancel={onClose}
                            isLoading={isLoading}
                            onError={setError}
                        />
                    ) : (
                        <EmailPasswordForm
                            onSubmit={handleEmailSignIn}
                            isLoading={isLoading}
                            submitLabel="Sign In"
                        />
                    )}
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center pt-2">
                    <div className="w-full border-t border-border" />
                    <span className="absolute bg-surface px-2 text-xs text-muted-foreground">or</span>
                </div>

                {/* Google Sign-In */}
                <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoading} />
            </div>
        </ModalLayout>
    );
};
