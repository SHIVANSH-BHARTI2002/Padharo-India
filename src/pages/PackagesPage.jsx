import React, { useState, useMemo } from 'react';
import TourPackageCard from '../components/cards/TourPackageCard';
import PackageSearchBox from '../components/search box/PackageSearchBox';
import heroImg from '../assets/hawa-mahal.jpg';
import keralaImg from '../assets/istockphoto-1347088244-612x612.jpg';
import goldenTempleImg from '../assets/golden-temple.jpg';
import laddakImg from '../assets/laddak.jpg';


const allPackages = [
    {
        image: goldenTempleImg,
        name: 'Golden Triangle Delight',
        places: ['Delhi', 'Agra', 'Jaipur'],
        nights: 6,
        rating: 4.7,
        description: 'Experience the classic Golden Triangle. Witness the splendor of the Taj Mahal, explore the historic forts of Jaipur, and delve into the bustling capital city of Delhi.',
        included: ['Hotels', 'All Transfers', 'Sightseeing', 'Breakfast'],
        price: 25000,
    },
    {
        image: keralaImg,
        name: 'Kerala Backwater Escape',
        places: ['Cochin', 'Munnar', 'Alleppey'],
        nights: 7,
        rating: 4.9,
        description: 'Float through the serene backwaters of Alleppey on a traditional houseboat, explore lush tea plantations in Munnar, and soak in the colonial charm of Cochin.',
        included: ['Houseboat Stay', 'All Transfers', 'Tea Plantation Visit', 'All Meals'],
        price: 35000,
    },
    {
        image: laddakImg,
        name: 'Majestic Ladakh Adventure',
        places: ['Leh', 'Nubra Valley', 'Pangong Lake'],
        nights: 8,
        rating: 4.8,
        description: 'Embark on a high-altitude adventure to the "Land of High Passes." Marvel at the stunning blue waters of Pangong Lake and ride a camel in the Nubra Valley desert.',
        included: ['Hotels & Camps', 'Inner Line Permits', 'Oxygen Cylinder', 'Breakfast & Dinner'],
        price: 45000,
    }
];

const PackagesPage = () => {
    const [filters, setFilters] = useState({
        query: '',
        price: '',
        rating: '',
        nights: ''
    });

    const filteredPackages = useMemo(() => {
        return allPackages.filter(pkg => {
            const queryMatch = filters.query === '' || 
                               pkg.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                               pkg.places.some(place => place.toLowerCase().includes(filters.query.toLowerCase()));
            
            const priceMatch = filters.price === '' || pkg.price <= parseInt(filters.price);
            
            const ratingMatch = filters.rating === '' || pkg.rating >= parseFloat(filters.rating);

            const nightsMatch = filters.nights === '' || 
                               (filters.nights === '10' ? pkg.nights >= 10 : pkg.nights <= parseInt(filters.nights));

            return queryMatch && priceMatch && ratingMatch && nightsMatch;
        });
    }, [filters]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header
                className="relative h-200 bg-cover bg-center bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Unforgettable
                            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Tour Packages
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Discover curated travel packages that offer the best of India's culture, adventure, and beauty.
                        </p>
                    </div>
                    <PackageSearchBox filters={filters} setFilters={setFilters} />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Our Most Popular Tours
                    </h2>
                    <p className="text-lg text-gray-600">
                        Found {filteredPackages.length} packages matching your criteria.
                    </p>
                </div>

                {filteredPackages.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg, index) => (
                            <div
                                key={index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <TourPackageCard pkg={pkg} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-gray-700">No Packages Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search filters to find the perfect journey.</p>
                    </div>
                )}

                <div className="text-center mt-16">
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View All Packages
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PackagesPage;