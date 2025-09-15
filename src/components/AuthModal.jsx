import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './AuthModal.css';
import '../pages/AuthPage.css';
import hawaMahal from '../assets/hawa-mahal.jpg'; // Import the image

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="auth-wrapper-modal">
                    <div className="auth-left" style={{ backgroundImage: `url(${hawaMahal})` }}> {/* Apply image here */}
                        <h1>Create your Account</h1>
                        <p>Start Exploring India!</p>
                    </div>
                    <div className="auth-right">
                        {isLogin ? <LoginForm onToggle={toggleForm} /> : <SignUpForm onToggle={toggleForm} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;