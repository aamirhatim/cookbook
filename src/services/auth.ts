import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    GoogleAuthProvider,
    User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile, getUserProfile, setUserCustomClaim, rollbackUserCreation } from './users';
import type { SignUpFormData } from '../components/molecules/SignUpForm';

/**
 * Registers a new user with email and password, setting displayName, default custom claim,
 * and creating a profile in Firestore. Automatically rolls back if an error occurs during setup.
 */
export async function registerUser(data: SignUpFormData): Promise<User> {
    let createdUser: User | null = null;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        createdUser = userCredential.user;

        const fullName = `${data.firstName} ${data.lastName}`.trim();
        await updateProfile(createdUser, { displayName: fullName });
        await setUserCustomClaim(createdUser.uid, 'user');
        await createUserProfile({
            uid: createdUser.uid,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        });

        return createdUser;
    } catch (err) {
        if (createdUser) {
            try {
                await rollbackUserCreation(createdUser);
            } catch (rollbackErr) {
                console.error('Error rolling back user creation:', rollbackErr);
            }
        }
        throw err;
    }
}

/**
 * Signs in or creates an account using Google OAuth popup.
 * If the user's Firestore profile does not exist yet, initializes it with default claims.
 */
export async function signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    try {
        const existingProfile = await getUserProfile(user.uid);
        if (!existingProfile) {
            const nameParts = (user.displayName || '').trim().split(' ');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts.slice(1).join(' ') || '';

            await setUserCustomClaim(user.uid, 'user');
            await createUserProfile({
                uid: user.uid,
                firstName,
                lastName,
                email: user.email || '',
            });
        }
    } catch (err) {
        console.warn('Error creating profile for Google user:', err);
    }

    return user;
}

/**
 * Signs in using email and password.
 */
export async function signInWithEmail(credentials: { email: string; password: string }): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return result.user;
}

/**
 * Parses Firebase auth error codes into friendly user messages.
 */
export function parseAuthError(err: any): string {
    if (!err) return 'An unexpected error occurred. Please try again.';
    if (err.code === 'auth/email-already-in-use') {
        return 'An account with this email already exists.';
    }
    if (err.code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
    }
    if (err.code === 'auth/weak-password') {
        return 'Password is too weak. Please use at least 6 characters.';
    }
    if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
    ) {
        return 'Invalid email or password.';
    }
    if (err.code === 'auth/too-many-requests') {
        return 'Too many attempts. Please try again later.';
    }
    if (err.code === 'auth/popup-closed-by-user') {
        return 'Sign in cancelled.';
    }
    return err.message || 'Authentication failed. Please try again.';
}
