import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { XMarkIcon } from '@heroicons/react/24/outline';
import hawaMahal from '../assets/hawa-mahal.jpg';

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

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

                <div className="flex h-[800px]">
                    {/* Left Side - Image and Content */}
                    <div 
                        className="flex-1 relative bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-white p-12"
                        style={{ backgroundImage: `url(${hawaMahal})` }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-900/70 to-red-900/80"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold mb-4">
                                    Create Your
                                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                        Account
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-200 font-medium">
                                    Start Exploring India!
                                </p>
                            </div>
                            
                            {/* Features */}
                            <div className="space-y-4 text-left max-w-sm">
                                {[
                                    '🏛️ Discover 1000+ destinations',
                                    '🎒 Personalized travel packages',
                                    '🚗 Premium cab services',
                                    '🏨 Best hotel deals'
                                ].map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                        style={{ animationDelay: `${index * 200}ms` }}
                                    >
                                        <span className="text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex-1 flex items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-white">
                        <div className="w-full max-w-md">
                            {isLogin ? (
                                <LoginForm onToggle={toggleForm} />
                            ) : (
                                <SignUpForm onToggle={toggleForm} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;