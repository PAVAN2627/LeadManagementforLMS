
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, UserRoleType } from '@/models/User';

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: IUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Validate token with /api/auth/me
            fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Session invalid');
                })
                .then(data => {
                    setUser(data.user);
                    setToken(storedToken);
                })
                .catch(() => {
                    // Invalid token, clear storage
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: IUser) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
