import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { IconArrowLeft } from '@tabler/icons-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useToast } from '../hooks/useToast';
import { deleteUserAccount } from '../services/users';
import { AccountDetailsCard } from '../components/molecules/AccountDetailsCard';
import { ButtonIcon } from '../components/atoms/ButtonIcon';

export function Account() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile, role, loading } = useUserProfile();
    const { showToast } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            showToast('Signed out successfully.', 'info');
            navigate('/login', { replace: true, state: { from: { pathname: '/' } } });
        } catch (error) {
            console.error('Error signing out:', error);
            showToast('Failed to sign out. Please try again.', 'error');
            setIsLoggingOut(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setIsDeleting(true);
        try {
            await deleteUserAccount(user);
            showToast('Account successfully deleted.', 'info');
            navigate('/login', { replace: true, state: { from: { pathname: '/' } } });
        } catch (error: any) {
            console.error('Error deleting account:', error);
            if (error?.code === 'auth/requires-recent-login') {
                showToast('Please sign in again before deleting your account.', 'error');
            } else {
                showToast(error?.message || 'Failed to delete account. Please try again.', 'error');
            }
            setIsDeleting(false);
        }
    };

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Top Navigation Header */}
            <header className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <ButtonIcon
                        icon={IconArrowLeft}
                        onClick={handleBack}
                        title="Go back"
                        ariaLabel="Go back"
                        className="shrink-0"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Account
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Account Details Card */}
            <main className="w-full">
                <AccountDetailsCard
                    profile={profile}
                    role={role}
                    loading={loading}
                    onLogout={handleSignOut}
                    isLoggingOut={isLoggingOut}
                    onDeleteAccount={handleDeleteAccount}
                    isDeletingAccount={isDeleting}
                />
            </main>
        </div>
    );
}

export default Account;
