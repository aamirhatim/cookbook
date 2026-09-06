import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { RecipeListContainer } from '../components/organisms/RecipeListContainer';

export function Admin() {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <header className="pt-2 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Recipes Editor
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage, search, and filter your recipes.
                    </p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
                    title="Sign Out"
                    aria-label="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            <main className="w-full">
                <RecipeListContainer />
            </main>
        </div>
    );
}

