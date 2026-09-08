import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AdminRecipesList } from './pages/AdminRecipesList';
import { RecipeEditor } from './pages/RecipeEditor';
import { RecipesList } from './pages/RecipesList';
import { RecipeViewer } from './pages/RecipeViewer';
import { Account } from './pages/Account';

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <ScrollToTop />
                <div className="max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-screen flex flex-col justify-between px-4 py-4">
                    <main className="flex-1 min-w-0 w-full">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />

                            {/* All app routes are protected: user must log in to access */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/recipes" element={<RecipesList />} />
                                <Route path="/recipes/:recipeId" element={<RecipeViewer />} />
                                <Route path="/account" element={<Account />} />
                                <Route
                                    path="/admin"
                                    element={<Navigate to="/admin/recipes" replace />}
                                />
                                <Route
                                    path="/admin/recipes"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AdminRecipesList />
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
