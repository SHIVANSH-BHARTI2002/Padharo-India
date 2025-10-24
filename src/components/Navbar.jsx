// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// const Navbar = ({ onLoginClick }) => {
//     const [scrolled, setScrolled] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             const isScrolled = window.scrollY > 100;
//             setScrolled(isScrolled);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const navLinks = ['Home', 'Cabs', 'Hotels', 'Guides', 'Packages'];

//     return (
//         <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//             scrolled || isMenuOpen
//                 ? 'bg-white/95 backdrop-blur-lg shadow-lg'
//                 : 'bg-transparent'
//         }`}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16 lg:h-20">
//                     {/* Logo */}
//                     <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
//                         scrolled || isMenuOpen ? 'text-amber-600' : 'text-white'
//                     }`}>
//                         <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
//                             <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
//                                 Padharo
//                             </span>
//                             <span className={scrolled || isMenuOpen ? 'text-gray-800' : 'text-white'}>
//                                 INDIA
//                             </span>
//                         </NavLink>
//                     </div>

//                     {/* Desktop Navigation Links */}
//                     <ul className="hidden md:flex space-x-8 lg:space-x-12">
//                         {navLinks.map((item) => (
//                             <li key={item}>
//                                 <NavLink
//                                     to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
//                                     className={({ isActive }) => `
//                                         relative font-medium transition-all duration-300 hover:scale-105
//                                         ${scrolled ? 'text-gray-700' : 'text-white'}
//                                         ${isActive ? 'text-amber-500' : ''}
//                                         after:content-[''] after:absolute after:w-0 after:h-0.5 
//                                         after:bottom-[-4px] after:left-0 after:bg-gradient-to-r 
//                                         after:from-amber-500 after:to-orange-600 after:transition-all 
//                                         after:duration-300 hover:after:w-full
//                                         ${isActive ? 'after:w-full' : ''}
//                                     `}
//                                 >
//                                     {item}
//                                 </NavLink>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* Desktop Login Button */}
//                     <div className="hidden md:block">
//                         <button
//                             onClick={onLoginClick}
//                             className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
//                                      text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-semibold 
//                                      transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
//                         >
//                             Login
//                         </button>
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <div className="md:hidden">
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             className={`p-2 rounded-md transition-colors duration-300 ${
//                                 scrolled || isMenuOpen ? 'text-gray-700' : 'text-white'
//                             }`}>
//                             {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             {isMenuOpen && (
//                  <div className="md:hidden bg-white shadow-lg animate-fade-in-down">
//                     <ul className="flex flex-col items-center space-y-6 py-8">
//                          {navLinks.map((item) => (
//                             <li key={item}>
//                                 <NavLink
//                                     to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
//                                     onClick={() => setIsMenuOpen(false)}
//                                     className={({ isActive }) => `
//                                         text-lg font-medium transition-colors duration-300
//                                         ${isActive ? 'text-amber-600' : 'text-gray-700'}
//                                     `}
//                                 >
//                                     {item}
//                                 </NavLink>
//                             </li>
//                         ))}
//                          <li>
//                             <button
//                                 onClick={() => {
//                                     onLoginClick();
//                                     setIsMenuOpen(false);
//                                 }}
//                                 className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold"
//                             >
//                                 Login
//                             </button>
//                         </li>
//                     </ul>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
    Bars3Icon, 
    XMarkIcon, 
    UserCircleIcon, 
    UserIcon, 
    ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import defaultAvatar from '../assets/man.png'; // Placeholder avatar

const Navbar = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- Temporary state to simulate login ---
    // In a real app, this would come from a context or prop
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [userName, setUserName] = useState('Rajesh Kumar'); // Placeholder
    // ------------------------------------------

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

    // Handle click outside to close profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const navLinks = ['Home', 'Cabs', 'Hotels', 'Guides', 'Packages'];

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        // Add any other logout logic here
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled || isMenuOpen
                ? 'bg-white/95 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                        scrolled || isMenuOpen ? 'text-amber-600' : 'text-white'
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

                    {/* Desktop Auth Section */}
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                            <div className="relative" ref={profileMenuRef}>
                                {/* Profile Icon Button */}
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border-2 transition-colors duration-300
                                        ${isProfileOpen ? 'border-amber-500' : 'border-transparent'}
                                        ${scrolled || isMenuOpen ? 'hover:border-amber-400' : 'hover:border-white/50'}`}
                                >
                                    <img 
                                        src={defaultAvatar} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute top-14 right-0 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-down z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="font-semibold text-gray-800">{userName}</p>
                                            <p className="text-sm text-gray-500">Welcome back!</p>
                                        </div>
                                        <nav className="py-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-200"
                                            >
                                                <UserIcon className="h-5 w-5 mr-3" />
                                                View Profile
                                            </Link>
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
                            // Original Login Button
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
                            className={`p-2 rounded-md transition-colors duration-300 ${
                                scrolled || isMenuOpen ? 'text-gray-700' : 'text-white'
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
                                <li>
                                    <NavLink
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-medium text-gray-700"
                                    >
                                        View Profile
                                    </NavLink>
                                </li>
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