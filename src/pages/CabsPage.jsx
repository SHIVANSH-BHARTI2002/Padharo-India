import React, { useState, useMemo } from 'react';
import CabCard from '../components/cards/CabCard';
import CabSearchBox from '../components/search box/CabSearchBox';
import heroImage from '../assets/car2.jpg'; 
import swift from '../assets/swift.png';
import innova from '../assets/innova.png';
import honda_city from '../assets/honda_city.png';
import marazzo from '../assets/marazzo.png';

const allCabs = [
    {
        image: swift,
        name: 'Maruti Swift Dzire',
        driver: 'Ramesh Singh',
        rating: 4.8,
        seats: 4,
        price: 250,
        description: 'A comfortable and fuel-efficient sedan, perfect for city tours and short trips. Air-conditioned with a music system.',
        type: 'Sedan'
    },
    {
        image: innova,
        name: 'Toyota Innova Crysta',
        driver: 'Suresh Verma',
        rating: 4.9,
        seats: 7,
        price: 450,
        description: 'Spacious, comfortable, and reliable. Ideal for family vacations, airport transfers, and long-distance travel.',
        type: 'SUV'
    },
    {
        image:marazzo,
        name: 'Mahindra Marazzo',
        driver: 'Vikram Rathore',
        rating: 4.7,
        seats: 6,
        price: 400,
        description: 'A stylish and safe MPV with ample space for luggage. Perfect for group outings and exploring the countryside.',
        type: 'MPV'
    },
    {
        image: honda_city,
        name: 'Honda City',
        driver: 'Anil Kapoor',
        rating: 4.6,
        seats: 4,
        price: 300,
        description: 'A premium sedan experience with a smooth ride and modern features. Great for business travel.',
        type: 'Sedan'
    }
];

const CabsPage = () => {
    const [filters, setFilters] = useState({
        query: '',
        seats: '',
        type: '',
        sort: ''
    });

    const filteredCabs = useMemo(() => {
        let filtered = allCabs.filter(cab => {
            const queryMatch = filters.query.toLowerCase() === '' ||
                               cab.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                               cab.driver.toLowerCase().includes(filters.query.toLowerCase());
            const seatsMatch = filters.seats === '' || cab.seats >= parseInt(filters.seats);
            const typeMatch = filters.type === '' || cab.type === filters.type;
            return queryMatch && seatsMatch && typeMatch;
        });
        
        return filtered;
    }, [filters]);

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
                            Showing {filteredCabs.length} cabs matching your criteria
                        </p>
                    </div>
                </div>

                {filteredCabs.length > 0 ? (
                     <div className="space-y-8">
                        {filteredCabs.map((cab, index) => (
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