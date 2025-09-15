import React from 'react';

const LoginForm = ({ onToggle }) => {
    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="auth-form">
                <input type="email" placeholder="Email address" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <div className="social-login">
                <button className="btn btn-secondary">Login with Google</button>
                <button className="btn btn-secondary">Login with Apple</button>
            </div>
            <p className="toggle-auth">
                Don't have an account? <span onClick={onToggle}>Sign Up</span>
            </p>
        </div>
    );
};

export default LoginForm;