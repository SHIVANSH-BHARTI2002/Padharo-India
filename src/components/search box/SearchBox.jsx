import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const SearchBox = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [sortBy, setSortBy] = useState('');

    const handleSearch = () => {
        console.log('Searching...', { searchQuery, selectedDate, selectedService, sortBy });
        alert('Exploring all destinations!');
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Search Input */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Where do you want to explore?"
                            className="w-full pl-12 pr-4 py-4 text-lg font-medium text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Date Filter */}
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 appearance-none cursor-pointer hover:border-amber-300"
                            >
                                <option value="">Select Date</option>
                                <option value="today">Today</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="weekend">This Weekend</option>
                                <option value="next-week">Next Week</option>
                            </select>
                        </div>

                        {/* Service Filter */}
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 appearance-none cursor-pointer hover:border-amber-300"
                            >
                                <option value="">Service Type</option>
                                <option value="hotels">Hotels</option>
                                <option value="cabs">Transportation</option>
                                <option value="guides">Tour Guides</option>
                                <option value="packages">Packages</option>
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div className="relative">
                            <Cog6ToothIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 appearance-none cursor-pointer hover:border-amber-300"
                            >
                                <option value="">Sort by</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50"
                        >
                            Explore Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                {['Taj Mahal', 'Kerala Backwaters', 'Rajasthan Palaces', 'Goa Beaches', 'Himalayan Treks'].map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBox;