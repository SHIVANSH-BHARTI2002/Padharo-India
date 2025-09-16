import React from 'react';
import { StarIcon, UserIcon, CurrencyRupeeIcon, UsersIcon, TruckIcon } from '@heroicons/react/24/solid';

const CabCard = ({ cab }) => {
    const { image, name, driver, rating, seats, price, description, type } = cab;

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-500 w-full flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-gray-800">{rating}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    {/* Header */}
                    <div className="mb-3">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                            {name}
                        </h2>
                        <div className="flex items-center text-gray-600 text-sm">
                            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Driver: <span className="font-semibold">{driver}</span></span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {description}
                    </p>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-b border-gray-100 py-3 mb-6">
                        <div className='flex items-center text-sm text-gray-700'>
                            <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span className="font-bold">{seats}</span> Seater
                        </div>
                         <div className='flex items-center text-sm text-gray-700'>
                            <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span className="font-bold">{type}</span>
                        </div>
                        <div className='flex items-center text-sm text-gray-700'>
                            <CurrencyRupeeIcon className="h-5 w-5 mr-1 text-green-500" />
                            <div>
                                <span className="font-bold">{price}</span>
                                <span className="text-gray-500"> / hour</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center space-x-4">
                    <button className="flex-1 px-6 py-3 border-2 border-amber-500 text-amber-500 rounded-xl font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 text-center">
                        More Details
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CabCard;