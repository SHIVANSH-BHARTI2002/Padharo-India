import React, { useState } from 'react';
import { MagnifyingGlassIcon, CalendarDaysIcon, StarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// 🔑 MODIFICATION 1: Component accepts filters and setFilters props from the parent
const HotelSearchBox = ({ currentFilters = {}, setFilters }) => { 
    // State is initialized using the values passed from the parent (currentFilters)
    const [searchQuery, setSearchQuery] = useState(currentFilters.query || '');
    const [startDate, setStartDate] = useState(currentFilters.startDate || '');
    const [endDate, setEndDate] = useState(currentFilters.endDate || '');
    const [sortBy, setSortBy] = useState(currentFilters.sort || 'rating_desc'); // Default to rating_desc for API

    // 🔑 MODIFICATION 2: This function now packages the local state and calls the parent handler
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevents full page reload
        
        // Map frontend sort keys to backend API parameters
        let apiSort = sortBy;
        switch (sortBy) {
            case 'rating':
                apiSort = 'rating_desc'; // Match your API controller logic
                break;
            case 'price-low':
                apiSort = 'price_asc';
                break;
            case 'price-high':
                apiSort = 'price_desc';
                break;
            default:
                apiSort = 'rating_desc';
        }

        // CRITICAL: Call the parent component's handler function
        setFilters({ 
            query: searchQuery, 
            sort: apiSort, 
            startDate, 
            endDate,
            page: 1 // Always reset to page 1 on a new search submission
        });
    };

    // 🔑 MODIFICATION 3: Wrap the entire filter section in a <form> and use onSubmit
    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                
                <form onSubmit={handleSearchSubmit}> 
                    {/* Search Input */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by hotel name or location..."
                                className="w-full pl-12 pr-4 py-4 text-lg font-medium text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            
                            {/* Date Filters */}
                            <div className="relative md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="Start Date"
                                        onFocus={(e) => e.target.type = 'date'}
                                        onBlur={(e) => e.target.type = 'text'}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 transition-all duration-300 cursor-pointer"
                                    />
                                </div>
                                <div className="relative">
                                    <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="End Date"
                                        onFocus={(e) => e.target.type = 'date'}
                                        onBlur={(e) => e.target.type = 'text'}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 transition-all duration-300 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="relative">
                                 <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                                >
                                    <option value="rating_desc">Sort by (Default: Rating)</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                            </div>

                            {/* Search Button */}
                            {/* The button type is 'submit' by default inside a form, triggering handleSearchSubmit */}
                            <button
                                type="submit" 
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Search Hotels
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default HotelSearchBox;