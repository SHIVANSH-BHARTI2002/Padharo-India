import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // 🔑 ADDED: Link for back button
import axios from "axios"; // 🔑 ADDED: Axios for API calls
import RoomCard from "../components/cards/RoomCard"; 
import {
  FaStar,
  FaSpa,
  FaSwimmer,
  FaDumbbell,
  FaUtensils,
  FaCocktail,
} from "react-icons/fa";

// Import images (keeping your assets as fallbacks)
import hotelExterior from "../assets/exterior.jpg";
import room1 from "../assets/room1.jpg";
import room2 from "../assets/room2.jpg";

// 🔑 Define Base URL
const API_BASE_URL = 'http://localhost:5000'; 

// 🔑 Define a mapping for Font Awesome icons used in dummy data (used for amenities)
const AMENITY_ICON_MAP = {
    'Spa': FaSpa,
    'Swimming Pool': FaSwimmer,
    'Gym': FaDumbbell,
    'Restaurant': FaUtensils,
    'Bar': FaCocktail,
    'Lounge': FaCocktail,
};

const HotelDetailsPage = () => {
    // 🔑 CRITICAL FIX 1: Get the ID from the URL (the parameter in the route MUST be :id)
    const { id } = useParams(); 
    
    // 🔑 NEW STATE: For fetching real data and managing status
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                // Call the API route: GET /api/hotels/:id
                const res = await axios.get(`${API_BASE_URL}/api/hotels/${id}`);
                setHotelData(res.data);
            } catch (err) {
                console.error('Failed to fetch hotel details:', err);
                setError('Hotel not found or network error.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotelDetails();
        }
    }, [id]);

    // --- Rendering States ---
    if (loading) {
        return <div className="text-center py-20 text-xl font-semibold text-amber-600 flex justify-center items-center">
            <svg className="h-6 w-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.384 4.384m0 15.356A8.001 8.001 0 0019.616 19.616" /></svg>
            Loading hotel details...
        </div>;
    }
    if (error) return <div className="text-center py-20 text-xl font-semibold text-red-600">{error}</div>;
    // Handle the case where the API returns 404
    if (!hotelData) return <div>Hotel not found</div>;

    // --- Data Formatting ---
    // Ensure amenities are safe to map (they come back as a JSON array string or array)
    const safeAmenities = Array.isArray(hotelData.amenities) 
        ? hotelData.amenities 
        : (typeof hotelData.amenities === 'string' ? JSON.parse(hotelData.amenities || '[]') : []);

    // Placeholder data for review/star rating that is NOT in the database yet:
    const tempReviews = 2240; 
    const tempStarRating = 5; 
    const lowestPrice = hotelData.Rooms && hotelData.Rooms.length > 0 ? hotelData.Rooms[0].price : hotelData.min_price;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Background Hero */}
            <div className="relative h-72 md:h-80">
                <img
                    // 🔑 Use hotel_picture from API, fallback to local image
                    src={hotelData.hotel_picture || hotelExterior} 
                    alt={hotelData.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/80" />
            </div>

            <div className="relative -mt-48 md:-mt-40">
            
            {/* 🔑 Sticky Booking Bar (Using real data) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">
                             {/* Dates/Guests are not in API response, using placeholders */}
                            Tue, 23 Sep 2025 – Wed, 24 Sep 2025 | 1 Room, 2 Adults 
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {hotelData.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xl font-bold text-amber-600">
                                {/* Use real lowest price from the hotel object */}
                                ₹{parseFloat(lowestPrice).toLocaleString('en-IN')} 
                            </p>
                            <p className="text-xs text-gray-500">+ taxes & fees</p>
                        </div>
                        <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow hover:opacity-90 transition">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-8 mt-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Back button added for better navigation */}
                    <Link to="/hotels" className="text-amber-600 hover:text-amber-800 font-medium text-sm mb-4 inline-block">
                        &larr; Back to Listings
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">
                        {hotelData.name}
                    </h1>
                    <div className="flex items-center mt-3 gap-2">
                        {/* Star Rating based on TEMP data */}
                        {[...Array(tempStarRating)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                        ))}
                        <span className="text-gray-600 text-sm">
                            {hotelData.rating} · {tempReviews} reviews
                        </span>
                    </div>
                    <p className="text-gray-600 mt-3">{hotelData.description || "No detailed description available."}</p>

                    {/* Tabs */}
                    <div className="mt-6 border-b flex gap-8 text-gray-600 font-medium">
                        {["Overview", "Rooms", "Amenities", "Reviews", "Location"].map(
                            (tab, i) => (
                                <button
                                    key={i}
                                    className="pb-3 border-b-2 border-transparent hover:border-amber-600 hover:text-amber-600 transition"
                                    >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="container mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <img
                            src={hotelData.hotel_picture || hotelExterior}
                            alt="Hotel Exterior"
                            className="w-full h-96 object-cover rounded-2xl shadow-md"
                        />
                    </div>
                    {/* Keeping static room images for gallery since API doesn't provide them */}
                    <div className="grid grid-rows-2 gap-4">
                        <img src={room1} alt="Room" className="w-full h-44 object-cover rounded-2xl shadow-md" />
                        <img src={room2} alt="Room" className="w-full h-44 object-cover rounded-2xl shadow-md" />
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section className="container mx-auto px-4 md:px-8 py-16">
                <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>
                <div className="space-y-8">
                    {/* 🔑 CRITICAL: Use the actual room data from the API response */}
                    {hotelData.Rooms && hotelData.Rooms.length > 0 ? (
                        hotelData.Rooms.map((room, i) => (
                            // RoomCard needs to be updated to accept API props (room_type, price, capacity)
                            // We are passing the structure your RoomCard component expects
                            <RoomCard 
                                key={room.room_id || i} 
                                room={{
                                    type: room.room_type,
                                    image: room1, // Use static image as placeholder
                                    details: `Max ${room.capacity} Guests | Room Number: ${room.room_number || 'N/A'}`,
                                    price: parseFloat(room.price),
                                    taxes: 500, // Placeholder taxes
                                    cancellation: "Free Cancellation available",
                                    perks: room.is_booked ? [] : ["Instant Booking", "Best Available Rate"],
                                }} 
                            />
                        ))
                    ) : (
                        <p className="text-gray-600">No rooms are currently listed for this hotel.</p>
                    )}
                </div>
            </section>

            {/* Amenities */}
            <section className="container mx-auto px-4 md:px-8 py-16 bg-white rounded-2xl shadow-md">
                <h2 className="text-3xl font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* 🔑 Use parsed API data for amenities */}
                    {safeAmenities.length > 0 ? safeAmenities.map((a, i) => {
                        const IconComponent = AMENITY_ICON_MAP[a] || FaStar; // Fallback to FaStar
                        return (
                            <div
                                key={i}
                                className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
                            >
                                <span className="text-amber-600 text-xl"><IconComponent /></span>
                                <span className="text-gray-700 font-medium">{a}</span>
                            </div>
                        );
                    }) : (
                         <p className="text-gray-600">No amenities listed.</p>
                    )}
                </div>
            </section>

            {/* Reviews, Location sections remain largely the same, using API data for rating/location */}
            <section className="container mx-auto px-4 md:px-8 py-16">
                <h2 className="text-3xl font-bold mb-6">Guest Reviews</h2>
                <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-5xl font-bold text-green-600">
                            {hotelData.rating}
                        </span>
                        <p className="text-gray-600">
                            Excellent · {tempReviews} reviews
                        </p>
                    </div>
                    <div className="border-t pt-4 space-y-3 text-gray-700">
                        <p>“Amazing hospitality and beautiful rooms.”</p>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-8 py-16">
                <h2 className="text-3xl font-bold mb-6">Location</h2>
                <p className="text-gray-600 mb-4">{hotelData.address}, {hotelData.city}</p>
                <iframe
                    title="Hotel Location"
                    // Placeholder src is fine for styling
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9191642630495!2d77.61904507507602!3d12.917726987393809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15be1c82e8ed%3A0x87db22f0443f6f19!2sThe%20Oberoi%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1694862837285!5m2!1sen!2sin" 
                    className="w-full h-80 rounded-xl border shadow"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </section>
            </div>
        </div>
    );
};

export default HotelDetailsPage;