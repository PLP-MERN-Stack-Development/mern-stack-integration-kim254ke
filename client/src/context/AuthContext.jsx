import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Initialize context
const AuthContext = createContext(null);

// Custom hook to access auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial state from local storage on first render
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                setIsAuthenticated(true);
            } catch (e) {
                // Handle corrupted storage data
                console.error("Failed to parse user data from localStorage:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    // Login function: updates state and local storage
    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    };

    // Logout function: clears state and local storage
    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }), [user, token, isAuthenticated, isLoading]);

    // Render provider only after initial load state is determined
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading application...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
