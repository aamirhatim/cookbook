import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { IconUser } from '@tabler/icons-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useToast } from '../hooks/useToast';
import { deleteUserAccount } from '../services/users';
import { AccountDetailsCard } from '../components/molecules/AccountDetailsCard';
import { AppVersionCard } from '../components/molecules/AppVersionCard';
import { SectionHeader } from '../components/molecules/SectionHeader';

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
            navigate('/', { replace: true });
            await signOut(auth);
            showToast('Signed out successfully.', 'info');
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
            navigate('/', { replace: true });
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

    return (
        <div className="space-y-6 w-full">
            <SectionHeader
                title="Account"
                icon={IconUser}
            />

            {/* Main Account Details Card */}
            <main className="w-full space-y-6">
                <AccountDetailsCard
                    profile={profile}
                    role={role}
                    loading={loading}
                    onLogout={handleSignOut}
                    isLoggingOut={isLoggingOut}
                    onDeleteAccount={handleDeleteAccount}
                    isDeletingAccount={isDeleting}
                />

                {/* Application Version & PWA Card */}
                <AppVersionCard />

                {/* Status Card: Local Emulators */}
                <div className="p-4 rounded-xl border border-secondary bg-secondary/40 text-secondary-foreground text-xs sm:text-sm flex items-start space-x-3">
                    <div className="text-lg">🔥</div>
                    <div className="space-y-1">
                        <p className="font-semibold text-foreground">Firebase Local Backend Configured</p>
                        <p className="text-muted-foreground leading-relaxed">
                            Connected to local Firebase emulators: Firestore (8080), Auth (9099), Storage (9199), and UI (4000).
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Account;
