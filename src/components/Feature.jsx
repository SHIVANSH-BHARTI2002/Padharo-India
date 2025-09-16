import React from 'react';
import { UsersIcon, FireIcon } from '@heroicons/react/24/solid';

const Feature = () => {
    return (
        <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 mb-6">
                            <FireIcon className="h-5 w-5 text-cyan-400 mr-2" />
                            <span className="text-cyan-300 text-sm font-semibold tracking-wider uppercase">
                                Himalayan Treks
                            </span>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                            Conquer the
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Frozen Trails
                            </span>
                        </h2>
                        
                        {/* Description */}
                        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
                            Embark on an extraordinary journey through the majestic Himalayas. Experience breathtaking landscapes, challenge your limits, and create memories that will last a lifetime.
                        </p>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Bookings Card */}
                        <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <UsersIcon className="h-8 w-8 text-white" />
                                </div>
                                
                                <div className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                                    529+
                                </div>
                                <div className="text-gray-300 font-medium">
                                    People Already Booked
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Temperature Card */}
                        <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="text-white font-bold text-xl">°C</div>
                                </div>
                                
                                <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                                    -20° to 10°
                                </div>
                                <div className="text-gray-300 font-medium">
                                    Temperature Range
                                </div>
                                
                                {/* Temperature Indicator */}
                                <div className="mt-4 flex items-center space-x-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                                    <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full"></div>
                                    <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Card - Spans both columns on mobile */}
                        <div className="sm:col-span-2">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    Ready for Adventure?
                                </h3>
                                <p className="text-orange-100 mb-6">
                                    Join hundreds of adventurers on the journey of a lifetime
                                </p>
                                <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors duration-300 transform hover:scale-105">
                                    Book Your Trek Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Feature;
