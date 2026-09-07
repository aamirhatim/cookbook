import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { RecipeEditor } from './pages/RecipeEditor';

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <div className="max-w-lg mx-auto min-h-screen flex flex-col justify-between px-4 py-4">
                    <main className="flex-1 min-w-0 w-full">
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            {/* All app routes are protected: user must log in to access */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Home />} />
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
                            </Route>
                        </Routes>
                    </main>
                </div>
            </ToastProvider>
        </AuthProvider>
    );
}
