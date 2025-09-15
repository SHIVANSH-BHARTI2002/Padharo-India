import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <h1>Create your Account</h1>
                    <p>Start Exploring India</p>
                </div>
                <div className="auth-right">
                    {isLogin ? <LoginForm onToggle={toggleForm} /> : <SignUpForm onToggle={toggleForm} />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;