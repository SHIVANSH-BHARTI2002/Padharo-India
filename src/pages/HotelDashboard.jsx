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
import {
    apiGetMyHotel,
    apiCreateHotel,
    apiUpdateHotel,
    apiGetMyHotelBookings,
    apiGetMyHotelStats,
    apiCreateRoom,
    apiUpdateRoom,
    apiDeleteRoom,
    apiUploadHotelImage,
    apiUploadRoomImage,
    apiUploadRoomImageTemp,
    apiUploadHotelGallery,
    apiUploadHotelGalleryTemp
} from '../apiService';

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
        image_url: '',
        number_of_rooms: 1
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
                image_url: room.image_url || '',
                number_of_rooms: room.number_of_rooms || 1
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
            taxes: parseFloat(formData.taxes) || 0,
            number_of_rooms: parseInt(formData.number_of_rooms, 10) || 1
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Room Image</label>
                    <RoomImageUploader
                        hotelId={hotelId}
                        roomId={isEditing ? room.id : null}
                        currentUrl={formData.image_url}
                        onUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    />
                    <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder={isEditing ? 'Or paste URL (e.g., https://... or /uploads/room/...)' : 'Optionally paste URL (you can upload too)'} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price per night (₹)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    <input type="number" name="taxes" value={formData.taxes} onChange={handleChange} placeholder="Taxes & Fees (₹)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" min="1" name="number_of_rooms" value={formData.number_of_rooms} onChange={handleChange} placeholder="Total rooms of this type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
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


// --- Hotel Image Uploader ---
// Allows owners to upload a main image for their hotel and updates the form
const HotelImageUploader = ({ currentUrl, hotel, onUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setFile(f);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image file.');
            return;
        }
        setUploading(true);
        setError('');
        try {
            const data = await apiUploadHotelImage(hotel.id, file);
            const url = data?.url || data?.image_url || data?.hotel?.image_url;
            if (!url) throw new Error('Upload succeeded but no URL returned.');
            onUploaded(url);
        } catch (e) {
            setError(e.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {currentUrl && (
                <div className="mb-2">
                    <img src={currentUrl || defaultHotelImage} alt="Hotel banner" className="w-full h-36 object-cover rounded-md border" />
                    <p className="text-xs text-gray-500 mt-1">Current: {currentUrl}</p>
                </div>
            )}
            <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full rounded-md border-gray-300 shadow-sm" />
                <button type="button" onClick={handleUpload} disabled={uploading || !file} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {!currentUrl && (
                <p className="text-xs text-gray-500 mt-1">Tip: After uploading, the field will auto-fill.</p>
            )}
        </div>
    );
};

// --- Room Image Uploader ---
const RoomImageUploader = ({ hotelId, roomId, currentUrl, onUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setFile(f);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image file.');
            return;
        }
        setUploading(true);
        setError('');
        try {
            let data;
            if (roomId) {
                // Edit flow: update DB and return room
                data = await apiUploadRoomImage(hotelId, roomId, file);
                const url = data?.url || data?.room?.image_url;
                if (!url) throw new Error('Upload succeeded but no URL returned.');
                onUploaded(url);
            } else {
                // Create flow: get URL only
                data = await apiUploadRoomImageTemp(hotelId, file);
                const url = data?.url;
                if (!url) throw new Error('Upload succeeded but no URL returned.');
                onUploaded(url);
            }
        } catch (e) {
            setError(e.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {currentUrl && (
                <div className="mb-2">
                    <img src={currentUrl || defaultRoomImage} alt="Room" className="w-full h-32 object-cover rounded-md border" />
                    <p className="text-xs text-gray-500 mt-1">Current: {currentUrl}</p>
                </div>
            )}
            <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full rounded-md border-gray-300 shadow-sm" />
                <button type="button" onClick={handleUpload} disabled={uploading || !file} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {!currentUrl && (
                <p className="text-xs text-gray-500 mt-1">Tip: After uploading, the field will auto-fill.</p>
            )}
        </div>
    );
};

// --- Hotel Gallery Uploader ---
// Allows owners to upload multiple gallery images for their hotel
const HotelGalleryUploader = ({ hotel, currentUrls, onUploaded, onGalleryChange }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || []).slice(0, 5);
        setFiles(selected);
        setError('');
    };

    const handleUpload = async () => {
        if (!files.length) {
            setError('Please select one or more image files.');
            return;
        }
        setUploading(true);
        setError('');
        try {
            let data;
            if (hotel?.id) {
                // Edit flow: update DB and return updated hotel or urls
                data = await apiUploadHotelGallery(hotel.id, files);
                const urls = data?.urls || data?.hotel?.galleryUrls;
                if (!urls || !urls.length) throw new Error('Upload succeeded but no URLs returned.');
                onUploaded(urls);
            } else {
                // Create flow: get URLs only
                data = await apiUploadHotelGalleryTemp(files);
                const urls = data?.urls;
                if (!urls || !urls.length) throw new Error('Upload succeeded but no URLs returned.');
                onUploaded(urls);
            }
            setFiles([]);
        } catch (e) {
            setError(e.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const previewList = Array.isArray(currentUrls) ? currentUrls : [];

    const handleRemove = async (url) => {
        const newList = previewList.filter((u) => u !== url);
        setError('');
        try {
            if (hotel?.id) {
                setUploading(true);
                await apiUpdateHotel(hotel.id, { galleryUrls: newList });
            }
            if (onGalleryChange) onGalleryChange(newList);
        } catch (e) {
            setError(e.message || 'Failed to remove image.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {previewList.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-2">
                    {previewList.slice(0, 6).map((u, idx) => (
                        <div key={idx} className="relative group">
                            <img src={u} alt={`Gallery ${idx+1}`} className="w-full h-24 object-cover rounded-md border" />
                            <button
                                type="button"
                                onClick={() => handleRemove(u)}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-90 hover:opacity-100"
                                title="Remove"
                            >Remove</button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex items-center gap-2">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="block w-full rounded-md border-gray-300 shadow-sm" />
                <button type="button" onClick={handleUpload} disabled={uploading || files.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {previewList.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Tip: Uploading will add URLs to your gallery.</p>
            )}
        </div>
    );
};


// --- Hotel Dashboard Page ---
const HotelDashboard = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');

    // Hotel data from backend
    const [hotel, setHotel] = useState(null);

    const [salesData, setSalesData] = useState({
        monthlySales: 0,
        newBookings: 0,
        occupancyRate: 0
    });

    const [upcomingBookings, setUpcomingBookings] = useState([]);

    const [rooms, setRooms] = useState([]);
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
                name: hotel.name || '',
                location: hotel.location || '',
                description: hotel.description || '',
                star_rating: hotel.star_rating || 5,
                amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : '',
                // Prefill image from user's avatar when missing
                image_url: hotel.image_url || (user?.profileImageUrl || ''),
                galleryUrls: Array.isArray(hotel.galleryUrls) ? hotel.galleryUrls.join(', ') : ''
            });
        }
    }, [hotel, user]);

    // Initial load: fetch hotel, bookings, stats
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const h = await apiGetMyHotel();
                setHotel(h);
                setRooms(Array.isArray(h.rooms) ? h.rooms : []);

                // Stats
                try {
                    const s = await apiGetMyHotelStats();
                    setSalesData({
                        monthlySales: Number(s?.monthlySales || 0),
                        newBookings: Number(s?.newBookings || 0),
                        occupancyRate: Number(s?.occupancyRate || 0)
                    });
                } catch (e) { /* keep defaults */ }

                // Bookings
                try {
                    const b = await apiGetMyHotelBookings();
                    const mapped = (b || []).map(x => ({
                        id: x.id,
                        clientName: `${x.client_firstName || ''} ${x.client_lastName || ''}`.trim() || 'Unknown Client',
                        checkIn: x.start_date,
                        checkOut: x.end_date || x.start_date,
                        room: x.room_type || 'Room',
                        status: x.status || 'Confirmed'
                    }));
                    setUpcomingBookings(mapped);
                } catch (e) { /* show none */ }
            } catch (err) {
                // If owner has no hotel yet, direct to profile tab and keep a friendly message
                setHotel(null);
                setRooms([]);
                setActiveTab('profile');
                setError(err.message || 'No hotel profile found. Create your hotel to get started.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);


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
            const result = await apiUpdateHotel(hotel.id, apiData);
            if (result?.hotel) setHotel(result.hotel);
            setActiveTab('bookings');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create Hotel Profile (when owner has no hotel yet)
    const handleCreateHotel = async (e) => {
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
            const result = await apiCreateHotel(apiData);
            // After creation, fetch the full hotel details belonging to this user
            const createdHotel = await apiGetMyHotel();
            setHotel(createdHotel);
            setRooms(Array.isArray(createdHotel?.rooms) ? createdHotel.rooms : []);
            setActiveTab('rooms');
        } catch (err) {
            setError(err.message || 'Failed to create hotel');
        } finally {
            setLoading(false);
        }
    };

    // Room Management
    const handleSaveRoom = async (savedRoom) => {
        try {
            if (currentRoom && currentRoom.id) {
                const updated = await apiUpdateRoom(hotel.id, currentRoom.id, savedRoom);
                const roomObj = updated?.room || savedRoom;
                setRooms(rooms.map(r => r.id === roomObj.id ? roomObj : r));
            } else {
                const result = await apiCreateRoom(hotel.id, savedRoom);
                const roomObj = result?.room ? result.room : { ...savedRoom, id: result?.roomId || Date.now() };
                setRooms([...rooms, roomObj]);
            }
        } catch (e) {
            alert(e.message || 'Room save failed');
        } finally {
            setCurrentRoom(null);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) return;
        try {
            await apiDeleteRoom(hotel.id, roomId);
            setRooms(rooms.filter(r => r.id !== roomId));
        } catch (e) {
            alert(e.message || 'Failed to delete room');
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
                    style={{ backgroundImage: `url(${hotel?.banner_url || defaultBanner})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6">
                        <div className="flex items-end">
                            <img
                                className="h-32 w-32 md:h-40 md:w-40 rounded-lg object-cover border-4 border-white shadow-lg -mb-10 sm:-mb-12"
                                src={hotel?.image_url || defaultHotelImage}
                                alt="Hotel"
                            />
                            <div className="ml-6 mb-1 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{hotel?.name || 'Your Hotel'}</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{hotel?.location || 'Set your location'}</p>
                            </div>
                        </div>
                        {/* Online/Offline Toggle */}
                        <div className="mt-4 sm:mt-0 sm:mb-2">
                            <button
                                onClick={toggleOnlineStatus}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition shadow-lg ${isOnline
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600'
                                    }`}
                            >
                                {isOnline ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
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
                                {hotel && (
                                    <>
                                        <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'bookings' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Upcoming Bookings</button>
                                        <button onClick={() => setActiveTab('rooms')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'rooms' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Manage Rooms</button>
                                    </>
                                )}
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm ${activeTab === 'profile' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{hotel ? 'Edit Profile' : 'Create Profile'}</button>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">

                            {/* Tab: Upcoming Bookings */}
                            {activeTab === 'bookings' && hotel && (
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
                                    {hotel ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <div className="p-6 border rounded-lg bg-amber-50 text-amber-800">
                                            <p className="font-semibold mb-2">No hotel profile yet.</p>
                                            <p>Create your hotel in the "Create Profile" tab to manage rooms.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Edit Hotel Profile */}
                            {activeTab === 'profile' && (
                                <form onSubmit={hotel ? handleHotelSubmit : handleCreateHotel} className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900">{hotel ? 'Edit Hotel Profile' : 'Create Hotel Profile'}</h2>
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
                                            <label className="block text-sm font-medium text-gray-700">Main Image</label>
                                            {hotel ? (
                                                <HotelImageUploader
                                                    currentUrl={hotelFormData.image_url}
                                                    hotel={hotel}
                                                    onUploaded={(url) => {
                                                        setHotel(prev => ({ ...prev, image_url: url }));
                                                        setHotelFormData(prev => ({ ...prev, image_url: url }));
                                                    }}
                                                />
                                            ) : (
                                                <input type="text" name="image_url" value={hotelFormData.image_url} onChange={handleHotelFormChange} placeholder="Paste URL for now; upload after creating. e.g., https://... or /uploads/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                                        <input type="text" name="amenities" value={hotelFormData.amenities} onChange={handleHotelFormChange} placeholder="e.g., Free WiFi, Pool" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gallery Image URLs (comma-separated)</label>
                                        <input type="text" name="galleryUrls" value={hotelFormData.galleryUrls} onChange={handleHotelFormChange} placeholder="e.g., https://.../img1.jpg, /uploads/hotel-gallery/img2.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700">Upload Gallery Images</label>
                                            <HotelGalleryUploader
                                                hotel={hotel}
                                                currentUrls={Array.isArray(hotel?.galleryUrls) ? hotel.galleryUrls : hotelFormData.galleryUrls.split(',').map(s => s.trim()).filter(Boolean)}
                                                onUploaded={(urls) => {
                                                    // Merge and dedupe up to 5
                                                    const existing = Array.isArray(hotel?.galleryUrls) ? hotel.galleryUrls : hotelFormData.galleryUrls.split(',').map(s => s.trim()).filter(Boolean);
                                                    const merged = [...existing, ...urls].filter(Boolean);
                                                    const unique = Array.from(new Set(merged)).slice(0, 5);
                                                    // Update local state and hotel if present
                                                    setHotelFormData(prev => ({ ...prev, galleryUrls: unique.join(', ') }));
                                                    if (hotel) setHotel(prev => ({ ...prev, galleryUrls: unique }));
                                                }}
                                                onGalleryChange={(list) => {
                                                    const clean = (list || []).filter(Boolean).slice(0, 5);
                                                    setHotelFormData(prev => ({ ...prev, galleryUrls: clean.join(', ') }));
                                                    if (hotel) setHotel(prev => ({ ...prev, galleryUrls: clean }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 disabled:opacity-50">
                                        {loading ? 'Saving...' : (hotel ? 'Save Changes' : 'Create Hotel')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            {/* --- Room Modal --- */}
            {hotel && showRoomModal && (
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