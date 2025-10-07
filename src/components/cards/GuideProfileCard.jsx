import React, { useState } from 'react';
import {
    StarIcon,
    MapPinIcon,
    HeartIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    ShareIcon,
    ChatBubbleLeftRightIcon,
    BriefcaseIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const GuideCard = ({ guide }) => {
    const { image, rating, name, location, description, languages, specialties, pricePerHour, experience, toursCompleted } = guide;
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-500">
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative lg:w-80 h-64 lg:h-auto overflow-hidden">
                    <img
                        src={image}
                        alt={name}
<<<<<<< HEAD
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
=======
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        // className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700"
                    
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {/* <button
>>>>>>> origin/main
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
<<<<<<< HEAD
                        </button>
=======
                        </button> */}
>>>>>>> origin/main
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-800">{rating}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                                {name}
                            </h2>
                            <div className="flex items-center text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-1 text-amber-500" />
                                <span className="font-medium">{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 border-t border-b border-gray-100 py-3 mb-4">
                        <div className='flex items-center text-sm text-gray-700'>
                            <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400"/>
                            <div>
                                <span className="font-bold">{experience}</span> Years
                                <span className="hidden sm:inline"> of Experience</span>
                            </div>
                        </div>
                         <div className='flex items-center text-sm text-gray-700'>
                            <FlagIcon className="h-5 w-5 mr-2 text-gray-400"/>
                            <div>
                                <span className="font-bold">{toursCompleted}+</span> Tours
                                <span className="hidden sm:inline"> Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Languages & Specialties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-blue-500"/>
                                Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">{lang}</span>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500"/>
                                Specialties
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {specialties.map((spec, index) => (
                                    <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">{spec}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0 pt-4 border-t border-gray-100">
                        <div className="text-left">
                            <div className="text-sm text-gray-500 mb-1">Starting from</div>
                            <div className="flex items-center">
                                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                                <span className="text-3xl font-bold text-gray-900">{pricePerHour}</span>
                                <span className="text-gray-500 ml-2">/ hour</span>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="px-6 py-2 border-2 border-amber-500 text-amber-500 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300">
                                View Profile
                            </button>
                            <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideCard;