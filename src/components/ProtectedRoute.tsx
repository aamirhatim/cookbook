import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full pt-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect them to the /login page
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Logged-in non-admin user trying to access admin routes
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

