import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { XMarkIcon } from '@heroicons/react/24/outline';
import hawaMahal from '../assets/hawa-mahal.jpg';
import { useAuth } from '../context/AuthContext'; // Import hook to clear errors

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('User'); // 'User' or 'Business'
    const { clearError } = useAuth(); // Get clearError function

    const toggleForm = () => {
        setIsLogin(!isLogin);
        clearError(); // Clear any errors when toggling form
    };

    const handleClose = () => {
        clearError(); // Clear errors when closing modal
        onClose();
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
        clearError(); // Clear errors when changing type
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="fixed inset-0"
                onClick={handleClose} // Use handleClose
                aria-label="Close modal"
            ></div>

            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={handleClose} // Use handleClose
                    className="absolute top-6 right-6 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh]">
                    {/* Left Side (unchanged) */}
                    <div
                        className="hidden md:flex w-full md:w-1/2 relative bg-cover bg-center bg-no-repeat flex-col justify-center items-center text-white p-12"
                        style={{ backgroundImage: `url(${hawaMahal})` }}
                    >
                         <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-900/70 to-red-900/80"></div>
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
                             {/* User/Business Toggle */}
                            <div className="mb-8 flex justify-center bg-gray-200 rounded-full p-1">
                                <button
                                    onClick={() => handleUserTypeChange('User')} // Use handler
                                    className={`w-1/2 py-2 rounded-full transition-colors duration-300 ${userType === 'User' ? 'bg-amber-500 text-white shadow' : 'text-gray-600'}`}
                                >
                                    User
                                </button>
                                <button
                                    onClick={() => handleUserTypeChange('Business')} // Use handler
                                    className={`w-1/2 py-2 rounded-full transition-colors duration-300 ${userType === 'Business' ? 'bg-amber-500 text-white shadow' : 'text-gray-600'}`}
                                >
                                    Business
                                </button>
                            </div>

                            {isLogin ? (
                                <LoginForm 
                                    onToggle={toggleForm} 
                                    userType={userType} 
                                    setUserType={setUserType} 
                                    onClose={handleClose} // Pass handleClose
                                />
                            ) : (
                                <SignUpForm 
                                    onToggle={toggleForm} 
                                    userType={userType} 
                                    setUserType={setUserType} 
                                    onClose={handleClose} // Pass handleClose
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;