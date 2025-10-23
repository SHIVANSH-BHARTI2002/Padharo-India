import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, MapPinIcon, CalendarDaysIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// Placeholder data - in a real app, you'd fetch this based on the packageId
const allPackagesData = {
    'Golden-Triangle-Delight': {
        id: 'Golden-Triangle-Delight',
        name: 'Golden Triangle Delight',
        coverImage: '/src/assets/golden-temple.jpg',
        gallery: [
            '/src/assets/hawa-mahal.jpg',
            '/src/assets/fort.jpg',
            '/src/assets/india-gate.jpg',
        ],
        rating: 4.7,
        reviews: 215,
        description: 'Experience the classic Golden Triangle. Witness the splendor of the Taj Mahal, explore the historic forts of Jaipur, and delve into the bustling capital city of Delhi. This package offers a deep dive into the rich history and vibrant culture of India.',
        places: ['Delhi', 'Agra', 'Jaipur'],
        pricePerPerson: 25000,
        itinerary: [
            { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi, check into your hotel, and enjoy a day of leisure or optional sightseeing.' },
            { day: 2, title: 'Delhi Sightseeing', description: 'Explore iconic landmarks like India Gate, Humayun\'s Tomb, and Qutub Minar.' },
            { day: 3, title: 'Drive to Agra', description: 'Travel to Agra and witness the breathtaking sunset view of the Taj Mahal.' },
            { day: 4, title: 'Agra to Jaipur', description: 'Visit the Taj Mahal at sunrise, explore Agra Fort, and then drive to Jaipur, the Pink City.' },
            { day: 5, title: 'Jaipur Exploration', description: 'Discover the Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar.' },
            { day: 6, title: 'Departure', description: 'Enjoy a final breakfast before departing from Jaipur.' },
        ],
        testimonials: [
            { name: 'Emily Watson', rating: 5, comment: 'An absolutely unforgettable trip! The Golden Triangle is a must-see.' },
            { name: 'Michael Chen', rating: 5, comment: 'Well-organized and our guide was fantastic. Highly recommended!' },
        ]
    },
    // Add other packages here...
};


const PackageDetailsPage = () => {
    const { packageId } = useParams();
    const packageData = allPackagesData[packageId];

    const [numberOfPeople, setNumberOfPeople] = useState(2);

    const handlePeopleChange = (amount) => {
        setNumberOfPeople(prev => Math.max(1, prev + amount));
    };

    const finalPrice = packageData.pricePerPerson * numberOfPeople;

    if (!packageData) {
        return <div className="text-center py-20">Package not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Cover Image */}
            <header className="relative h-96">
                <img src={packageData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white">{packageData.name}</h1>
                    <div className="flex items-center text-gray-200 mt-2">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{packageData.places.join(' • ')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* About Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Package</h2>
                        <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
                    </section>
                    
                    {/* Itinerary Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Itinerary</h2>
                        <div className="relative border-l-2 border-amber-500 pl-8">
                            {packageData.itinerary.map((item, index) => (
                                <div key={index} className="mb-8 last:mb-0">
                                    <div className="absolute -left-3.5 top-1 w-6 h-6 bg-amber-500 rounded-full border-4 border-white"></div>
                                    <p className="text-amber-600 font-semibold text-sm">Day {item.day}</p>
                                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {packageData.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300" />
                            ))}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                        <div className="flex items-center mb-6">
                            <StarIcon className="h-8 w-8 text-yellow-400 mr-2" />
                            <span className="text-3xl font-bold">{packageData.rating}</span>
                            <span className="text-gray-500 ml-2">({packageData.reviews} reviews)</span>
                        </div>
                        <div className="space-y-6">
                            {packageData.testimonials.map((testimonial, index) => (
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book This Package</h2>
                        
                        <div className="space-y-6">
                            {/* Number of People */}
                            <div>
                                <label className="font-semibold text-gray-700">Number of People</label>
                                <div className="flex items-center justify-between mt-2 border rounded-lg p-2">
                                    <button onClick={() => handlePeopleChange(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4"/></button>
                                    <span className="text-lg font-bold">{numberOfPeople}</span>
                                    <button onClick={() => handlePeopleChange(1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4"/></button>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label className="font-semibold text-gray-700">Select Date</label>
                                 <div className="relative mt-2">
                                     <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="date" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-300"/>
                                </div>
                            </div>
                            
                            {/* Rate */}
                            <div className="text-center border-t pt-4">
                                <p className="text-sm text-gray-500">Total Price</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{finalPrice.toLocaleString()}
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

export default PackageDetailsPage;