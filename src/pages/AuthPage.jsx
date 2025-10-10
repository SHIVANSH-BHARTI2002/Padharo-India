import React, { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import LoginForm from '../components/LoginForm';
import OtpVerification from '../components/OtpVerification';
import SignUpForm from '../components/SignUpForm';

const AuthPage = () => {
    const { otpRequiredEmail, setOtpRequiredEmail } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('User');

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    // const handleOtpSuccess = () => {
    //     setOtpRequiredEmail(null); // Clear context state
    //     setIsLogin(true);         // Show the Login form
    // };

    // 💡 NEW: Function to run after OTP verification succeeds
    const handleOtpSuccess = () => {
        setOtpRequiredEmail(null); // Clear context state
        setIsLogin(true);         // Show the Login form
    };

    // --- Determine which component to render ---
    let FormContent;

    if (otpRequiredEmail) {
        // 1. OTP Verification takes precedence
        FormContent = (
            <OtpVerification 
                email={otpRequiredEmail} 
                onSuccess={handleOtpSuccess} 
                // Allow user to cancel/exit the OTP process and go back to Login/Signup screen
                onCancel={() => setOtpRequiredEmail(null)} 
            />
        );
    } else if (isLogin) {
        // 2. Login Form
        FormContent = (
            <LoginForm 
                onToggle={toggleForm} 
                userType={userType} 
                setUserType={setUserType} 
            />
        );
    } else {
        // 3. Signup Form
        FormContent = (
            <SignUpForm 
                onToggle={toggleForm} // The `onToggle` call inside here must be removed (see Step 2)
                userType={userType} 
                setUserType={setUserType}
            />
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* ... (auth-left section remains the same) ... */}
                <div className="auth-right">
                    
                    {/* User/Business Toggle */}
                    {/* 💡 Conditionally hide the toggle while on OTP screen */}
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
                    
                    {FormContent} {/* 💡 Render the determined component */}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;