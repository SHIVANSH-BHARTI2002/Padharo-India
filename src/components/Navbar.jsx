import React from 'react';
import './Navbar.css';

const Navbar = () => { // Changed this line
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
            <button className="navbar-login">Login</button>
        </nav>
    );
};

export default Navbar;