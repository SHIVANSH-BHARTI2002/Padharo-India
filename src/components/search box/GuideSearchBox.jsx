import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, LanguageIcon, SparklesIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const GuideSearchBox = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for guides...', { searchQuery });
        alert('Searching for guides!');
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
                    {/* Main Search Input */}
                    <div className="relative lg:col-span-2 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by city or guide name..."
                            className="w-full pl-16 pr-6 py-6 text-lg font-medium text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
                        />
                    </div>

                    {/* Filters */}
                    <div className="relative lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <LanguageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select className="w-full pl-12 pr-8 py-6 bg-transparent text-gray-700 border-none outline-none appearance-none cursor-pointer">
                            <option value="">Language</option>
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="spanish">Spanish</option>
                        </select>
                        <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                    </div>

                    <div className="relative lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <SparklesIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select className="w-full pl-12 pr-8 py-6 bg-transparent text-gray-700 border-none outline-none appearance-none cursor-pointer">
                            <option value="">Specialty</option>
                            <option value="history">History</option>
                            <option value="cuisine">Cuisine</option>
                            <option value="adventure">Adventure</option>
                        </select>
                         <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                    </div>

                    {/* Search Button */}
                    <div className="lg:col-span-1 p-2">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-5 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50 flex items-center justify-center text-lg"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideSearchBox;