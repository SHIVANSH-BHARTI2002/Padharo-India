import React from 'react';
import GuideSearchBox from '../components/GuideSearchBox';
import GuideCard from '../components/GuideProfileCard';

import heroImage from '../assets/map.jpg';

const GuidesPage = () => {
    const guides = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            location: 'Jaipur, Rajasthan',
            rating: 4.9,
            description: 'Passionate storyteller with deep expertise in Rajasthani culture. I bring ancient palaces to life with engaging narratives.',
            languages: ['Hindi', 'English', 'German'],
            specialties: ['History', 'Culture', 'Cuisine'],
            pricePerHour: 350,
            experience: 8,
            toursCompleted: 340,
        },
        {
            id: 2,
            name: 'Priya Sharma',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
            location: 'Agra, Uttar Pradesh',
            rating: 4.8,
            description: 'An avid photographer and history enthusiast, offering unique tours of Agra\'s iconic landmarks. Let\'s capture the beauty of the Taj Mahal!',
            languages: ['Hindi', 'English', 'Spanish'],
            specialties: ['Photography', 'Mughal History'],
            pricePerHour: 400,
            experience: 6,
            toursCompleted: 250,
        },
        {
            id: 3,
            name: 'Amit Patel',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
            location: 'Varanasi, Uttar Pradesh',
            rating: 4.9,
            description: 'Born and raised in Varanasi, I provide immersive spiritual experiences. Discover the ancient traditions and rituals of this holy city.',
            languages: ['Hindi', 'English', 'Japanese'],
            specialties: ['Spiritual', 'Boating', 'Ghats'],
            pricePerHour: 300,
            experience: 10,
            toursCompleted: 420,
        }
    ];

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
                    <GuideSearchBox />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Guides
                        </h2>
                        <p className="text-gray-600">
                            Showing {guides.length} guides matching your criteria
                        </p>
                    </div>
                </div>

                {/* Guides List */}
                <div className="space-y-8">
                    {guides.map((guide, index) => (
                        <div
                            key={index}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <GuideCard guide={guide} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Load More Guides
                    </button>
                </div>
            </main>
        </div>
    );
};

export default GuidesPage;