
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

    // Still loading session from localStorage — show spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Not authenticated — redirect to login, remember where they were going
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated but wrong role — redirect to THEIR own dashboard (not the requested one)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        const dashboardMap: Record<UserRoleType, string> = {
            admin: '/admin',
            manager: '/manager',
            agent: '/agent'
        };
        return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
    }

    return <>{children}</>;
};
