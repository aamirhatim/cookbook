import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { deleteUser, signOut, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import type { UserProfile } from '../types/user';

export interface CreateUserProfileInput {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Creates or overwrites a user profile document in Firestore `users/{uid}`.
 */
export async function createUserProfile(input: CreateUserProfileInput): Promise<UserProfile> {
    const { uid, firstName, lastName, email } = input;
    const displayName = `${firstName} ${lastName}`.trim();

    const userDocRef = doc(db, 'users', uid);
    const profileData: UserProfile = {
        uid,
        firstName,
        lastName,
        displayName,
        email,
        favorites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, profileData);

    return profileData;
}

/**
 * Retrieves a user profile document from Firestore `users/{uid}`.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as UserProfile;
}

/**
 * Retrieves the user's custom claim role from Firebase Auth.
 */
export async function getUserRole(user: User, forceRefresh = false): Promise<string | undefined> {
    const idTokenResult = await user.getIdTokenResult(forceRefresh);
    return idTokenResult.claims.role as string | undefined;
}

/**
 * Sets custom claims (e.g. role: 'user') for a user in Firebase Auth.
 * When running against the Auth emulator, calls the emulator API directly and forces token refresh.
 */
export async function setUserCustomClaim(uid: string, role: string = 'user'): Promise<void> {
    const isEmulator =
        import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost');

    if (isEmulator) {
        try {
            const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id';
            const res = await fetch(
                `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update?key=fake-api-key`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer owner',
                    },
                    body: JSON.stringify({
                        localId: uid,
                        customAttributes: JSON.stringify({ role }),
                    }),
                }
            );

            if (!res.ok) {
                console.warn('Failed to set custom claim in Auth emulator:', await res.text());
            } else if (auth.currentUser && auth.currentUser.uid === uid) {
                await auth.currentUser.getIdToken(true);
            }
        } catch (err) {
            console.warn('Could not set custom claim in Auth emulator:', err);
        }
    }
}

/**
 * Deletes a user profile document from Firestore `users/{uid}`.
 */
export async function deleteUserProfile(uid: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
}

/**
 * Rolls back user creation by deleting their Firestore profile document and Firebase Auth account.
 */
export async function rollbackUserCreation(user: User): Promise<void> {
    // 1. Delete from Firestore if exists
    try {
        await deleteUserProfile(user.uid);
    } catch (err) {
        console.error('Error deleting user profile from Firestore during rollback:', err);
    }

    // 2. Delete user from Firebase Auth
    try {
        await deleteUser(user);
    } catch (err) {
        console.error('Error deleting user from Firebase Auth during rollback:', err);
    }

    // 3. Ensure signed out
    try {
        if (auth.currentUser) {
            await signOut(auth);
        }
    } catch (err) {
        console.error('Error signing out during rollback:', err);
    }
}

/**
 * Permanently deletes the user account:
 * 1. Deletes the user profile document from Firestore `users/{uid}` while user is authenticated.
 * 2. Deletes the user from Firebase Auth.
 */
export async function deleteUserAccount(user: User): Promise<void> {
    const profile = await getUserProfile(user.uid);
    try {
        // Delete Firestore profile first while user is still authenticated
        await deleteUserProfile(user.uid);
        // Delete user from Firebase Auth
        await deleteUser(user);
    } catch (error) {
        // If deleting from Auth failed (e.g. auth/requires-recent-login), restore the profile
        if (profile) {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, profile);
            } catch (restoreErr) {
                console.error('Failed to restore user profile after failed auth deletion:', restoreErr);
            }
        }
        throw error;
    }
}

/**
 * Adds a recipe ID to the user's favorites array in Firestore.
 * Uses setDoc with merge: true so it works even if the profile doc is missing fields.
 */
export async function addFavoriteRecipe(uid: string, recipeId: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
        userDocRef,
        {
            favorites: arrayUnion(recipeId),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

/**
 * Removes a recipe ID from the user's favorites array in Firestore.
 */
export async function removeFavoriteRecipe(uid: string, recipeId: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
        userDocRef,
        {
            favorites: arrayRemove(recipeId),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

/**
 * Retrieves the array of favorited recipe IDs for a user.
 */
export async function getUserFavorites(uid: string): Promise<string[]> {
    const profile = await getUserProfile(uid);
    return profile?.favorites || [];
}

