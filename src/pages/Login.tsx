import { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { IconNotebook } from '@tabler/icons-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { EmailPasswordForm } from '../components/molecules/EmailPasswordForm';
import { GoogleSignInButton } from '../components/atoms/GoogleSignInButton';
import { signInWithGoogle, parseAuthError } from '../services/auth';

export function Login() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const from = !rawFrom || rawFrom === '/login' || rawFrom.startsWith('/account') ? '/' : rawFrom;

    // Redirect if already logged in
    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleSuccessfulLogin = async (signedInUser: User) => {
        const tokenResult = await signedInUser.getIdTokenResult();
        const isAdminUser = tokenResult.claims.role === 'admin';

        if (from && from !== '/') {
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
            setError(parseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await signInWithGoogle();
            await handleSuccessfulLogin(user);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(parseAuthError(err));
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

                <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    text="Sign in with Google"
                />

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
