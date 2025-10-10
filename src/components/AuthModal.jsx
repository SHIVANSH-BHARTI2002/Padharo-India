import React, { useState, useContext } from 'react'; 
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import OtpVerification from './OtpVerification';
import { XMarkIcon } from '@heroicons/react/24/outline';
import hawaMahal from '../assets/hawa-mahal.jpg';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
    const { otpRequiredEmail, setOtpRequiredEmail } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('User'); // 'User' or 'Business'

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleOtpSuccess = () => {
        setOtpRequiredEmail(null); // Clear the email from context (closes OTP modal)
        setIsLogin(true);         // Ensure the view switches to the Login Form
    };
    
    // 💡 NEW LOGIC: Determine which component to render
    let FormContent;

    if (otpRequiredEmail) {
        // 1. Show OTP Verification if a sign-up just completed
        FormContent = (
            <OtpVerification 
                email={otpRequiredEmail} 
                onSuccess={handleOtpSuccess} 
                onCancel={() => setOtpRequiredEmail(null)} // Allows user to exit the flow
            />
        );
    } else if (isLogin) {
        // 2. Show Login Form
        FormContent = (
            <LoginForm 
                onToggle={toggleForm} 
                userType={userType} 
                setUserType={setUserType} 
            />
        );
    } else {
        // 3. Show Signup Form
        FormContent = (
            <SignUpForm 
                onToggle={toggleForm} 
                userType={userType} 
                setUserType={setUserType} 
            />
        );
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-label="Close modal"
            ></div>

            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh]">
                    {/* Left Side - Image and Content (no changes here) */}
                    <div
                        className="hidden md:flex w-full md:w-1/2 relative bg-cover bg-center bg-no-repeat flex-col justify-center items-center text-white p-12"
                        style={{ backgroundImage: `url(${hawaMahal})` }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-900/70 to-red-900/80"></div>

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold mb-4">
                                    {isLogin ? "Welcome Back" : "Create Your Account"}
                                </h1>
                                <p className="text-xl text-gray-200 font-medium">
                                    Start Exploring India!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-gray-50 to-white overflow-y-auto custom-scrollbar">
                        <div className="w-full max-w-md">
                            {/* User/Business Toggle - HIDE IF OTP IS REQUIRED */}
                            {!otpRequiredEmail && (
                                <div className="mb-8 flex justify-center bg-gray-200 rounded-full p-1">
                                    <button
                                        onClick={() => setUserType('User')}
                                        className={`w-1/2 py-2 rounded-full transition-colors duration-300 ${userType === 'User' ? 'bg-amber-500 text-white shadow' : 'text-gray-600'}`}
                                    >
                                        User
                                    </button>
                                    <button
                                        onClick={() => setUserType('Business')}
                                        className={`w-1/2 py-2 rounded-full transition-colors duration-300 ${userType === 'Business' ? 'bg-amber-500 text-white shadow' : 'text-gray-600'}`}
                                    >
                                        Business
                                    </button>
                                </div>
                            )}

                            {/* 💡 RENDER THE SELECTED FORM CONTENT */}
                            {FormContent}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;