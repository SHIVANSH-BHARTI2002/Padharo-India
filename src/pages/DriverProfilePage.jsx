import { useState } from 'react';
import {
    UserCircleIcon,
    StarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    WrenchScrewdriverIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    TruckIcon,
    UsersIcon,
    ListBulletIcon
} from '@heroicons/react/24/outline';
import { GiGearStickPattern } from "react-icons/gi"; // Using react-icons for gear stick

// Placeholder images - replace with driver-specific data
import defaultDriverAvatar from '../assets/man.png'; // Re-use avatar
import defaultCarImage from '../assets/swift.png'; // Example car image

const DriverProfilePage = () => {
    // Placeholder data - fetch this from your backend
    const driverData = {
        name: 'Ramesh Singh',
        avatar: defaultDriverAvatar,
        memberSince: '2024-01-15',
        rating: 4.8,
        totalTrips: 1250,
        experience: '5+ years',
        phone: '+91 98XXXXXX01', // Partially hidden
        email: 'ramesh.s@driver.padharoindia.com', // Placeholder email
        vehicle: {
            model: 'Maruti Swift Dzire',
            plateNumber: 'MH 01 AB 1234',
            image: defaultCarImage,
            type: 'Sedan',
            seats: 4,
            transmission: 'Manual',
            fuelType: 'Petrol',
            year: 2022,
        },
        serviceArea: ['Mumbai', 'Thane', 'Navi Mumbai'],
        baseRateKm: 12,
        baseRateHour: 250,
    };

    const [isOnline, setIsOnline] = useState(false); // Driver's online status

    const toggleOnlineStatus = () => {
        setIsOnline(!isOnline);
        // Add logic here to update status in the backend
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 pt-24"> {/* Added top padding */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Driver Info & Actions */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Driver Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200">
                        <img
                            src={driverData.avatar}
                            alt={driverData.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-amber-200 shadow-md"
                        />
                        <h1 className="text-2xl font-bold text-gray-900">{driverData.name}</h1>
                        <p className="text-gray-500 text-sm mb-4">Member since {driverData.memberSince}</p>
                        
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <StarIcon className="h-6 w-6 text-yellow-400" />
                            <span className="text-xl font-semibold">{driverData.rating}</span>
                            <span className="text-gray-500 text-sm">({driverData.totalTrips} trips)</span>
                        </div>

                        <div className="flex justify-center items-center gap-1 text-gray-600 mb-6 text-sm">
                            <ClockIcon className="h-4 w-4"/>
                            <span>{driverData.experience} experience</span>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition mb-4">
                            <PencilIcon className="h-4 w-4"/> Edit Profile
                        </button>

                        {/* Online/Offline Toggle */}
                        <button 
                            onClick={toggleOnlineStatus}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition ${
                                isOnline 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md' 
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md'
                            }`}
                        >
                            {isOnline ? <XCircleIcon className="h-5 w-5"/> : <CheckCircleIcon className="h-5 w-5"/>}
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                         <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                         <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-700">
                                <PhoneIcon className="h-4 w-4 mr-3 text-gray-400"/> {driverData.phone}
                            </div>
                             <div className="flex items-center text-gray-700">
                                <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400"/> {driverData.email}
                            </div>
                         </div>
                    </div>
                </div>

                {/* Right Column: Vehicle & Performance */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Vehicle Details */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                         <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">Vehicle Details</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Car Image */}
                            <div className="p-6 flex justify-center items-center border-b md:border-b-0 md:border-r">
                                 <img 
                                    src={driverData.vehicle.image} 
                                    alt={driverData.vehicle.model}
                                    className="max-h-48 object-contain"
                                />
                            </div>
                            {/* Specs */}
                             <div className="p-6 space-y-4">
                                <h3 className="text-lg font-bold text-gray-800">{driverData.vehicle.model} ({driverData.vehicle.year})</h3>
                                <p className="text-gray-600 font-mono bg-gray-100 inline-block px-2 py-1 rounded border">{driverData.vehicle.plateNumber}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                                     <div className='flex items-center text-gray-700'>
                                        <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span className="font-semibold">{driverData.vehicle.type}</span>
                                    </div>
                                    <div className='flex items-center text-gray-700'>
                                        <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span className="font-semibold">{driverData.vehicle.seats} Seater</span>
                                    </div>
                                    <div className='flex items-center text-gray-700'>
                                        <GiGearStickPattern className="h-5 w-5 mr-2 text-gray-400" />
                                        <span className="font-semibold">{driverData.vehicle.transmission}</span>
                                    </div>
                                     <div className='flex items-center text-gray-700'>
                                        {/* Simple icon placeholder for fuel */}
                                        <span className="mr-2 text-gray-400">⛽</span> 
                                        <span className="font-semibold">{driverData.vehicle.fuelType}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                                    <PencilIcon className="h-4 w-4"/> Edit Vehicle Details
                                </button>
                            </div>
                         </div>
                    </div>

                    {/* Service Details */}
                     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                         <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center"><MapPinIcon className="h-4 w-4 mr-2 text-gray-400"/> Service Area</span>
                                <span className="font-semibold text-gray-800">{driverData.serviceArea.join(', ')}</span>
                            </div>
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center"><CurrencyRupeeIcon className="h-4 w-4 mr-2 text-gray-400"/> Rate per Km</span>
                                <span className="font-semibold text-gray-800">₹{driverData.baseRateKm} / km</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center"><CurrencyRupeeIcon className="h-4 w-4 mr-2 text-gray-400"/> Rate per Hour (Rental)</span>
                                <span className="font-semibold text-gray-800">₹{driverData.baseRateHour} / hour</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Overview (Placeholder) */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700">Total Earnings (This Month)</p>
                                <p className="text-2xl font-bold text-green-800">₹ 25,400</p> 
                            </div>
                             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">Trips Completed (This Month)</p>
                                <p className="text-2xl font-bold text-blue-800">85</p> 
                            </div>
                        </div>
                         <button className="mt-6 flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium">
                            View Detailed Reports <ListBulletIcon className="h-4 w-4 ml-1"/>
                        </button>
                    </div>

                    {/* Recent Reviews (Placeholder) */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Rider Reviews</h2>
                        <div className="space-y-4">
                            <div className="border-b pb-3">
                                <div className="flex items-center mb-1">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-4 w-4 text-yellow-400" />)}
                                    <span className="ml-2 text-sm font-semibold">Amit S.</span>
                                </div>
                                <p className="text-sm text-gray-600">"Very professional and polite driver. Clean car."</p>
                            </div>
                             <div className="border-b pb-3">
                                <div className="flex items-center mb-1">
                                    {[...Array(4)].map((_, i) => <StarIcon key={i} className="h-4 w-4 text-yellow-400" />)}
                                     <StarIcon className="h-4 w-4 text-gray-300" /> {/* Example for 4 stars */}
                                    <span className="ml-2 text-sm font-semibold">Priya K.</span>
                                </div>
                                <p className="text-sm text-gray-600">"Good ride, slightly late for pickup."</p>
                            </div>
                        </div>
                        <button className="mt-6 flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium">
                            View All Reviews <ListBulletIcon className="h-4 w-4 ml-1"/>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DriverProfilePage;