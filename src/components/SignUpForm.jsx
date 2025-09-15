import React from 'react';

const SignUpForm = ({ onToggle }) => {
    return (
        <div className="auth-form-container">
            <h2>Sign Up</h2>
            <form className="auth-form">
                <input type="text" placeholder="First name" required />
                <input type="text" placeholder="Last name" required />
                <input type="email" placeholder="Email address" required />
                <input type="password" placeholder="Password" required />
                <div className="terms-container">
                    <input type="checkbox" id="terms" />
                    <label htmlFor="terms">Accept Terms & Conditions</label>
                </div>
                <button type="submit" className="btn btn-primary">Join us</button>
            </form>
            <div className="social-login">
                <button className="btn btn-secondary">Sign up with Google</button>
                <button className="btn btn-secondary">Sign up with Apple</button>
            </div>
            <p className="toggle-auth">
                Already have an account? <span onClick={onToggle}>Login</span>
            </p>
        </div>
    );
};

export default SignUpForm;