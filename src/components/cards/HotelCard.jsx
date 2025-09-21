import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    StarIcon,
    MapPinIcon,
    HeartIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const HotelCard = ({ image, rating, name, location, description, features, price }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const displayFeatures = showAllFeatures ? features : features.slice(0, 3);

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-500">
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative lg:w-80 h-64 lg:h-auto overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                        >
                            {isFavorite ? (
                                <HeartIconSolid className="h-5 w-5 text-red-500" />
                            ) : (
                                <HeartIcon className="h-5 w-5 text-white" />
                            )}
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300">
                            <ShareIcon className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-800">{rating}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-500 transition-colors duration-300">
                                {name}
                            </h2>
                            <div className="flex items-center text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-1 text-amber-500" />
                                <span className="font-medium">{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-2">
                        {description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {displayFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {features.length > 3 && (
                            <button
                                onClick={() => setShowAllFeatures(!showAllFeatures)}
                                className="mt-3 text-amber-500 hover:text-amber-500 font-medium text-sm transition-colors duration-300"
                            >
                                {showAllFeatures ? 'Show Less' : `+${features.length - 3} More`}
                            </button>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0">
                        {/* Price */}
                        <div className="text-left">
                            <div className="text-sm text-gray-500 mb-1">Starting from</div>
                            <div className="flex items-center">
                                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                                <span className="text-3xl font-bold text-gray-900">{price}</span>
                                <span className="text-gray-500 ml-2">/ night</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">+ taxes & fees</div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <Link to={`/hotels/${name}`}>
                                <button className="px-6 py-2 border-2 border-amber-500 text-amber-500 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300">
                                    View Details
                                </button>
                            </Link>
                            <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-600 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );
};

export default HotelCard;