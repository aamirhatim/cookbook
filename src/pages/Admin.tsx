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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Recipes Editor
                    </h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>
        </div>
    );
}

