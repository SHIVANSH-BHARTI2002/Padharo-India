import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SignUpForm = ({ onToggle }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!acceptTerms) {
            alert('Please accept the terms and conditions');
            return;
        }
        console.log('Sign up submitted:', formData);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Padharo India</h2>
                <p className="text-gray-600">Create your account and start exploring</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                                placeholder="First name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                                placeholder="Last name"
                            />
                        </div>
                    </div>
                </div>

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
                            placeholder="Create a password"
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
                    
                    {/* Password Strength Indicator */}
                    <div className="mt-2 space-y-2">
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full ${
                                        formData.password.length >= level * 2
                                            ? level <= 2
                                                ? 'bg-red-400'
                                                : level === 3
                                                ? 'bg-yellow-400'
                                                : 'bg-green-400'
                                            : 'bg-gray-200'
                                    } transition-colors duration-300`}
                                ></div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                                8+ characters
                            </span>
                            <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                                Uppercase
                            </span>
                            <span className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                                Number
                            </span>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                    <div className="flex items-center h-6">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors duration-300"
                        />
                    </div>
                    <div className="text-sm leading-6">
                        <label htmlFor="terms" className="text-gray-600">
                            I accept the{' '}
                            <a href="#" className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300">
                                Terms & Conditions
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                </div>

                {/* Sign Up Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={!acceptTerms}
                >
                    Create Account
                </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
                    </div>
                </div>
            </div>

            {/* Social Sign Up */}
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

            {/* Toggle to Login */}
            <p className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300 hover:underline"
                >
                    Sign in here
                </button>
            </p>
        </div>
    );
};

export default SignUpForm;