import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authtoken') || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Set up axios instance for API calls
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    // Effect to check for token in localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('authtoken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Signup Function
    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/createuser', userData);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
            throw err;
        }
    };

    // Login Function - UPDATED
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/login', credentials);
            
            // THE FIX: Check for the 'authtoken' field instead of 'success'
            if (response.data.authtoken) {
                const { authtoken } = response.data;
                localStorage.setItem('authtoken', authtoken);
                setToken(authtoken);
                setLoading(false); // This will now run correctly
                return response.data;
            } else {
                // Handle cases where the API call succeeds but login fails (e.g., wrong password)
                // This part might not be hit if your API returns a 401 error, which is handled by catch.
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
            throw err;
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem('authtoken');
        setToken(null);
    };

    // The value provided to consuming components
    const authContextValue = {
        token,
        loading,
        error,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};