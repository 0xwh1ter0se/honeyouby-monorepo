import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'owner' | 'manager' | 'staff';

interface User {
    username: string;
    role: UserRole;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, role: UserRole) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('ho_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('ho_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, role: UserRole) => {
        // In a real app, verify with backend. Here we mock it as requested.
        const newUser: User = {
            username,
            role,
            name: role === 'owner' ? 'Owner Admin' : 'Staff Member'
        };
        setUser(newUser);
        localStorage.setItem('ho_user', JSON.stringify(newUser));
        localStorage.setItem('isAuthenticated', 'true'); // Keep legacy key for now
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ho_user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
