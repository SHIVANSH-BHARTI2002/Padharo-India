import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                        scrolled ? 'text-amber-600' : 'text-white'
                    }`}>
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            Padharo
                        </span>
                        <span className={scrolled ? 'text-gray-800' : 'text-white'}>
                            INDIA
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex space-x-8 lg:space-x-12">
                        {['Home', 'Cabs', 'Hotels', 'Guides', 'Packages'].map((item) => (
                            <li key={item}>
                                <NavLink
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className={({ isActive }) => `
                                        relative font-medium transition-all duration-300 hover:scale-105
                                        ${scrolled ? 'text-gray-700' : 'text-white'}
                                        ${isActive ? 'text-amber-500' : ''}
                                        after:content-[''] after:absolute after:w-0 after:h-0.5 
                                        after:bottom-[-4px] after:left-0 after:bg-gradient-to-r 
                                        after:from-amber-500 after:to-orange-600 after:transition-all 
                                        after:duration-300 hover:after:w-full
                                        ${isActive ? 'after:w-full' : ''}
                                    `}
                                >
                                    {item}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Login Button */}
                    <button
                        onClick={onLoginClick}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                                 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold 
                                 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Login
                    </button>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className={`w-6 h-6 flex flex-col justify-center items-center ${
                            scrolled ? 'text-gray-700' : 'text-white'
                        }`}>
                            <span className="w-full h-0.5 bg-current mb-1 rounded"></span>
                            <span className="w-full h-0.5 bg-current mb-1 rounded"></span>
                            <span className="w-full h-0.5 bg-current rounded"></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;