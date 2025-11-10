/* === Filename: src/pages/HotelDashboard.jsx === */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    PlusIcon, PencilIcon, TrashIcon, XMarkIcon, 
    BuildingOffice2Icon, StarIcon, CheckCircleIcon, XCircleIcon,
    CurrencyRupeeIcon, CalendarDaysIcon, ListBulletIcon,
    PresentationChartLineIcon, MoonIcon
} from '@heroicons/react/24/outline';

// Import placeholder images
import defaultBanner from '../assets/cta-background.jpg'; // Re-using this for the banner
import defaultHotelImage from '../assets/exterior.jpg'; 
import defaultRoomImage from '../assets/room1.jpg'; 

// --- Room Form Modal ---
// This component manages adding/editing a room
const RoomFormModal = ({ hotelId, room, onClose, onSave }) => {
    const { token } = useAuth(); // For API calls
    const [formData, setFormData] = useState({
        type: '',
        details: '',
        price: '',
        taxes: '',
        cancellation_policy: 'Free Cancellation',
        perks: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = room && room.id;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                type: room.type || '',
                details: room.details || '',
                price: room.price || '',
                taxes: room.taxes || '',
                cancellation_policy: room.cancellation_policy || 'Free Cancellation',
                perks: room.perks.join(', ') || '', // Convert array to string for form
                image_url: room.image_url || ''
            });
        }
    }, [room, isEditing]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Prepare data for API: split comma-separated strings into arrays
        const apiData = {
            ...formData,
            perks: formData.perks.split(',').map(s => s.trim()).filter(Boolean),
            price: parseFloat(formData.price),
            taxes: parseFloat(formData.taxes) || 0
        };

        try {
            let result;
            let savedData;
            
            if (isEditing) {
                // --- UPDATE (PUT) ---
                // const response = await fetch(`/api/hotels/${hotelId}/rooms/${room.id}`, {
                //     method: 'PUT',
                //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                //     body: JSON.stringify(apiData)
                // });
                // if (!response.ok) throw new Error('Failed to update room');
                // result = await response.json();
                // savedData = result.room;
                
                alert('Room Updated (Simulated)');
                savedData = { ...room, ...apiData }; // Simulate response
            } else {
                // --- CREATE (POST) ---
                // const response = await fetch(`/api/hotels/${hotelId}/rooms`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                //     body: JSON.stringify(apiData)
                // });
                // if (!response.ok) throw new Error('Failed to create room');
                // result = await response.json();
                // savedData = result.room;

                alert('Room Created (Simulated)');
                savedData = { ...apiData, id: Date.now() }; // Simulate response
            }
            
            onSave(savedData); // Pass data back to parent
            onClose(); // Close modal on success

        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold">{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
                <button onClick={onClose} type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Room Type (e.g., Deluxe Room)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Details (e.g., 350 sq.ft, King Bed)" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL (e.g., /src/assets/room1.jpg)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price per night (₹)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    <input type="number" name="taxes" value={formData.taxes} onChange={handleChange} placeholder="Taxes & Fees (₹)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <input type="text" name="cancellation_policy" value={formData.cancellation_policy} onChange={handleChange} placeholder="Cancellation Policy" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input type="text" name="perks" value={formData.perks} onChange={handleChange} placeholder="Perks (comma-separated, e.g., Free WiFi, Breakfast)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                
                <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Room'}
                </button>
            </form>
        </div>
    );
};


// --- Hotel Dashboard Page ---
const HotelDashboard = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    
    // --- PLACEHOLDER DATA (fetch from API) ---
    // In a real app, you would fetch /api/hotels/my-hotel to get this
    const [hotel, setHotel] = useState({
        id: 1,
        name: 'Hotel Mumbai Valnai',
        location: 'Malad, Mumbai',
        image_url: defaultHotelImage,
        banner_url: defaultBanner,
        rating: 4.8,
        reviews: 2240,
        description: 'A Luxury Hotel on MG Road near Offices and Malls.',
        star_rating: 5,
        amenities: ['Spa', 'Swimming Pool', 'Gym', 'Restaurant'],
        galleryUrls: ['/src/assets/room1.jpg', '/src/assets/room2.jpg']
    });
    
    const [salesData, setSalesData] = useState({
        monthlySales: 850000,
        newBookings: 120,
        occupancyRate: 78
    });

    const [upcomingBookings, setUpcomingBookings] = useState([
        { id: 'B-125', clientName: 'Amit Shah', checkIn: '2025-11-12', checkOut: '2025-11-14', room: 'Deluxe Room' },
        { id: 'B-126', clientName: 'Priya Mehta', checkIn: '2025-11-13', checkOut: '2025-11-16', room: 'Super Package' },
    ]);
    
    const [rooms, setRooms] = useState([
        { id: 1, type: 'Deluxe Room', price: 4500, perks: ['Free WiFi'], image_url: defaultRoomImage, details: '342 sq.ft', taxes: 576, cancellation_policy: 'Free Cancellation before 21 Sep'},
        { id: 2, type: 'Super Package', price: 5330, perks: ['Free WiFi', 'Breakfast'], image_url: defaultRoomImage, details: '350 sq.ft', taxes: 594, cancellation_policy: 'Non-refundable'},
    ]);
    // --- END PLACEHOLDER DATA ---

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null); // Room being edited
    const [isOnline, setIsOnline] = useState(true);

    // This form state is for the "Edit Hotel Profile" tab
    const [hotelFormData, setHotelFormData] = useState({
        name: '',
        location: '',
        description: '',
        star_rating: 5,
        amenities: '',
        image_url: '',
        galleryUrls: ''
    });
    
    // Load hotel data into form when hotel data is "fetched"
    useEffect(() => {
        if (hotel) {
            setHotelFormData({
                name: hotel.name,
                location: hotel.location,
                description: hotel.description,
                star_rating: hotel.star_rating,
                amenities: hotel.amenities.join(', '),
                image_url: hotel.image_url,
                galleryUrls: hotel.galleryUrls.join(', ')
            });
        }
    }, [hotel]);


    // Toggle Online/Offline
    const toggleOnlineStatus = () => {
        // This would be an API call
        // PUT /api/hotels/:id { is_available: !isOnline }
        setIsOnline(!isOnline);
        alert(`Hotel is now ${!isOnline ? 'ONLINE' : 'OFFLINE'} (Simulated)`);
    };

    // Hotel Profile Edit
    const handleHotelFormChange = (e) => {
        setHotelFormData({ ...hotelFormData, [e.target.name]: e.target.value });
    };
    
    const handleHotelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const apiData = {
            ...hotelFormData,
            amenities: hotelFormData.amenities.split(',').map(s => s.trim()).filter(Boolean),
            galleryUrls: hotelFormData.galleryUrls.split(',').map(s => s.trim()).filter(Boolean),
            star_rating: parseInt(hotelFormData.star_rating)
        };
        
        try {
            // --- UPDATE (PUT) ---
            // const response = await fetch(`/api/hotels/${hotel.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify(apiData)
            // });
            // if (!response.ok) throw new Error('Failed to update hotel profile');
            // const result = await response.json();
            // setHotel(result.hotel); // Update state with new hotel data
            
            alert('Hotel Profile Updated (Simulated)');
            setHotel(prev => ({...prev, ...apiData})); // Update state
            setActiveTab('bookings'); // Go back to main tab
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Room Management
    const handleSaveRoom = (savedRoom) => {
        if (currentRoom) {
            // Edit
            setRooms(rooms.map(r => r.id === savedRoom.id ? savedRoom : r));
        } else {
            // Add
            setRooms([...rooms, savedRoom]);
        }
        setCurrentRoom(null);
    };

    const handleDeleteRoom = (roomId) => {
        if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
            // DELETE /api/hotels/:hotelId/rooms/:roomId
            setRooms(rooms.filter(r => r.id !== roomId));
            alert('Room Deleted (Simulated)');
        }
    };

    if (loading) return <div className="p-8 pt-24">Loading dashboard...</div>;
    if (!user || user.businessType !== 'Hotel') {
        return <div className="p-8 pt-24 text-red-500">Access Denied. This dashboard is for Hotel owners.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Header with Banner --- */}
            <header className="relative mb-16">
                <div
                    className="h-64 md:h-80 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hotel.banner_url || defaultBanner})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6">
                        <div className="flex items-end">
                            <img
                                className="h-32 w-32 md:h-40 md:w-40 rounded-lg object-cover border-4 border-white shadow-lg -mb-10 sm:-mb-12"
                                src={hotel.image_url || defaultHotelImage}
                                alt="Hotel"
                            />
                            <div className="ml-6 mb-1 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{hotel.name}</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{hotel.location}</p>
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

                    {/* Left Column: Stats */}
                    <aside className="lg:col-span-1 space-y-8 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <PresentationChartLineIcon className="h-5 w-5 mr-2 text-gray-400" />
                                Sales Overview (This Month)
                            </h2>
                             <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-700">Total Sales</p>
                                    <p className="text-2xl font-bold text-green-800">₹{salesData.monthlySales.toLocaleString()}</p> 
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-700">New Bookings</p>
                                    <p className="text-2xl font-bold text-blue-800">{salesData.newBookings}</p> 
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-700">Occupancy Rate</p>
                                    <p className="text-2xl font-bold text-amber-800">{salesData.occupancyRate}%</p> 
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
                                <button onClick={() => setActiveTab('rooms')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'rooms' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Manage Rooms</button>
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'profile' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Edit Profile</button>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                            
                            {/* Tab: Upcoming Bookings */}
                            {activeTab === 'bookings' && (
                                <div className="space-y-4 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Check-ins</h2>
                                    {upcomingBookings.length > 0 ? upcomingBookings.map(b => (
                                        <div key={b.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center">
                                            <div>
                                                <p className="font-semibold">{b.clientName}</p>
                                                <p className="text-sm text-gray-600">{b.room}</p>
                                                <p className="text-sm text-gray-500"><CalendarDaysIcon className="h-4 w-4 inline-block -mt-1" /> {b.checkIn} to {b.checkOut}</p>
                                            </div>
                                            <span className="mt-2 sm:mt-0 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">{b.status || 'Confirmed'}</span>
                                        </div>
                                    )) : <p>No upcoming bookings.</p>}
                                </div>
                            )}

                            {/* Tab: Manage Rooms */}
                            {activeTab === 'rooms' && (
                                <div className="animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Your Room Types</h2>
                                        <button onClick={() => { setCurrentRoom(null); setShowRoomModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
                                            <PlusIcon className="h-5 w-5" /> Add Room
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {rooms.map(room => (
                                            <div key={room.id} className="flex items-center p-4 border rounded-lg">
                                                <img src={room.image_url || defaultRoomImage} alt={room.type} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mr-4" />
                                                <div className="flex-1">
                                                    <p className="font-semibold">{room.type}</p>
                                                    <p className="text-sm text-green-700 font-bold">₹{room.price}/night</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">{room.perks.join(' • ')}</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button onClick={() => { setCurrentRoom(room); setShowRoomModal(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><PencilIcon className="h-5 w-5" /></button>
                                                    <button onClick={() => handleDeleteRoom(room.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Edit Hotel Profile */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleHotelSubmit} className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Hotel Profile</h2>
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                                            <input type="text" name="name" value={hotelFormData.name} onChange={handleHotelFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input type="text" name="location" value={hotelFormData.location} onChange={handleHotelFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea name="description" value={hotelFormData.description} onChange={handleHotelFormChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Star Rating (1-5)</label>
                                            <input type="number" name="star_rating" value={hotelFormData.star_rating} onChange={handleHotelFormChange} min="1" max="5" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                                            <input type="text" name="image_url" value={hotelFormData.image_url} onChange={handleHotelFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                                        <input type="text" name="amenities" value={hotelFormData.amenities} onChange={handleHotelFormChange} placeholder="e.g., Free WiFi, Pool" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gallery Image URLs (comma-separated)</label>
                                        <input type="text" name="galleryUrls" value={hotelFormData.galleryUrls} onChange={handleHotelFormChange} placeholder="e.g., https://.../img1.jpg, https://.../img2.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
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

            {/* --- Room Modal --- */}
            {showRoomModal && (
                <RoomFormModal 
                    hotelId={hotel.id}
                    room={currentRoom}
                    onClose={() => { setShowRoomModal(false); setCurrentRoom(null); }}
                    onSave={handleSaveRoom}
                />
            )}
        </div>
    );
};

export default HotelDashboard;