import { signOut } from 'firebase/auth';
import { LogOut, Settings } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function Admin() {
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="pt-2 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                        Admin Dashboard
                    </h1>
                    <p className="text-stone-500 text-sm mt-1 flex items-center space-x-1">
                        <span>Welcome, {user?.displayName || user?.email}</span>
                    </p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                    <Settings className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-stone-900">Admin Area Blank for Now</h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                    This page is successfully protected by Google Auth. We will build the recipe management tools here next.
                </p>
            </div>
        </div>
    );
}

