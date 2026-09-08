import { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { IconNotebook } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { SignUpForm, SignUpFormData } from '../components/molecules/SignUpForm';
import { registerUser, parseAuthError } from '../services/auth';

export function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { showToast } = useToast();

    const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const from = !rawFrom || rawFrom === '/login' || rawFrom.startsWith('/account') ? '/' : rawFrom;

    // Redirect if already logged in
    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleCancel = () => {
        navigate('/login', { state: { from: location.state?.from } });
    };

    const handleFormError = (msg: string | null) => {
        setError(msg);
        if (msg) {
            showToast(msg, 'error');
        }
    };

    const handleSignUp = async (data: SignUpFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await registerUser(data);
            showToast('Account created successfully! Welcome to Recipe Book.', 'success');
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Sign up error:', err);
            const message = parseAuthError(err);
            setError(message);
            showToast(message, 'error');
            navigate('/signup', { replace: true });
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
                <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Sign up to start saving recipes, cooking notes, and collections.
                </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm text-center">
                        {error}
                    </div>
                )}

                <SignUpForm
                    onSubmit={handleSignUp}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    onError={handleFormError}
                />
            </div>
        </div>
    );
}
