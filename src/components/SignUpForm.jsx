import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, DevicePhoneMobileIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
// import OtpVerification from './OtpVerification'; // No longer needed
import { useAuth } from '../context/AuthContext'; // Import the hook

// Add onClose prop
const SignUpForm = ({ onToggle, userType, setUserType, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [businessType, setBusinessType] = useState('');
    // const [showOtp, setShowOtp] = useState(false); // No longer needed

    // Get auth functions and state from context
    const { signup, loading, error, clearError } = useAuth();

    const handleInputChange = (e) => {
        if (error) clearError(); // Clear error on new input
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBusinessTypeChange = (e) => {
        if (error) clearError();
        setBusinessType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) clearError();

        if (!acceptTerms) {
            alert('Please accept the terms and conditions');
            return;
        }

        const submissionData = {
            ...formData,
            userType: userType,
            ...(userType === 'Business' && { businessType: businessType })
        };

        if (userType === 'Business' && !businessType) {
            alert('Please select your business type');
            return;
        }

        // Your backend auth.controller.js now validates password strength
        // and email domain, so we can rely on its error messages.

        const success = await signup(submissionData);

        if (success) {
            onClose(); // Close modal on successful signup
        }
        // If not successful, 'error' state will be set
    };

    // if (showOtp) { // This logic is removed as per backend changes
    //     return <OtpVerification mobileNumber={formData.mobile} />;
    // }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Padharo India</h2>
                <p className="text-gray-600">Create your {userType} account and start exploring</p>
            </div>

            {/* Display API Error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields (unchanged) */}
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
                {/* Email Field (unchanged) */}
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
                {/* Mobile Number Field (unchanged) */}
                 <div>
                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            required
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Enter your mobile number"
                        />
                    </div>
                </div>
                {/* Password Field (unchanged) */}
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
                </div>
                {/* Business Type Dropdown (unchanged) */}
                {userType === 'Business' && (
                    <div>
                        <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
                            Type of Business
                        </label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="businessType"
                                name="businessType"
                                required
                                value={businessType}
                                onChange={handleBusinessTypeChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none"
                            >
                                <option value="" disabled>Select your business type</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Guide">Tour Guide</option>
                                <option value="Cab">Cab Service</option>
                            </select>
                        </div>
                    </div>
                )}
                {/* Terms and Conditions (unchanged) */}
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
                            </a>
                        </label>
                    </div>
                </div>
                {/* Sign Up Button */}
                <button
                    type="submit"
                    disabled={loading || !acceptTerms || (userType === 'Business' && !businessType)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                 {/* Toggle to Login */}
                 <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => { onToggle(); clearError(); }} // Clear error on toggle
                        className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300 hover:underline"
                    >
                        Sign in here
                    </button>
                </p>
            </form>
        </div>
    );
};

export default SignUpForm;