import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserRole } from '../services/users';
import type { UserProfile } from '../types/user';

export interface UseUserProfileResult {
    profile: UserProfile | null;
    role: string | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileResult {
    const { user, isAdmin } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfileAndRole = useCallback(async () => {
        if (!user) {
            setProfile(null);
            setRole(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch Firestore profile and Auth custom claims concurrently
            const [firestoreProfile, customClaimRole] = await Promise.all([
                getUserProfile(user.uid),
                getUserRole(user),
            ]);

            // Determine effective role: custom claim > isAdmin context > default 'user'
            const effectiveRole = customClaimRole || (isAdmin ? 'admin' : 'user');
            setRole(effectiveRole);

            if (firestoreProfile) {
                setProfile(firestoreProfile);
            } else {
                // Fallback profile if Firestore document does not exist yet
                const fallbackProfile: UserProfile = {
                    uid: user.uid,
                    firstName: '',
                    lastName: '',
                    displayName: user.displayName || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                };
                setProfile(fallbackProfile);
            }
        } catch (err: any) {
            console.error('Error fetching user profile and role:', err);
            setError(err.message || 'Failed to load user profile');
            // Still provide fallback profile from Auth user if available
            setProfile({
                uid: user.uid,
                firstName: '',
                lastName: '',
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
            });
            setRole(isAdmin ? 'admin' : 'user');
        } finally {
            setLoading(false);
        }
    }, [user, isAdmin]);

    useEffect(() => {
        fetchProfileAndRole();
    }, [fetchProfileAndRole]);

    return {
        profile,
        role,
        loading,
        error,
        refresh: fetchProfileAndRole,
    };
}
