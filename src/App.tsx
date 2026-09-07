import { Routes, Route } from 'react-router-dom';
import { IconNotebook, IconPlus, IconSearch } from '@tabler/icons-react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { RecipeEditor } from './pages/RecipeEditor';
function Home() {
    return (
        <div className="space-y-6">
            <header className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    My Recipe Book
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Handcrafted dishes, cooking notes, and family favorites.
                </p>
            </header>

            {/* Quick Search Bar */}
            <div className="relative">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" stroke={1} />
                <input
                    type="text"
                    placeholder="Search recipes, tags, ingredients..."
                    className="w-full bg-surface border border-input text-foreground rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors shadow-sm"
                />
            </div>

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

            {/* Empty State / Get Started */}
            <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto">
                    <IconNotebook className="w-6 h-6" stroke={1} />
                </div>
                <h3 className="font-semibold text-foreground">No recipes yet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    Your digital kitchen is ready. Start adding your first recipe or explore collections.
                </p>
                <button className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors active:scale-98">
                    <IconPlus className="w-4 h-4" stroke={1} />
                    <span>New Recipe</span>
                </button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <div className="max-w-lg mx-auto min-h-screen flex flex-col justify-between px-4 py-4">
                <main className="flex-1 min-w-0 w-full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/recipes/:recipeId"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <RecipeEditor />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}
