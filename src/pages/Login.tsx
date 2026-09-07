import { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { IconNotebook } from '@tabler/icons-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { EmailPasswordForm } from '../components/molecules/EmailPasswordForm';

export function Login() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    // Redirect if already logged in
    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleSuccessfulLogin = async (signedInUser: User) => {
        const tokenResult = await signedInUser.getIdTokenResult();
        const isAdminUser = tokenResult.claims.role === 'admin';

        if (from && from !== '/login') {
            if (from.startsWith('/admin') && !isAdminUser) {
                navigate('/', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            navigate('/', { replace: true });
        }
    };

    const handleEmailSignIn = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(result.user);
        } catch (err: any) {
            console.error('Login error:', err);
            let message = 'Failed to sign in. Please try again.';
            if (
                err.code === 'auth/invalid-credential' ||
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/user-not-found'
            ) {
                message = 'Invalid email or password.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Please enter a valid email address.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many failed attempts. Please try again later.';
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await handleSuccessfulLogin(result.user);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4 py-8">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <IconNotebook className="w-8 h-8" stroke={1} />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Sign in to access your recipes, cooking notes, and collections.
                </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm text-center">
                        {error}
                    </div>
                )}

                <EmailPasswordForm
                    onSubmit={handleEmailSignIn}
                    isLoading={isLoading}
                    submitLabel="Sign In"
                />

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-surface border border-border hover:bg-surface-hover text-foreground font-medium h-11 min-h-[44px] px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Sign in with Google</span>
                </button>

                <div className="pt-2 border-t border-border text-center space-y-2">
                    <p className="text-xs text-muted-foreground">Don't have an account yet?</p>
                    <button
                        type="button"
                        onClick={() => navigate('/signup', { state: { from: location.state?.from } })}
                        className="w-full flex items-center justify-center border border-border bg-surface hover:bg-surface-hover text-foreground font-medium h-11 min-h-[44px] px-4 rounded-xl transition-colors active:scale-98"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
