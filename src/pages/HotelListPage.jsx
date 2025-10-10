import React, { useState, useEffect, useCallback } from 'react'; // 🔑 ADDED: useEffect, useCallback
import axios from 'axios';
import HotelSearchBox from '../components/search box/HotelSearchBox';
import HotelCard from '../components/cards/HotelCard';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // 🔑 ADDED: ArrowPathIcon for loading
import mumbaiHero from '../assets/mumbai-hero.jpg';
import hotelRoom from '../assets/hotel-room.jpg'; // Still used as a fallback if hotel_picture is missing

// 🔑 Define Base URL
const API_BASE_URL = 'http://localhost:5000'; // Use your development port

const HotelListPage = () => {
    // 🔑 NEW STATE: To hold API-fetched data and status
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalHotels: 0 });

    // 🔑 MODIFIED FILTERS: Added page, limit, and changed sort key for API use
    const [filters, setFilters] = useState({
        query: 'Mumbai', // Initial search query, maybe based on user location
        sort: 'rating_desc', // Default sort key matching your API logic
        page: 1,
        limit: 5, // Hotels per page
        // You can add city, minPrice, maxPrice here later
    });

    // 🔑 NEW: Function to fetch hotels from the backend
    const fetchHotels = useCallback(async (page = filters.page) => {
        setLoading(true);
        setError(null);

        // Map frontend sort keys to backend API query parameters
        let sortParam = '';
        switch (filters.sort) {
            case 'rating':
                sortParam = 'rating_desc';
                break;
            case 'priceLowHigh':
                sortParam = 'price_asc';
                break;
            case 'priceHighLow':
                sortParam = 'price_desc';
                break;
            default:
                sortParam = 'rating_desc';
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/hotels`, {
                params: {
                    city: filters.query, // Assuming query maps to city/location search
                    sort: sortParam,
                    page: page,
                    limit: filters.limit,
                    // minPrice/maxPrice filters can be added here
                }
            });
            
            setHotels(res.data.hotels);
            setPagination({
                currentPage: res.data.currentPage,
                totalPages: res.data.totalPages,
                totalHotels: res.data.totalHotels,
            });
        } catch (err) {
            console.error('Failed to fetch hotels:', err);
            setError('Could not load hotel listings.');
        } finally {
            setLoading(false);
        }
    }, [filters]); // Dependencies: only re-create if filters state changes

    // 🔑 LIFECYCLE HOOK: Fetch data when the component mounts or filters change
    useEffect(() => {
        // Always reset to page 1 when query/sort changes
        if (filters.page === 1) {
            fetchHotels(1);
        }
    }, [filters.query, filters.sort, fetchHotels]);
    
    // 🔑 HANDLER for 'Load More' button
    const handleLoadMore = () => {
        const nextPage = pagination.currentPage + 1;
        setFilters(prev => ({ ...prev, page: nextPage }));
        // Fetch data for the next page, then concatenate with existing hotels
        // This is a common pattern for infinite scrolling/load more
        fetchHotels(nextPage).then(newHotels => {
            if (newHotels && newHotels.length > 0) {
                setHotels(prevHotels => [...prevHotels, ...newHotels]);
            }
        });
    };

    // 🔑 HANDLER for filter change (e.g., from HotelSearchBox)
    const handleFilterChange = (newFilters) => {
        // Reset to page 1 whenever search/sort parameters change
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    // --- Component JSX (Styling remains the same) ---
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header
                className="relative h-200 bg-cover bg-center bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${mumbaiHero})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Find Your Perfect Stay
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Discover amazing hotels with the best prices and premium amenities.
                        </p>
                    </div>
                    {/* Pass the new handler to the search box */}
                    <HotelSearchBox filters={filters} setFilters={handleFilterChange} />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Hotels
                        </h2>
                        {/* Display real count from API */}
                        <p className="text-gray-600">
                            {loading ? 'Searching...' : `Found ${pagination.totalHotels} hotels in ${filters.query || 'India'}.`}
                        </p>
                    </div>
                    {/* Add Filter/Sort Dropdown logic here */}
                    {/* ... */}
                </div>

                {/* Loading/Error State */}
                {loading && (
                    <div className="text-center py-10 text-amber-600 flex justify-center items-center">
                        <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" />
                        Loading listings...
                    </div>
                )}
                {error && <div className="text-center py-10 text-red-600 font-semibold">{error}</div>}

                {/* Hotel List */}
                {!loading && hotels.length > 0 && (
                    <div className="space-y-8">
                        {hotels.map((hotel, index) => (
                            <div key={hotel.hotel_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                {/* Note: The data structure from the API is different from dummy data */}
                                <HotelCard 
                                    hotel_id={hotel.hotel_id}
                                    image={hotel.hotel_picture || hotelRoom} // Use API image or fallback
                                    rating={hotel.rating}
                                    name={hotel.name}
                                    location={`${hotel.address}, ${hotel.city}`}
                                    description={hotel.description} // Assuming you add a description field later
                                    // Features might need mapping from the JSON array amenities
                                    price={hotel.min_price} // Use min_price from API
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Load More Button */}
                {pagination.currentPage < pagination.totalPages && !loading && (
                    <div className="text-center mt-12">
                        <button 
                            onClick={() => handleLoadMore()}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Load More Hotels ({pagination.currentPage} / {pagination.totalPages})
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HotelListPage;