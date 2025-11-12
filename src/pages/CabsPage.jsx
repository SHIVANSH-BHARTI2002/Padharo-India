import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CabCard from '../components/cards/CabCard';
import CabSearchBox from '../components/search box/CabSearchBox';
import heroImage from '../assets/car2.jpg';
import { apiGetCabs } from '../apiService';

const CabsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilters = {
        query: searchParams.get('query') || '',
        seats: searchParams.get('seats') || '',
        type: searchParams.get('type') || '',
        sort: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiGetCabs({
                    query: filters.query,
                    seats: filters.seats ? Number(filters.seats) : undefined,
                    type: filters.type || undefined,
                });
                const mapped = (Array.isArray(data) ? data : []).map((d) => ({
                    image: d.image_url || '',
                    name: d.model || 'Cab',
                    driver: [d.driverFirstName, d.driverLastName].filter(Boolean).join(' '),
                    rating: undefined,
                    seats: d.seats,
                    price: d.base_rate_hour,
                    description: '',
                    type: d.type,
                }));
                if (!cancelled) setCabs(mapped);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to fetch cabs');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        const next = new URLSearchParams();
        if (filters.query) next.set('query', filters.query);
        if (filters.seats) next.set('seats', String(filters.seats));
        if (filters.type) next.set('type', filters.type);
        setSearchParams(next);
        run();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.query, filters.seats, filters.type]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header
                className="relative h-200 bg-cover bg-center bg-no-repeat flex items-center justify-center" // Added bg-center here
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Ride
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Comfortable and reliable cab services for any destination in India.
                        </p>
                    </div>
                    <CabSearchBox filters={filters} setFilters={setFilters} />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Cabs
                        </h2>
                        <p className="text-gray-600">
                            {loading ? 'Loading cabs...' : `Showing ${cabs.length} cabs matching your criteria`}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 mb-6">{error}</div>
                )}

                {cabs.length > 0 ? (
                    <div className="space-y-8">
                        {cabs.map((cab, index) => (
                            <div
                                key={index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <CabCard cab={cab} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-gray-700">No Cabs Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search filters to find the perfect ride.</p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Load More Cabs
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CabsPage;