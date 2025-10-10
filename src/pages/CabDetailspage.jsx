import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { GiGearStickPattern } from "react-icons/gi";
import heroImage from '../assets/car2.jpg'; // Import the hero image

// Mock data remains the same
const allCabsData = {
    'Maruti Swift Dzire': {
        images: ['/src/assets/swift.png', '/src/assets/car-interior.jpg'],
        name: 'Maruti Swift Dzire',
        driver: 'Ramesh Singh',
        rating: 4.8,
        experience: '5+ years',
        seats: 4,
        pricePerHour: 250,
        pricePerKm: 12,
        type: 'Sedan',
        transmission: 'Manual',
        fuelType: 'Petrol',
        reviews: [
            { user: 'Amit', rating: 5, comment: 'Very professional and polite driver. The car was clean and comfortable.' },
            { user: 'Priya', rating: 4, comment: 'Good service, but the driver was a bit late. Overall, a positive experience.' }
        ]
    },
    'Toyota Innova Crysta': {
        images: ['/src/assets/innova.png', '/src/assets/car-interior.jpg'],
        name: 'Toyota Innova Crysta',
        driver: 'Suresh Verma',
        rating: 4.9,
        experience: '8+ years',
        seats: 7,
        pricePerHour: 450,
        pricePerKm: 18,
        type: 'SUV',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        reviews: [
            { user: 'Raj', rating: 5, comment: 'Excellent driver and very spacious car. Highly recommended for long trips.' },
            { user: 'Sunita', rating: 5, comment: 'Suresh was very helpful with our luggage. The ride was smooth and pleasant.' }
        ]
    },
     'Mahindra Marazzo': {
        images: ['/src/assets/marazzo.png', '/src/assets/car-interior.jpg'],
        name: 'Mahindra Marazzo',
        driver: 'Vikram Rathore',
        rating: 4.7,
        experience: '7+ years',
        seats: 6,
        pricePerHour: 400,
        pricePerKm: 16,
        type: 'MPV',
        transmission: 'Manual',
        fuelType: 'Diesel',
        reviews: [
            { user: 'Karan', rating: 5, comment: 'Vikram is a great driver with excellent knowledge of the local routes.' },
        ]
    },
    'Honda City': {
        images: ['/src/assets/honda_city.png', '/src/assets/car-interior.jpg'],
        name: 'Honda City',
        driver: 'Anil Kapoor',
        rating: 4.6,
        experience: '6+ years',
        seats: 4,
        pricePerHour: 300,
        pricePerKm: 14,
        type: 'Sedan',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        reviews: [
            { user: 'Deepak', rating: 5, comment: 'Anil was very professional and the car was in pristine condition.' },
        ]
    }
};

const DetailItem = ({ label, value }) => (
    <div className="text-center">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800 mt-1 text-lg">{value}</p>
    </div>
);

const CabDetailsPage = () => {
    const { cabName } = useParams();
    const cabData = allCabsData[cabName];

    const [bookingType, setBookingType] = useState('cab');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [distance, setDistance] = useState(10);
    const [hours, setHours] = useState(1);

    if (!cabData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700">Cab not found</h1>
                    <p className="text-gray-500">Please check the URL and try again.</p>
                </div>
            </div>
        );
    }

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % cabData.images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + cabData.images.length) % cabData.images.length);

    const subtotal = bookingType === 'cab' ? cabData.pricePerKm * distance : cabData.pricePerHour * hours;
    const taxes = subtotal * 0.10;
    const total = subtotal + taxes;

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            {/* This div is now fixed to cover the entire viewport */}
            <div className="fixed inset-0 bg-black/60 z-0" />
            
            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12 pt-28">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Left Column */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl">
                            {/* Image Gallery */}
                            <div className="relative mb-6">
                                <img src={cabData.images[currentImageIndex]} alt={cabData.name} className="w-full h-auto object-contain rounded-xl shadow-lg" />
                                <div className="absolute inset-0 flex justify-between items-center px-2">
                                    <button onClick={prevImage} className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-transform transform hover:scale-110">
                                        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                                    </button>
                                    <button onClick={nextImage} className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-transform transform hover:scale-110">
                                        <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Driver Details */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 mb-8">
                                <UserCircleIcon className="h-16 w-16 text-slate-400 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm text-slate-500">Your Driver</p>
                                    <p className="font-bold text-lg text-slate-900">{cabData.driver}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="flex items-center justify-end gap-1">
                                        <StarIcon className="w-5 h-5 text-amber-500" />
                                        <span className="font-bold text-lg">{cabData.rating}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{cabData.experience} experience</p>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-6 border-y">
                                <DetailItem label="Type" value={cabData.type} />
                                <DetailItem label="Transmission" value={cabData.transmission} />
                                <DetailItem label="Seats" value={`${cabData.seats} Seater`} />
                                <DetailItem label="Fuel" value={cabData.fuelType} />
                            </div>
                            
                            {/* Reviews */}
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-6">Guest Reviews</h2>
                                <div className="space-y-8">
                                    {cabData.reviews.map((review, index) => (
                                        <div key={index} className="border-t pt-6">
                                            <div className="flex items-center mb-2">
                                                <div className="font-semibold text-lg mr-4">{review.user}</div>
                                                <div className="flex items-center">
                                                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-amber-400" />)}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Fixed Column */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-28 bg-white/90 backdrop-blur-md rounded-2xl border shadow-2xl p-6">
                            <h1 className="text-3xl font-bold tracking-tight mb-1">{cabData.name}</h1>
                            <p className="text-slate-500 mb-6">Finalize your booking details</p>
                            
                            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-6 border">
                                <button onClick={() => setBookingType('cab')} className={`py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${bookingType === 'cab' ? 'bg-white shadow-md' : 'text-slate-600'}`}>Outstation</button>
                                <button onClick={() => setBookingType('rental')} className={`py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${bookingType === 'rental' ? 'bg-white shadow-md' : 'text-slate-600'}`}>Rental</button>
                            </div>

                            <div className="space-y-4 mb-4">
                                <input type="text" placeholder="Pickup Location" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" />
                                {bookingType === 'cab' && (
                                    <input type="text" placeholder="Drop-off Location" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" />
                                )}
                            </div>
                            
                            <div className="mb-6 rounded-lg overflow-hidden border">
                                <iframe
                                    title="Pickup Location Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234700.5517449265!2d77.25185672091913!3d23.25745476313361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x2155716d572d4f8!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1675776451883!5m2!1sen!2sin"
                                    className="w-full h-48 border-0"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <div className="space-y-3 text-sm border-t pt-4 mb-4">
                                {bookingType === 'cab' ? (
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="distance" className="text-slate-600">Distance (km)</label>
                                        <input type="number" id="distance" value={distance} onChange={e => setDistance(Math.max(1, e.target.value))} className="w-20 text-right font-semibold border rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" min="1"/>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="hours" className="text-slate-600">Duration (hours)</label>
                                        <input type="number" id="hours" value={hours} onChange={e => setHours(Math.max(1, e.target.value))} className="w-20 text-right font-semibold border rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" min="1"/>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Base Price</span>
                                    <span className="font-medium">₹{bookingType === 'cab' ? `${cabData.pricePerKm}/km` : `${cabData.pricePerHour}/hr`}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Taxes & Fees</span>
                                    <span className="font-medium text-slate-800">₹{taxes.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between font-bold text-2xl border-t pt-4 mb-6">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                                Proceed to Book
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CabDetailsPage;