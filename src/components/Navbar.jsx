import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Padharo INDIA</div>
            <ul className="navbar-links">
                {/* Replace a href with NavLink to */}
                <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                <li><NavLink to="/cabs" className={({ isActive }) => isActive ? "active" : ""}>Cabs</NavLink></li>
                <li><NavLink to="/hotels" className={({ isActive }) => isActive ? "active" : ""}>Hotels</NavLink></li>
                <li><NavLink to="/guides" className={({ isActive }) => isActive ? "active" : ""}>Guides</NavLink></li>
                <li><NavLink to="/packages" className={({ isActive }) => isActive ? "active" : ""}>Packages</NavLink></li>
            </ul>
            <button className="navbar-login" onClick={onLoginClick}>Login</button>
        </nav>
    );
};

export default Navbar;