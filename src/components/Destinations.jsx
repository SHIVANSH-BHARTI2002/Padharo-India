import React from 'react';
import { StarIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import tajMahalImg from '../assets/tajmahal.jpg';
import hawaMahalImg from '../assets/hawa-mahal.jpg';
import goldenTempleImg from '../assets/golden-temple.jpg';

const DestinationCard = ({ image, rating, title, location, index }) => (
    <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-80 lg:h-96 overflow-hidden">
            <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Rating Badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-bold text-gray-800">{rating}</span>
            </div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {title}
                </h3>
                <div className="flex items-center text-gray-200 mb-4">
                    <MapPinIcon className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="font-medium">{location}</span>
                </div>
                
                {/* Hidden content that appears on hover */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        Discover the magnificent beauty and rich cultural heritage of this iconic destination.
                    </p>
                    
                    <button className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                        Explore
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
    </div>
);

const Destinations = () => {
    const destinations = [
        {
            image: tajMahalImg,
            rating: "4.8",
            title: "The Taj Mahal",
            location: "AGRA, INDIA"
        },
        {
            image: hawaMahalImg,
            rating: "4.7",
            title: "Hawa Mahal",
            location: "JAIPUR, INDIA"
        },
        {
            image: goldenTempleImg,
            rating: "4.9",
            title: "The Golden Temple",
            location: "AMRITSAR, INDIA"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text text-lg font-semibold tracking-wider uppercase">
                            Top Destinations
                        </span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Explore the 
                        <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            {' '}Beautiful
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Immerse yourself in India's most iconic destinations, where every corner tells a story of magnificent heritage and timeless beauty
                    </p>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {destinations.map((destination, index) => (
                        <div 
                            key={index}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            <DestinationCard {...destination} index={index} />
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <button className="bg-gradient-to-r from-gray-800 to-black text-white px-12 py-4 rounded-full font-bold text-lg hover:from-gray-700 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                        Discover More Destinations
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Destinations;