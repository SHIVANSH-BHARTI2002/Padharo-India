import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiLogin, apiSignup } from '../apiService';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Effect to set user data on initial load if token exists
    // In a full app, you'd also fetch('/api/user/profile') here to verify the token
    useEffect(() => {
        if (token) {
            try {
                // For simplicity, we get user from localStorage.
                // A better practice is to fetch profile from API using the token.
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                logout(); // Clear bad data
            }
        }
    }, [token]);

    const handleAuthSuccess = (data) => {
        setToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError(null);
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiLogin(email, password);
            handleAuthSuccess(data);
            return true; // Indicate success
        } catch (err) {
            setError(err.message);
            setIsLoggedIn(false);
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    const signup = async (signupData) => {
        setLoading(true);
        setError(null);
        try {
            // Your backend signup controller now returns token and user directly
            const data = await apiSignup(signupData);
            handleAuthSuccess(data);
            return true; // Indicate success
        } catch (err) {
            setError(err.message);
            setIsLoggedIn(false);
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Allow consumers to update user object (e.g., after avatar upload)
    const updateUser = (nextUser) => {
        setUser(nextUser);
        try {
            localStorage.setItem('user', JSON.stringify(nextUser));
        } catch (e) {
            /* ignore storage errors */
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn,
                loading,
                error,
                login,
                signup,
                logout,
                updateUser,
                clearError: () => setError(null) // Helper to clear errors
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to use the context
export const useAuth = () => {
    return useContext(AuthContext);
};