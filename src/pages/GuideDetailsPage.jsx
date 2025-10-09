import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, MapPinIcon, ShieldCheckIcon, UsersIcon, CalendarDaysIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

// Placeholder data - in a real app, you'd fetch this based on the guideId
const allGuides = {
    '1': {
        id: 1,
        name: 'Rajesh Kumar',
        coverImage: '/src/assets/cta-background.jpg',
        profileImage: '/src/assets/man.png',
        location: 'Jaipur, Rajasthan',
        rating: 4.9,
        reviews: 124,
        description: 'Passionate storyteller with deep expertise in Rajasthani culture. I bring ancient palaces to life with engaging narratives. Join me to explore the vibrant markets, taste authentic cuisine, and uncover the hidden gems of the Pink City.',
        places: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'],
        languages: ['Hindi', 'English', 'German'],
        specialties: ['History', 'Culture', 'Cuisine'],
        tourTypes: ['Individual', 'Group'],
        pricePerTrip: 500,
        availability: ['2024-10-26', '2024-10-27', '2024-11-02', '2024-11-03'],
        gallery: [
            '/src/assets/hawa-mahal.jpg',
            '/src/assets/fort.jpg',
            '/src/assets/tajmahal.jpg',
            '/src/assets/golden-temple.jpg',
        ],
        testimonials: [
            { name: 'John Doe', rating: 5, comment: 'Rajesh was an amazing guide! So knowledgeable and friendly.' },
            { name: 'Jane Smith', rating: 5, comment: 'Highly recommend this tour. We saw so much and learned a lot.' },
        ]
    },
    // Add other guides here...
};

const GuideDetailsPage = () => {
    const { guideId } = useParams();
    const guide = allGuides[guideId];
    
    const [bookingType, setBookingType] = useState('Individual');
    const [groupOption, setGroupOption] = useState('Create');
    const [groupSize, setGroupSize] = useState(2);

    const handleGroupSizeChange = (amount) => {
        setGroupSize(prev => Math.max(2, prev + amount));
    };

    const finalPrice = bookingType === 'Group' && groupOption === 'Create' 
        ? guide.pricePerTrip * groupSize 
        : guide.pricePerTrip;

    if (!guide) {
        return <div className="text-center py-20">Guide not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Cover Image */}
            <header className="relative h-96">
                <img src={guide.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 flex items-end space-x-6">
                    <div className="relative">
                        <img
                            src={guide.profileImage}
                            alt={guide.name}
                            className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                         <ShieldCheckIcon className="absolute bottom-2 right-2 h-8 w-8 text-green-500 bg-white rounded-full p-1" title="Verified Guide"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">{guide.name}</h1>
                        <div className="flex items-center text-gray-200 mt-2">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span>{guide.location}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* About Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {guide.name}</h2>
                        <p className="text-gray-600 leading-relaxed">{guide.description}</p>
                    </section>

                    {/* Details Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.languages.map(lang => <span key={lang} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{lang}</span>)}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.specialties.map(spec => <span key={spec} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{spec}</span>)}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-3">Places Covered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.places.map(place => <span key={place} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{place}</span>)}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-3">Tour Types</h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.tourTypes.map(type => <span key={type} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">{type}</span>)}
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Gallery Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {guide.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300" />
                            ))}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                        <div className="flex items-center mb-6">
                            <StarIcon className="h-8 w-8 text-yellow-400 mr-2" />
                            <span className="text-3xl font-bold">{guide.rating}</span>
                            <span className="text-gray-500 ml-2">({guide.reviews} reviews)</span>
                        </div>
                        <div className="space-y-6">
                            {guide.testimonials.map((testimonial, index) => (
                                <div key={index} className="border-t pt-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-yellow-400" />)}
                                        </div>
                                        <p className="ml-4 font-semibold">{testimonial.name}</p>
                                    </div>
                                    <p className="text-gray-600">"{testimonial.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Booking Column */}
                <aside className="lg:sticky top-24 h-fit">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book This Guide</h2>
                        
                        <div className="space-y-4">
                            {/* Tour Type */}
                            <div>
                                <label className="font-semibold text-gray-700">Tour Type</label>
                                <div className="flex items-center mt-2 space-x-4">
                                    <button 
                                        onClick={() => setBookingType('Individual')}
                                        className={`flex-1 py-2 border rounded-lg transition flex items-center justify-center space-x-2 ${bookingType === 'Individual' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <UsersIcon className="h-5 w-5"/>
                                        <span>Individual</span>
                                    </button>
                                     <button 
                                        onClick={() => setBookingType('Group')}
                                        className={`flex-1 py-2 border rounded-lg transition flex items-center justify-center space-x-2 ${bookingType === 'Group' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <UsersIcon className="h-5 w-5"/>
                                        <span>Group</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Group Options */}
                            {bookingType === 'Group' && (
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-center space-x-2 mb-4">
                                        <button onClick={() => setGroupOption('Create')} className={`px-4 py-1 text-sm rounded-full ${groupOption === 'Create' ? 'bg-amber-500 text-white' : 'bg-white'}`}>Create Group</button>
                                        <button onClick={() => setGroupOption('Join')} className={`px-4 py-1 text-sm rounded-full ${groupOption === 'Join' ? 'bg-amber-500 text-white' : 'bg-white'}`}>Join Group</button>
                                    </div>

                                    {groupOption === 'Create' && (
                                        <div>
                                            <label className="font-semibold text-gray-700 text-sm">Number of People</label>
                                            <div className="flex items-center justify-between mt-1">
                                                <button onClick={() => handleGroupSizeChange(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4"/></button>
                                                <span className="text-lg font-bold">{groupSize}</span>
                                                <button onClick={() => handleGroupSizeChange(1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4"/></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Date Picker */}
                            <div>
                                <label className="font-semibold text-gray-700">Select Date</label>
                                 <div className="relative mt-2">
                                     <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="date" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-300"/>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Green dates are available.</p>
                            </div>
                            
                             {/* Rate */}
                            <div className="text-center border-t pt-4">
                                <p className="text-sm text-gray-500">
                                    {bookingType === 'Group' && groupOption === 'Create' ? 'Final Price' : 'Starting From'}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{finalPrice.toLocaleString()} <span className="text-lg font-normal text-gray-600">/ trip</span>
                                </p>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Book Now
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default GuideDetailsPage;