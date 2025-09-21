import React from 'react';
import { StarIcon, MapPinIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

const PlaceCard = ({ image, rating, title, location, description, price }) => {
    return (
        <div className="group relative w-full max-w-sm mx-auto">
            {/* Card Container */}
            <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-800">{rating}</span>
                    </div>
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group/heart">
                        <HeartIcon className="h-5 w-5 text-white group-hover/heart:text-red-500 transition-colors duration-300" />
                    </button>
                    
                    {/* Hover Overlay Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-white/20 backdrop-blur-md text-white border-2 border-white/50 px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            Explore Now
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    {/* Title and Location */}
                    <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                            {title}
                        </h3>
                        <div className="flex items-center text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1 text-amber-500" />
                            <span className="text-sm font-medium">{location}</span>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CurrencyRupeeIcon className="h-5 w-5 text-amber-600" />
                            <span className="text-2xl font-bold text-gray-900">{price}</span>
                            <span className="text-sm text-gray-500 ml-1">/ person</span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                            Book
                        </button>
                    </div>
                </div>
                
                {/* Bottom Gradient Line */}
                <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
        </div>
    );
};

export default PlaceCard;