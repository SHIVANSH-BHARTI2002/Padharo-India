import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, MoonIcon, UserIcon, CurrencyRupeeIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const TourPackageCard = ({ pkg }) => {
    const { image, name, places, nights, description, included, price } = pkg;
    const packageId = name.replace(/\s+/g, '-');

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-all duration-500 w-full">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
                    <div className="flex items-center text-gray-200 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{places.join(' • ')}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Details Bar */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center text-gray-700">
                        <MoonIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        <span className="font-bold">{nights}</span>&nbsp;Nights
                    </div>
                    <div className="flex items-center text-gray-700">
                        <CurrencyRupeeIcon className="h-5 w-5 mr-1 text-green-500" />
                        <div>
                            <span className="font-bold">{price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500"> / person</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {description}
                </p>

                {/* Inclusions */}
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">What's Included</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {included.map((item, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center space-x-4">
                    <Link to={`/packages/${packageId}`} className="flex-1">
                        <button className="w-full px-6 py-3 border-2 border-amber-500 text-amber-500 rounded-xl font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 text-center">
                            View Details
                        </button>
                    </Link>
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourPackageCard;