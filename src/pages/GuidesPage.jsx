import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GuideSearchBox from '../components/search box/GuideSearchBox';
import GuideCard from '../components/cards/GuideProfileCard';
import { apiGetGuides } from '../apiService';

import heroImage from '../assets/map.jpg';
import man from '../assets/man.png';

const GuidesPage = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilters = {
        query: searchParams.get('query') || '',
        language: searchParams.get('language') || '',
        specialty: searchParams.get('specialty') || ''
    };
    const [filters, setFilters] = useState(initialFilters);

    const fetchGuides = async (activeFilters = {}) => {
        try {
            setLoading(true);
            setError('');
            const data = await apiGetGuides(activeFilters);
            const mapped = (data || []).map(g => ({
                id: g.id,
                name: `${g.guideFirstName || ''} ${g.guideLastName || ''}`.trim() || 'Unknown Guide',
                image: g.image_url || man,
                location: g.location || 'Unknown',
                rating: g.averageRating || 4.7,
                description: g.description_short || '',
                languages: g.languages || [],
                specialties: g.specialties || [],
                pricePerHour: g.price_per_hour || 0,
                experience: g.experience_years || 0,
                toursCompleted: g.tours_completed || 0,
            }));
            setGuides(mapped);
        } catch (e) {
            setError(e.message || 'Failed to load guides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Sync filters -> URL and fetch
        const nextParams = new URLSearchParams();
        if (filters.query) nextParams.set('query', filters.query);
        if (filters.language) nextParams.set('language', filters.language);
        if (filters.specialty) nextParams.set('specialty', filters.specialty);
        setSearchParams(nextParams);
        fetchGuides(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.query, filters.language, filters.specialty]);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header
                className="relative h-200 bg-cover bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Local Guide
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Discover India's wonders with our expert, friendly local guides.
                        </p>
                    </div>
                    <GuideSearchBox
                        onSearch={handleSearch}
                        initialQuery={filters.query}
                        initialLanguage={filters.language}
                        initialSpecialty={filters.specialty}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Guides
                        </h2>
                        {loading ? (
                            <p className="text-gray-600">Loading guides...</p>
                        ) : (
                            <p className="text-gray-600">Showing {guides.length} guides matching your criteria</p>
                        )}
                    </div>
                </div>

                {/* Guides List */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    {guides.length > 0 ? (
                        guides.map((guide, index) => (
                            <div
                                key={guide.id || index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <GuideCard guide={guide} />
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-semibold text-gray-700">No Guides Found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
                            </div>
                        )
                    )}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => fetchGuides(filters)}>
                        Refresh Guides
                    </button>
                </div>
            </main>
        </div>
    );
};

export default GuidesPage;