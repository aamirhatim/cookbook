import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { IconLoader2 } from '@tabler/icons-react';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const SignUp = lazy(() => import('./pages/SignUp').then((m) => ({ default: m.SignUp })));
const AdminRecipesList = lazy(() => import('./pages/AdminRecipesList').then((m) => ({ default: m.AdminRecipesList })));
const RecipeEditor = lazy(() => import('./pages/RecipeEditor').then((m) => ({ default: m.RecipeEditor })));
const RecipesList = lazy(() => import('./pages/RecipesList').then((m) => ({ default: m.RecipesList })));
const RecipeViewer = lazy(() => import('./pages/RecipeViewer').then((m) => ({ default: m.RecipeViewer })));
const Account = lazy(() => import('./pages/Account').then((m) => ({ default: m.Account })));

function RouteLoadingFallback() {
    return (
        <div className="flex flex-col justify-center items-center h-full min-h-[50vh] text-muted-foreground gap-3">
            <IconLoader2 className="w-8 h-8 animate-spin text-primary" stroke={1.5} />
            <span className="text-xs font-medium tracking-wide uppercase">Loading page...</span>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <ScrollToTop />
                <div className="max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto min-h-screen flex flex-col justify-between px-4 py-4">
                    <main className="flex-1 min-w-0 w-full">
                        <Suspense fallback={<RouteLoadingFallback />}>
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
                        </Suspense>
                    </main>
                </div>
            </ToastProvider>
        </AuthProvider>
    );
}
