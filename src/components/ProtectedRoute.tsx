
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRoleType } from '@/models/User';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRoleType[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // You might want to render a spinner here
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardMap: Record<UserRoleType, string> = {
            admin: '/admin',
            manager: '/manager',
            agent: '/agent'
        };
        return <Navigate to={dashboardMap[user.role] || '/'} replace />;
    }

    return <>{children}</>;
};
