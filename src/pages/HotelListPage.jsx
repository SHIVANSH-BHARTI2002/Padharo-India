import React, { useState, useMemo } from 'react';
import HotelSearchBox from '../components/search box/HotelSearchBox';
import HotelCard from '../components/cards/HotelCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import mumbaiHero from '../assets/mumbai-hero.jpg';
import hotelRoom from '../assets/hotel-room.jpg';

const allHotels = [
    {
        image: hotelRoom,
        rating: '4.6',
        name: 'HOTEL MUMBAI VALNAI',
        location: 'Malad, Mumbai',
        description: 'Spacious rooms with AC available, outdoor swimming pool, garden, and restaurant. Experience luxury and comfort in the heart of Mumbai.',
        features: ['Free Cancellation', 'Breakfast Available', 'Book on arrival available', 'Free WiFi', '1, 2, and 3 bedroom options'],
        price: 5330
    },
    {
        image: hotelRoom,
        rating: '4.3',
        name: 'ROYAL COMFORT SUITES',
        location: 'Bandra, Mumbai',
        description: 'Modern amenities with traditional hospitality. Perfect for business travelers and families alike.',
        features: ['Free Cancellation', 'Breakfast Available', 'Business Center', 'Free WiFi', 'Gym Access'],
        price: 4800
    },
    {
        image: hotelRoom,
        rating: '4.8',
        name: 'LUXURY PALACE HOTEL',
        location: 'Juhu, Mumbai',
        description: 'Premium beachside location with world-class amenities and stunning ocean views.',
        features: ['Free Cancellation', 'Breakfast Available', 'Beach Access', 'Free WiFi', 'Spa Services', 'Multiple dining options'],
        price: 6200
    },
    {
        image: hotelRoom,
        rating: '4.5',
        name: 'BUSINESS CENTRAL HOTEL',
        location: 'Andheri, Mumbai',
        description: 'Perfect for business travelers with modern facilities and excellent connectivity.',
        features: ['Free Cancellation', 'Breakfast Available', 'Airport Shuttle', 'Free WiFi', 'Conference Rooms'],
        price: 3900
    }
];

const HotelListPage = () => {
    const [filters, setFilters] = useState({
        query: '',
        sort: '',
        startDate: '',
        endDate: ''
    });

    const filteredAndSortedHotels = useMemo(() => {
        let filtered = allHotels.filter(hotel => {
            return hotel.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                   hotel.location.toLowerCase().includes(filters.query.toLowerCase());
        });

        switch (filters.sort) {
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'priceLowHigh':
                return filtered.sort((a, b) => a.price - b.price);
            case 'priceHighLow':
                return filtered.sort((a, b) => b.price - a.price);
            default:
                return filtered;
        }
    }, [filters]);

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
                            Found {filteredAndSortedHotels.length} hotels matching your criteria.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {filteredAndSortedHotels.map((hotel, index) => (
                        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                            <HotelCard {...hotel} price={hotel.price.toLocaleString()} />
                        </div>
                    ))}
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