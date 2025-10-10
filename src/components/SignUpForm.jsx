import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const SignUpForm = ({ onToggle }) => {
    const { signup, loading } = useContext(AuthContext); // Use context
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState(null); // Local error for this form
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { setOtpRequiredEmail } = useContext(AuthContext); // 👈 add this at the top of your component

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
        setError('You must accept the terms and conditions.');
        return;
    }

    try {
        // Combine first and last name to match backend's 'name' field
        const userData = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
        };

        const result = await signup(userData);

        if (result?.message?.includes("OTP sent")) {
            console.log("OTP sent successfully for:", userData.email);

            // ✅ Instead of navigate, trigger OTP flow in AuthPage
            setOtpRequiredEmail(userData.email);
        } else {
            alert(result?.message || "Signup successful!");
        }
    } catch (err) {
        setError(err.response?.data?.error || 'An error occurred during signup.');
        console.error('Signup failed:', err);
    }
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
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white" placeholder="First name" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white" placeholder="Last name" />
                        </div>
                    </div>
                </div>
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white" placeholder="Enter your email" />
                    </div>
                </div>
                {/* Mobile Number Field */}
                <div>
                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="mobile" name="mobile" type="tel" required value={formData.mobile} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white" placeholder="Enter your mobile number" />
                    </div>
                </div>
                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 focus:bg-white" placeholder="Create a password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                
                {/* Display Signup Error */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                    <div className="flex items-center h-6">
                        <input id="terms" name="terms" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors duration-300" />
                    </div>
                    <div className="text-sm leading-6">
                        <label htmlFor="terms" className="text-gray-600">I accept the{' '}
                            <a href="#" className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300">Terms & Conditions</a>
                        </label>
                    </div>
                </div>
                {/* Sign Up Button */}
                <button
                    type="submit"
                    disabled={loading || !acceptTerms}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                {/* Toggle to Login */}
                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <button type="button" onClick={onToggle} className="text-amber-600 hover:text-amber-500 font-semibold transition-colors duration-300 hover:underline">
                        Sign in here
                    </button>
                </p>
            </form>
        </div>
    );
};

export default SignUpForm;