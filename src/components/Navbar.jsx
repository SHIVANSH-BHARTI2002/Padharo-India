import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { token, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['Home', 'Cabs', 'Hotels', 'Guides', 'Packages'];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Padharo</span>
                            {/* MODIFIED: Changed the default text color to a dark gray for visibility */}
                            <span className={scrolled || isMenuOpen ? 'text-gray-800' : 'text-gray-800'}> INDIA</span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-8 lg:space-x-12">
                        {navLinks.map((item) => (
                            <li key={item}>
                                <NavLink
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    // MODIFIED: Changed default text color from text-white to text-gray-800
                                    className={({ isActive }) => `relative font-medium transition-all duration-300 hover:scale-105 ${scrolled || isMenuOpen ? 'text-gray-700' : 'text-gray-800'} ${isActive ? 'text-amber-500' : ''} after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-amber-500 after:to-orange-600 after:transition-all after:duration-300 hover:after:w-full ${isActive ? 'after:w-full' : ''}`}
                                >
                                    {item}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Login/Logout Button */}
                    <div className="hidden md:block">
                        {token ? (
                            <button
                                onClick={logout}
                                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-md transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-gray-800' : 'text-gray-800'}`}>
                            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg animate-fade-in-down">
                    <ul className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((item) => (
                            <li key={item}>
                                <NavLink
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => `text-lg font-medium transition-colors duration-300 ${isActive ? 'text-amber-600' : 'text-gray-700'}`}
                                >
                                    {item}
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            {token ? (
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold"
                                >
                                    Login
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;