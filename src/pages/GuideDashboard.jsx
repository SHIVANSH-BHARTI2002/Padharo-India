/* === Filename: src/pages/GuideDashboard.jsx === */
import React, { useState } from 'react';
import {
    UserCircleIcon,
    StarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    ListBulletIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext'; 

// Import placeholder images
import defaultGuideAvatar from '../assets/man.png'; // Re-use avatar
import defaultBanner from '../assets/cta-background.jpg'; // Re-use banner

const GuideDashboard = () => {
    const { user } = useAuth(); // Get the logged-in user
    const [activeTab, setActiveTab] = useState('bookings');
    
    // --- PLACEHOLDER DATA (fetch from API) ---
    const [guideData, setGuideData] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : 'Rajesh Kumar',
        avatar: defaultGuideAvatar,
        memberSince: '2024-03-10',
        rating: 4.9,
        totalTrips: 340,
        experience: '8+ years',
        phone: user ? user.mobile : '+91 98XXXXXX02',
        email: user ? user.email : 'rajesh.k@guide.padharoindia.com',
        profile: {
            location: 'Jaipur, Rajasthan',
            description_long: 'Passionate storyteller with deep expertise in Rajasthani culture. I bring ancient palaces to life with engaging narratives.',
            languages: ['Hindi', 'English', 'German'],
            specialties: ['History', 'Culture', 'Cuisine'],
        },
        serviceArea: ['Jaipur', 'Amber', 'Nahargarh'],
        price_per_hour: 450,
    });

    const [upcomingBookings, setUpcomingBookings] = useState([
        { id: 'B-123', clientName: 'Emily Watson', date: '2025-11-15', time: '10:00 AM', duration: '4 hours', status: 'Confirmed' },
        { id: 'B-124', clientName: 'Michael Chen', date: '2025-11-17', time: '09:00 AM', duration: '8 hours (Full Day)', status: 'Confirmed' },
    ]);
    
    const [salesData, setSalesData] = useState({
        monthlySales: 31500,
        newBookings: 12,
        conversionRate: 15 // %
    });
    // --- END PLACEHOLDER DATA ---

    const [isOnline, setIsOnline] = useState(true); // Guide's online status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state for "Edit Profile" tab
    const [formData, setFormData] = useState({
        location: guideData.profile.location,
        description_long: guideData.profile.description_long,
        languages: guideData.profile.languages.join(', '),
        specialties: guideData.profile.specialties.join(', '),
        price_per_hour: guideData.price_per_hour,
        experience_years: guideData.experience.replace('+ years', ''),
        image_url: guideData.avatar
    });

    const toggleOnlineStatus = () => {
        // API call to update availability
        setIsOnline(!isOnline);
        alert(`Guide is now ${!isOnline ? 'ONLINE' : 'OFFLINE'} (Simulated)`);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setGuideData(prev => ({
                ...prev,
                avatar: formData.image_url,
                price_per_hour: formData.price_per_hour,
                experience: `${formData.experience_years}+ years`,
                profile: {
                    ...prev.profile,
                    location: formData.location,
                    description_long: formData.description_long,
                    languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
                    specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
                }
            }));
            setLoading(false);
            alert('Profile Updated (Simulated)');
            setActiveTab('bookings'); // Switch back to bookings
        }, 1000);
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
                                src={guideData.avatar}
                                alt="Guide"
                            />
                            <div className="ml-6 mb-1 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{guideData.name}</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{guideData.profile.location}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                    <span className="text-white font-bold">{guideData.rating}</span>
                                    <span className="text-gray-200 text-sm">({guideData.totalTrips} tours)</span>
                                </div>
                            </div>
                        </div>
                        {/* Online/Offline Toggle */}
                        <div className="mt-4 sm:mt-0 sm:mb-2">
                             <button 
                                onClick={toggleOnlineStatus}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition shadow-lg ${
                                    isOnline 
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600' 
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600'
                                }`}
                            >
                                {isOnline ? <CheckCircleIcon className="h-5 w-5"/> : <XCircleIcon className="h-5 w-5"/>}
                                {isOnline ? 'Online' : 'Offline'}
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
                                    <p className="text-sm text-blue-700">New Bookings</p>
                                    <p className="text-2xl font-bold text-blue-800">{salesData.newBookings}</p> 
                                </div>
                             </div>
                        </div>
                        
                        {/* Contact */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                             <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                             <div className="space-y-3 text-sm">
                                <div className="flex items-center text-gray-700">
                                    <PhoneIcon className="h-4 w-4 mr-3 text-gray-400"/> {guideData.phone}
                                </div>
                                 <div className="flex items-center text-gray-700">
                                    <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400"/> {guideData.email}
                                </div>
                             </div>
                        </div>
                    </aside>

                    {/* Right Column: Management Tabs */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                            <nav className="flex space-x-2">
                                <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'bookings' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Upcoming Bookings</button>
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'profile' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Edit Profile</button>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                            
                            {/* Tab: Upcoming Bookings */}
                            {activeTab === 'bookings' && (
                                <div className="space-y-4 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Tours</h2>
                                    {upcomingBookings.length > 0 ? upcomingBookings.map(b => (
                                        <div key={b.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center">
                                            <div>
                                                <p className="font-semibold">{b.clientName}</p>
                                                <p className="text-sm text-gray-600"><CalendarDaysIcon className="h-4 w-4 inline-block -mt-1" /> {b.date} @ {b.time}</p>
                                                <p className="text-sm text-gray-500"><ClockIcon className="h-4 w-4 inline-block -mt-1" /> Duration: {b.duration}</p>
                                            </div>
                                            <span className="mt-2 sm:mt-0 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">{b.status}</span>
                                        </div>
                                    )) : <p>No upcoming bookings.</p>}
                                </div>
                            )}

                            {/* Tab: Edit Guide Profile */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                                    {error && <p className="text-red-500">{error}</p>}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., Jaipur, Rajasthan" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input type="text" name="image_url" value={formData.image_url} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="https://example.com/image.png" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                                        <textarea name="description_long" value={formData.description_long} onChange={handleFormChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Languages (comma-separated)</label>
                                            <input type="text" name="languages" value={formData.languages} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., English, Hindi" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Specialties (comma-separated)</label>
                                            <input type="text" name="specialties" value={formData.specialties} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., History, Cuisine" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Price per Hour (₹)</label>
                                            <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                            <input type="number" name="experience_years" value={formData.experience_years} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default GuideDashboard;