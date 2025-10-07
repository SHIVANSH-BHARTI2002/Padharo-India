<<<<<<< HEAD
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginForm = ({ onToggle }) => {
    const { login, loading, error } = useContext(AuthContext); // Use context
=======
import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginForm = ({ onToggle, userType, setUserType }) => {
>>>>>>> origin/main
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

<<<<<<< HEAD
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            // The modal will be closed by the App component upon successful login
        } catch (err) {
            // Error is already set in the context, but you can log it here if needed
            console.error('Login failed:', err);
        }
=======
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', formData, 'as', userType);
>>>>>>> origin/main
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
<<<<<<< HEAD
                <p className="text-gray-600">Sign in to continue your journey</p>
=======
                <p className="text-gray-600">Sign in to continue your journey as a {userType}</p>
>>>>>>> origin/main
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

<<<<<<< HEAD
                {/* Display Login Error */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors duration-300" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
=======
                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors duration-300"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

>>>>>>> origin/main
                    <div className="text-sm">
                        <a href="#" className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300">
                            Forgot password?
                        </a>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
<<<<<<< HEAD
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
                
                {/* Toggle to Sign Up */}
                <p className="mt-8 text-center text-gray-600">
                    Don't have an account?{' '}
                    <button type="button" onClick={onToggle} className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300 hover:underline">
                        Sign up now
                    </button>
                </p>
            </form>
=======
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50"
                >
                    Sign In
                </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                </div>
            </div>

            {/* Social Login */}
            <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>

            {/* Toggle to Sign Up */}
            <p className="mt-8 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300 hover:underline"
                >
                    Sign up now
                </button>
            </p>
>>>>>>> origin/main
        </div>
    );
};

export default LoginForm;