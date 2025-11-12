import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelSearchBox from '../components/search box/HotelSearchBox';
import HotelCard from '../components/cards/HotelCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import mumbaiHero from '../assets/mumbai-hero.jpg';
import hotelRoom from '../assets/hotel-room.jpg';
import { apiGetHotels } from '../apiService';
// Backend-driven hotel list

const HotelListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilters = {
        query: searchParams.get('query') || '',
        sort: searchParams.get('sort') || '',
        startDate: '',
        endDate: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sync filters -> URL and fetch from backend when query/sort changes
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiGetHotels({ query: filters.query, sort: filters.sort });
                if (!cancelled) setHotels(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to fetch hotels');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        // Update URL params
        const next = new URLSearchParams();
        if (filters.query) next.set('query', filters.query);
        if (filters.sort) next.set('sort', filters.sort);
        setSearchParams(next);
        run();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.query, filters.sort]);

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
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Stay
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Discover amazing hotels with the best prices and premium amenities.
                        </p>
                    </div>
                    <HotelSearchBox filters={filters} setFilters={setFilters} />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Hotels
                        </h2>
                        <p className="text-gray-600">
                            {loading ? 'Loading hotels...' : `Found ${hotels.length} hotels matching your criteria.`}
                        </p>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                    </div>
                </div>

                <div className="space-y-8">
                    {hotels.map((h, index) => {
                        const cardData = {
                            id: h.id,
                            image: h.image_url || hotelRoom,
                            // Prefer average rating from reviews; fallback to star rating
                            rating: (h.average_rating != null && h.average_rating !== undefined)
                                ? h.average_rating
                                : (h.star_rating || '—'),
                            name: h.name,
                            location: h.location,
                            description: h.description || '',
                            features: [],
                            // Show average room price if available
                            price: (h.avg_room_price != null && h.avg_room_price !== undefined)
                                ? Number(h.avg_room_price).toLocaleString('en-IN')
                                : '—'
                        };
                        return (
                            <div key={h.id ?? index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                <HotelCard {...cardData} />
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Load More Hotels
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HotelListPage;