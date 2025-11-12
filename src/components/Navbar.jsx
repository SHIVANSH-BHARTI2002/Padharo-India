/* === Filename: src/components/Navbar.jsx === */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    BriefcaseIcon,
    BuildingOffice2Icon,
    ShieldCheckIcon // --- NEW IMPORT ---
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import defaultAvatar from '../assets/man.png';

const Navbar = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isLoggedIn, user, logout } = useAuth();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    const navLinks = ['Home', /* 'Cabs', */ 'Hotels', 'Guides', 'Packages'];

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen
                ? 'bg-white/95 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-amber-600' : 'text-white'
                        }`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                Padharo
                            </span>
                            <span className={scrolled || isMenuOpen ? 'text-gray-800' : 'text-white'}>
                                INDIA
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-8 lg:space-x-12">
                        {navLinks.map((item) => (
                            <li key={item}>
                                <NavLink
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className={({ isActive }) => `
                                        relative font-medium transition-all duration-300 hover:scale-105
                                        ${scrolled || isMenuOpen ? 'text-gray-700' : 'text-white'}
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

                    {/* Desktop Auth Section */}
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border-2 transition-colors duration-300
                                        ${isProfileOpen ? 'border-amber-500' : 'border-transparent'}
                                        ${scrolled || isMenuOpen ? 'hover:border-amber-400' : 'hover:border-white/50'}`}
                                >
                                    <img
                                        src={user?.profileImageUrl || defaultAvatar}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute top-14 right-0 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-down z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <nav className="py-2">
                                            {/* --- NEW: Admin Dashboard Link --- */}
                                            {user?.role === 'Admin' && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                                >
                                                    <ShieldCheckIcon className="h-5 w-5 mr-3" />
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                            >
                                                <UserIcon className="h-5 w-5 mr-3" />
                                                View Profile
                                            </Link>

                                            {user?.role === 'Business' && user?.businessType === 'Cab' && (
                                                <Link
                                                    to="/driver-profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mr-3"><path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a3 3 0 0 1 5.8 1.82l1.938-.518a1.75 1.75 0 0 1 1.986 1.15l1.42 5.438a1.75 1.75 0 0 1-1.15 1.986l-5.438 1.42a1.75 1.75 0 0 1-1.986-1.15l-.518-1.937a3 3 0 0 1-1.82-5.8L3 5.18A1.75 1.75 0 0 1 1.51 3.446L1 1.82A.75.75 0 0 1 1 1.75Zm6.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M10.75 10.75a.75.75 0 0 1 .75-.75h5.69l-1.42-5.438a.25.25 0 0 0-.284-.164L10.75 6.096v4.654Zm-1.5 0v-4.654L3.904 4.4a.25.25 0 0 0-.284.164L2.2 9.998h5.69a.75.75 0 0 1 .75.75Z"></path><path d="M10.75 12.25v4.654l5.438-1.42a.25.25 0 0 0 .164-.284L14.93 9.75h-4.18Zm-1.5 0h-4.18l-1.42 5.438a.25.25 0 0 0 .284.164L9.25 16.904v-4.654Z"></path></svg>
                                                    Driver Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'Business' && user?.businessType === 'Guide' && (
                                                <Link
                                                    to="/dashboard/guide"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                                >
                                                    <BriefcaseIcon className="h-5 w-5 mr-3" />
                                                    Guide Dashboard
                                                </Link>
                                            )}

                                            {user?.role === 'Business' && user?.businessType === 'Hotel' && (
                                                <Link
                                                    to="/dashboard/hotel"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                                >
                                                    <BuildingOffice2Icon className="h-5 w-5 mr-3" />
                                                    Hotel Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                            >
                                                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                                                Logout
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                                         text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold 
                                         transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-gray-700' : 'text-white'
                                }`}>
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
                                    className={({ isActive }) => `
                                        text-lg font-medium transition-colors duration-300
                                        ${isActive ? 'text-amber-600' : 'text-gray-700'}
                                    `}
                                >
                                    {item}
                                </NavLink>
                            </li>
                        ))}
                        {isLoggedIn ? (
                            <>
                                {/* --- NEW: Admin Link for Mobile --- */}
                                {user?.role === 'Admin' && (
                                    <li>
                                        <NavLink
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg font-medium text-gray-700"
                                        >
                                            Admin Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-medium text-gray-700"
                                    >
                                        View Profile
                                    </NavLink>
                                </li>
                                {user?.role === 'Business' && user?.businessType === 'Cab' && (
                                    <li>
                                        <NavLink
                                            to="/driver-profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg font-medium text-gray-700"
                                        >
                                            Driver Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                {user?.role === 'Business' && user?.businessType === 'Guide' && (
                                    <li>
                                        <NavLink
                                            to="/dashboard/guide"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg font-medium text-gray-700"
                                        >
                                            Guide Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                {user?.role === 'Business' && user?.businessType === 'Hotel' && (
                                    <li>
                                        <NavLink
                                            to="/dashboard/hotel"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg font-medium text-gray-700"
                                        >
                                            Hotel Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    onClick={() => {
                                        onLoginClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold"
                                >
                                    Login
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;