import React from 'react';
import SearchBox from '../components/search box/SearchBox';
import PlaceCard from '../components/cards/PlaceCard';
import Feature from '../components/Feature';
import Destinations from '../components/Destinations';

// Import images
import heroBackground from '../assets/hero-background.jpg';
import ctaBackground from '../assets/cta-background.jpg';
import fort from '../assets/fort.jpg';
import tajMahal from '../assets/tajmahal.jpg';

const Home = () => {
    const places = [
        { 
            image: tajMahal, 
            rating: '4.6', 
            title: 'Taj Mahal', 
            location: 'Agra, Uttar Pradesh', 
            description: 'A breathtaking white marble mausoleum, a symbol of eternal love and architectural perfection.', 
            price: '2000' 
        },
        { 
            image: fort, 
            rating: '4.5', 
            title: 'Amber Fort', 
            location: 'Jaipur, Rajasthan', 
            description: 'A majestic fort with artistic Hindu style elements and stunning architecture.', 
            price: '1500' 
        },
        { 
            image: tajMahal, 
            rating: '4.8', 
            title: 'Golden Temple', 
            location: 'Amritsar, Punjab', 
            description: 'The holiest Gurdwara and a symbol of human brotherhood and peace.', 
            price: '1800' 
        },
        { 
            image: tajMahal, 
            rating: '4.7', 
            title: 'India Gate', 
            location: 'New Delhi, Delhi', 
            description: 'A war memorial dedicated to the soldiers of British India.', 
            price: '1200' 
        },
        { 
            image: tajMahal, 
            rating: '4.4', 
            title: 'Mysore Palace', 
            location: 'Mysore, Karnataka', 
            description: 'A historical palace and the royal residence at Mysore.', 
            price: '1600' 
        },
        { 
            image: tajMahal, 
            rating: '4.9', 
            title: 'Gateway of India', 
            location: 'Mumbai, Maharashtra', 
            description: 'An arch-monument built in the early 20th century.', 
            price: '2200' 
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header 
                className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBackground})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up">
                            Mysteries of
                            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent block">
                                India
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up animation-delay-300">
                            Discover the incredible beauty and rich heritage of India
                        </p>
                    </div>
                    
                    <div className="animate-fade-in-up animation-delay-600">
                        <SearchBox />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-16 lg:py-24 space-y-24">
                {/* Popular Destinations Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Explore the 
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                {' '}Beautiful
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover India's most iconic destinations and immerse yourself in their timeless beauty
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
                        {places.slice(0, 3).map((place, index) => (
                            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                                <PlaceCard {...place} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feature Section */}
                <section>
                    <Feature />
                </section>

                {/* Destinations Component */}
                <section>
                    <Destinations />
                </section>

                {/* Lesser-known Wonders Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Lesser-known
                            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                {' '}Wonders
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Uncover hidden gems and secret treasures waiting to be explored
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
                        {places.slice(3, 6).map((place, index) => (
                            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                                <PlaceCard {...place} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section 
                    className="relative py-32 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url(${ctaBackground})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/10"></div>
                    
                    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                        <div className="mb-6">
                            <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold tracking-wider uppercase mb-4">
                                Himalayan Treks
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Conquer the 
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Frozen Trails
                            </span>
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-white">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">529+</div>
                                <div className="text-gray-300">People Already Booked</div>
                            </div>
                            <div className="hidden sm:block w-px h-12 bg-white/30"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">-20°C to 10°C</div>
                                <div className="text-gray-300">Temperature Range</div>
                            </div>
                        </div>
                        
                        <button className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl">
                            Book Your Adventure
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;