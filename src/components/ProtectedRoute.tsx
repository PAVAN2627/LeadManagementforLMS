import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized or dashboard based on role
        // For now, redirect to their allowed dashboard or home
        if (user.role === 'Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Manager') return <Navigate to="/manager" replace />;
        if (user.role === 'Agent') return <Navigate to="/agent" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
