import React from 'react';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => { // Accept onLoginClick as a prop
    return (
        <nav className="navbar">
            <div className="navbar-brand">Padharo INDIA</div>
            <ul className="navbar-links">
                <li><a href="#" className="active">Home</a></li>
                <li><a href="#">Cabs</a></li>
                <li><a href="#">Hotels</a></li>
                <li><a href="#">Guides</a></li>
                <li><a href="#">Packages</a></li>
            </ul>
            {/* Call the onLoginClick function when the button is clicked */}
            <button className="navbar-login" onClick={onLoginClick}>Login</button>
        </nav>
    );
};

export default Navbar;