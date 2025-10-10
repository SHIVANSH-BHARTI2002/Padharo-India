import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authtoken') || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otpRequiredEmail, setOtpRequiredEmail] = useState(null);

    // Axios instance for API calls
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    // Check token from localStorage on initial load
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
            // Set email for OTP verification
            setOtpRequiredEmail(userData.email);
            return response.data;
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
            throw err;
        }
    };

    // OTP Verification Function
    const verifyOtp = async (email, otp) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/verify-otp', { email, otp });
            setLoading(false);
            // OTP verified → clear OTP state
            setOtpRequiredEmail(null);
            return response.data; // { message, authtoken, user }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'OTP verification failed.');
            throw err;
        }
    };

    // Login Function
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.data.authtoken) {
                const { authtoken } = response.data;
                localStorage.setItem('authtoken', authtoken);
                setToken(authtoken);
                setLoading(false);
                return response.data;
            } else {
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

    // Context value
    const authContextValue = {
        token,
        loading,
        error,
        login,
        signup,
        verifyOtp,         // ✅ Added verifyOtp
        logout,
        otpRequiredEmail,
        setOtpRequiredEmail,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
