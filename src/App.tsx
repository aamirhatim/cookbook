import { Routes, Route } from 'react-router-dom';
import { BookOpen, PlusCircle, Search } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
function Home() {
    return (
        <div className="space-y-6">
            <header className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                    My Recipe Book
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Handcrafted dishes, cooking notes, and family favorites.
                </p>
            </header>

            {/* Quick Search Bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search recipes, tags, ingredients..."
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors shadow-sm"
                />
            </div>

            {/* Status Card: Local Emulators */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 text-xs sm:text-sm flex items-start space-x-3">
                <div className="text-lg">🔥</div>
                <div className="space-y-1">
                    <p className="font-semibold text-amber-950">Firebase Local Backend Configured</p>
                    <p className="text-amber-800/90 leading-relaxed">
                        Connected to local Firebase emulators: Firestore (8080), Auth (9099), Storage (9199), and UI (4000).
                    </p>
                </div>
            </div>

            {/* Empty State / Get Started */}
            <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-stone-900">No recipes yet</h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                    Your digital kitchen is ready. Start adding your first recipe or explore collections.
                </p>
                <button className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors active:scale-98">
                    <PlusCircle className="w-4 h-4" />
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
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}
