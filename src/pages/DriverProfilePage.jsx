/* === Filename: src/pages/DriverProfilePage.jsx === */
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
    ListBulletIcon,
    PresentationChartLineIcon,
    CalendarDaysIcon // Added for bookings
} from '@heroicons/react/24/outline';
import { GiGearStickPattern } from "react-icons/gi"; // Using react-icons for gear stick

// Placeholder images - replace with driver-specific data
import defaultDriverAvatar from '../assets/man.png'; // Re-use avatar
import defaultCarImage from '../assets/swift.png'; // Example car image
import defaultBanner from '../assets/cta-background.jpg'; // Import default banner

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
    
    // Placeholder stats
    const salesData = {
        monthlySales: 25400,
        newBookings: 85,
    };
    
    // Placeholder reviews
    const recentReviews = [
        { user: 'Amit S.', rating: 5, comment: "Very professional and polite driver. Clean car." },
        { user: 'Priya K.', rating: 4, comment: "Good ride, slightly late for pickup." }
    ];

    // --- NEW: Placeholder for upcoming bookings ---
    const upcomingBookings = [
        {
            id: 'B-201',
            clientName: 'Rahul Verma',
            date: '2025-11-16',
            time: '14:00 PM',
            pickup: 'Mumbai Airport (BOM)',
            dropoff: 'Taj Hotel, Colaba',
            status: 'Confirmed'
        },
        {
            id: 'B-202',
            clientName: 'Sunita Sharma',
            date: '2025-11-17',
            time: '09:00 AM',
            pickup: 'Thane West',
            dropoff: 'Navi Mumbai (Rental)',
            duration: '4 Hours',
            status: 'Confirmed'
        },
    ];
    // --- END NEW DATA ---

    const [isOnline, setIsOnline] = useState(false); // Driver's online status
    const [activeTab, setActiveTab] = useState('bookings'); // Set 'bookings' as default

    const toggleOnlineStatus = () => {
        setIsOnline(!isOnline);
        // Add logic here to update status in the backend
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Header with Banner --- */}
            <header className="relative mb-16 md:mb-20">
                <div
                    className="h-64 md:h-80 bg-cover bg-center"
                    style={{ backgroundImage: `url(${defaultBanner})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6">
                        <div className="flex items-end">
                            <img
                                className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-lg -mb-10 sm:-mb-12"
                                src={driverData.avatar}
                                alt={driverData.name}
                            />
                            <div className="ml-6 mb-1 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{driverData.name}</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">Member since {driverData.memberSince}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                    <span className="text-white font-bold">{driverData.rating}</span>
                                    <span className="text-gray-200 text-sm">({driverData.totalTrips} trips)</span>
                                </div>
                            </div>
                        </div>
                        {/* Online/Offline Toggle */}
                        <div className="mt-4 sm:mt-0 sm:mb-2">
                             <button 
                                onClick={toggleOnlineStatus}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition shadow-lg ${
                                    isOnline 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600' 
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600'
                                }`}
                            >
                                {isOnline ? <XCircleIcon className="h-5 w-5"/> : <CheckCircleIcon className="h-5 w-5"/>}
                                {isOnline ? 'Go Offline' : 'Go Online'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

             {/* --- Main Content --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 md:-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                    {/* Left Column: Stats & Info */}
                    <aside className="lg:col-span-1 space-y-8 sticky top-24">
                        {/* Performance */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <PresentationChartLineIcon className="h-5 w-5 mr-2 text-gray-400" />
                                Performance (This Month)
                            </h2>
                             <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-700">Total Earnings</p>
                                    <p className="text-2xl font-bold text-green-800">₹{salesData.monthlySales.toLocaleString()}</p> 
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-700">Trips Completed</p>
                                    <p className="text-2xl font-bold text-blue-800">{salesData.newBookings}</p> 
                                </div>
                             </div>
                        </div>
                        
                        {/* Contact */}
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
                        
                        {/* Recent Reviews */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rider Reviews</h2>
                            <div className="space-y-4">
                                {recentReviews.map((review, index) => (
                                    <div key={index} className="border-b pb-3 last:border-b-0">
                                        <div className="flex items-center mb-1">
                                            {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="h-4 w-4 text-yellow-400" />)}
                                            {[...Array(5 - review.rating)].map((_, i) => <StarIcon key={i} className="h-4 w-4 text-gray-300" />)}
                                            <span className="ml-2 text-sm font-semibold">{review.user}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Management Tabs */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                            <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                {/* --- NEW BOOKINGS TAB --- */}
                                <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'bookings' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Upcoming Bookings</button>
                                <button onClick={() => setActiveTab('vehicle')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'vehicle' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>My Vehicle</button>
                                <button onClick={() => setActiveTab('service')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'service' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Service Details</button>
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'profile' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Edit Profile</button>
                            </nav>
                        </div>
                        
                        {/* Content Area */}
                        
                        {/* --- NEW: Tab: Upcoming Bookings --- */}
                        {activeTab === 'bookings' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fade-in">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Trips</h2>
                                    {upcomingBookings.length > 0 ? upcomingBookings.map(b => (
                                        <div key={b.id} className="p-4 border rounded-lg bg-gray-50">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                                <p className="font-semibold">{b.clientName}</p>
                                                <span className="mt-1 sm:mt-0 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">{b.status}</span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                <p><CalendarDaysIcon className="h-4 w-4 inline-block -mt-1 mr-2" />{b.date} @ {b.time}</p>
                                                <p><MapPinIcon className="h-4 w-4 inline-block -mt-1 mr-2 text-green-500" />Pickup: {b.pickup}</p>
                                                <p><MapPinIcon className="h-4 w-4 inline-block -mt-1 mr-2 text-red-500" />Dropoff: {b.dropoff}</p>
                                                {b.duration && <p><ClockIcon className="h-4 w-4 inline-block -mt-1 mr-2" />Duration: {b.duration}</p>}
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Accept</button>
                                                <button className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Decline</button>
                                            </div>
                                        </div>
                                    )) : <p>No upcoming bookings.</p>}
                                </div>
                            </div>
                        )}

                        {/* Tab: Vehicle Details */}
                        {activeTab === 'vehicle' && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                                <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">Vehicle Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="p-6 flex justify-center items-center border-b md:border-b-0 md:border-r">
                                        <img 
                                            src={driverData.vehicle.image} 
                                            alt={driverData.vehicle.model}
                                            className="max-h-48 object-contain"
                                        />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-gray-800">{driverData.vehicle.model} ({driverData.vehicle.year})</h3>
                                        <p className="text-gray-600 font-mono bg-gray-100 inline-block px-2 py-1 rounded border">{driverData.vehicle.plateNumber}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                                            <div className='flex items-center text-gray-700'><TruckIcon className="h-5 w-5 mr-2 text-gray-400" /><span className="font-semibold">{driverData.vehicle.type}</span></div>
                                            <div className='flex items-center text-gray-700'><UsersIcon className="h-5 w-5 mr-2 text-gray-400" /><span className="font-semibold">{driverData.vehicle.seats} Seater</span></div>
                                            <div className='flex items-center text-gray-700'><GiGearStickPattern className="h-5 w-5 mr-2 text-gray-400" /><span className="font-semibold">{driverData.vehicle.transmission}</span></div>
                                            <div className='flex items-center text-gray-700'><span className="mr-2 text-gray-400">⛽</span> <span className="font-semibold">{driverData.vehicle.fuelType}</span></div>
                                        </div>
                                        <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                                            <PencilIcon className="h-4 w-4"/> Edit Vehicle Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab: Service Details */}
                        {activeTab === 'service' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fade-in">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Service Area (comma-separated)</label>
                                        <input type="text" defaultValue={driverData.serviceArea.join(', ')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rate per Km (₹)</label>
                                        <input type="number" defaultValue={driverData.baseRateKm} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Rate per Hour (Rental) (₹)</label>
                                        <input type="number" defaultValue={driverData.baseRateHour} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <button type="submit" className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600">Save Changes</button>
                                </form>
                            </div>
                        )}
                        
                        {/* Tab: Edit Profile */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fade-in">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Your Profile</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input type="text" defaultValue={driverData.name.split(' ')[0]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input type="text" defaultValue={driverData.name.split(' ')[1]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" defaultValue={driverData.email} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input type="tel" defaultValue={driverData.phone} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <button type="submit" className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600">Save Changes</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriverProfilePage;