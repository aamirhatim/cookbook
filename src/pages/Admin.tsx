import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';

export function Admin() {
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
                        Recipes Editor
                    </h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>
        </div>
    );
}

