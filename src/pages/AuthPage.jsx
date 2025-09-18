import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('User');

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <h1>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
                    <p>Start Exploring India as a {userType}</p>
                </div>
                <div className="auth-right">
                     {/* User/Business Toggle */}
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
                    {isLogin ? <LoginForm onToggle={toggleForm} userType={userType} setUserType={setUserType} /> : <SignUpForm onToggle={toggleForm} userType={userType} setUserType={setUserType}/>}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;