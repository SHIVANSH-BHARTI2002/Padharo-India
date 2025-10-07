import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MapPinIcon, 
    PhoneIcon, 
    EnvelopeIcon, 
    GlobeAltIcon,
    HeartIcon 
} from '@heroicons/react/24/outline';
import { 
    FacebookIcon,
    TwitterIcon,
    InstagramIcon,
    LinkedinIcon
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="relative">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold mb-4">
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                        Padharo
                                    </span>
                                    <span className="text-white ml-2">INDIA</span>
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                                    Explore the mysteries and wonders of India with us. Your next extraordinary adventure 
                                    is just a click away. Discover, experience, and create unforgettable memories.
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <MapPinIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                                    <span>Bhopal, Madhya Pradesh, India</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <PhoneIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <EnvelopeIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                                    <span>hello@padharoindia.com</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8">
                                <h4 className="text-white font-semibold mb-4">Follow Our Journey</h4>
                                <div className="flex space-x-4">
                                    {[
                                        { icon: FacebookIcon, color: 'hover:text-blue-400', label: 'Facebook' },
                                        { icon: TwitterIcon, color: 'hover:text-sky-400', label: 'Twitter' },
                                        { icon: InstagramIcon, color: 'hover:text-pink-400', label: 'Instagram' },
                                        { icon: LinkedinIcon, color: 'hover:text-blue-500', label: 'LinkedIn' }
                                    ].map(({ icon: Icon, color, label }) => (
                                        <a
                                            key={label}
                                            href="#"
                                            className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl text-gray-300 ${color} 
                                                     hover:bg-white/20 transform hover:scale-110 transition-all duration-300 
                                                     border border-white/20 hover:border-white/40`}
                                            aria-label={label}
                                        >
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
                            <ul className="space-y-4">
                                {[
                                    { to: '/', label: 'Home' },
                                    { to: '/cabs', label: 'Cabs' },
                                    { to: '/hotels', label: 'Hotels' },
                                    { to: '/guides', label: 'Guides' },
                                    { to: '/packages', label: 'Packages' }
                                ].map(({ to, label }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="text-gray-300 hover:text-amber-400 transition-all duration-300 
                                                     hover:translate-x-2 inline-block transform hover:font-medium"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Stay Connected</h3>
                            <p className="text-gray-300 mb-6">
                                Subscribe to get special offers, travel tips, and destination updates.
                            </p>
                            
                            <form className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
                                                 rounded-xl text-white placeholder-gray-400 focus:outline-none 
                                                 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                                                 transition-all duration-300"
                                    />
                                    <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                                
                                <textarea
                                    rows="3"
                                    placeholder="Your message (optional)"
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
                                             rounded-xl text-white placeholder-gray-400 focus:outline-none 
                                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                                             transition-all duration-300 resize-none"
                                ></textarea>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 
                                             hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl 
                                             transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-gray-400 text-center md:text-left">
                                <p className="flex items-center justify-center md:justify-start">
                                    © {new Date().getFullYear()} padharoindia.com | Designed with 
                                    <HeartIcon className="h-4 w-4 text-red-500 mx-1 animate-pulse" />
                                    in India
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors duration-300">Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;