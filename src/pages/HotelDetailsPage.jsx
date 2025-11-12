import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomCard from "../components/cards/RoomCard";
import { FaStar } from "react-icons/fa";
import { apiGetHotelById, apiGetHotelRoomBookingCounts } from "../apiService";
import hotelExterior from "../assets/exterior.jpg";

const allHotelsData = undefined;

const HotelDetailsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [bookingCounts, setBookingCounts] = useState({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiGetHotelById(hotelId)
      .then((data) => {
        if (!isMounted) return;
        setHotel(data);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load hotel details.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  useEffect(() => {
    // Fetch booking counts when dates are set
    const validDates = checkIn && checkOut;
    if (!hotel?.id || !validDates) {
      setBookingCounts({});
      return;
    }
    let isMounted = true;
    apiGetHotelRoomBookingCounts(hotel.id, { startDate: checkIn, endDate: checkOut })
      .then((rows) => {
        if (!isMounted) return;
        const map = {};
        (rows || []).forEach((r) => { map[r.room_id] = r.booking_count; });
        setBookingCounts(map);
      })
      .catch(() => {
        if (!isMounted) return;
        setBookingCounts({});
      });
    return () => { isMounted = false; };
  }, [hotel?.id, checkIn, checkOut]);

  const derivedRooms = useMemo(() => {
    if (!hotel?.rooms) return [];
    const rooms = hotel.rooms.map((r) => ({
      id: r.id,
      image: r.image_url || hotelExterior,
      type: r.type,
      details: r.details,
      perks: Array.isArray(r.perks) ? r.perks : [],
      cancellation: r.cancellation_policy || "",
      price: r.price || 0,
      taxes: r.taxes || 0,
      number_of_rooms: r.number_of_rooms || 1,
    }));
    // If dates selected, filter out fully booked rooms for the range
    if (checkIn && checkOut) {
      return rooms.filter((r) => {
        const booked = bookingCounts[r.id] || 0;
        const remaining = (r.number_of_rooms || 1) - booked;
        return remaining > 0;
      });
    }
    return rooms;
  }, [hotel, bookingCounts, checkIn, checkOut]);

  const minPrice = useMemo(() => {
    if (!derivedRooms.length) return null;
    return derivedRooms.reduce((min, r) => (r.price < min ? r.price : min), derivedRooms[0].price);
  }, [derivedRooms]);

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Loading...</div>;
  }

  if (error || !hotel) {
    return <div className="container mx-auto px-6 py-8">Hotel not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Background Hero */}
      <div className="relative h-72 md:h-80">
        <img
          src={hotelExterior}
          alt="Hotel background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/80" />
      </div>

      <div className="relative -mt-48 md:-mt-40">
        {/* Sticky Booking Bar */}

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 z-40">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {hotel.location}
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                {hotel.name}
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-bold text-amber-600">
                  {minPrice !== null ? `₹${minPrice.toLocaleString()}` : "—"}
                </p>
                <p className="text-xs text-gray-500">+ taxes & fees</p>
              </div>
              <a
                href="#booking"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow hover:opacity-90 transition"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section id="overview" className="container mx-auto px-4 md:px-8 mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {hotel.name}
            </h1>
            <div className="flex items-center mt-3 gap-2">
              {[...Array(hotel.star_rating || 0)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <span className="text-gray-600 text-sm">
                {hotel.reviewsData?.averageRating?.toFixed(1) ?? "—"} · {hotel.reviewsData?.count ?? 0} reviews
              </span>
            </div>
            <p className="text-gray-600 mt-3">{hotel.description}</p>

            {/* Tabs */}
            <div className="mt-6 border-b flex gap-8 text-gray-600 font-medium">
              {["Overview", "Rooms", "Amenities", "Reviews"].map(
                (tab, i) => (
                  <a
                    key={i}
                    href={`#${tab.toLowerCase()}`}
                    className="pb-3 border-b-2 border-transparent hover:border-amber-600 hover:text-amber-600 transition"
                  >
                    {tab}
                  </a>
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
                src={(hotel.image_url || (hotel.galleryUrls && hotel.galleryUrls[0])) || hotelExterior}
                alt="Hotel Exterior"
                className="w-full h-96 object-cover rounded-2xl shadow-md"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <img
                src={(hotel.galleryUrls && hotel.galleryUrls[1]) || hotelExterior}
                alt="Room"
                className="w-full h-44 object-cover rounded-2xl shadow-md"
              />
              <img
                src={(hotel.galleryUrls && hotel.galleryUrls[2]) || hotelExterior}
                alt="Room"
                className="w-full h-44 object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Rooms Section */}
        <section id="rooms" className="container mx-auto px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>
          <div className="space-y-8">
            {derivedRooms.map((room, i) => (
              <RoomCard key={i} room={room} onSelect={(r) => setSelectedRoom(r)} />
            ))}
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="container mx-auto px-4 md:px-8 pb-24">
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <h2 className="text-2xl font-bold mb-4">Book This Hotel</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Selected Room</label>
                <input
                  type="text"
                  value={selectedRoom ? selectedRoom.type : "None"}
                  readOnly
                  className="border rounded p-2 w-full bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedRoom ? `Price per night: ₹${selectedRoom.price.toLocaleString()}` : "Select a room to see price."}
              </div>
              <button
                onClick={() => {
                  if (!(selectedRoom && checkIn && checkOut)) {
                    alert('Please select a room and valid dates.');
                    return;
                  }
                  navigate('/payment', {
                    state: {
                      service_type: 'Hotel',
                      service_id: hotel.id,
                      room_id: selectedRoom.id,
                      start_date: checkIn,
                      end_date: checkOut,
                      num_guests: guests,
                      nightly_price: selectedRoom.price,
                      hotel_name: hotel.name,
                      room_type: selectedRoom.type,
                    }
                  });
                }}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section id="amenities" className="container mx-auto px-4 md:px-8 py-16 bg-white rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold mb-6">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {(hotel.amenities || []).map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <span className="text-gray-700 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="container mx-auto px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold mb-6">Guest Reviews</h2>
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-green-600">
                {hotel.reviewsData?.averageRating?.toFixed(1) ?? "—"}
              </span>
              <p className="text-gray-600">
                {hotel.reviewsData?.count ?? 0} reviews
              </p>
            </div>
            <div className="border-t pt-4 space-y-3 text-gray-700">
              {(hotel.reviewsData?.list || []).length === 0 ? (
                <p>No reviews yet. Be the first to share your experience.</p>
              ) : (
                (hotel.reviewsData?.list || []).map((r) => (
                  <div key={r.id} className="py-3 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {(r.userFirstName || '') + (r.userLastName ? ' ' + r.userLastName : '') || 'Guest'}
                      </p>
                      <p className="text-amber-600 font-semibold">{'★'.repeat(Math.max(1, Math.min(5, Number(r.rating || 0))))}</p>
                    </div>
                    {r.comment ? (
                      <p className="mt-1 text-gray-700 text-sm">{r.comment}</p>
                    ) : null}
                    <p className="mt-1 text-gray-500 text-xs">{r.review_date ? new Date(r.review_date).toLocaleDateString() : ''}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/*
        // Location section commented out per request
        <section id="location" className="container mx-auto px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold mb-6">Location</h2>
          <p className="text-gray-600 mb-4">{hotel.location}</p>
          <iframe
            title="Hotel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9191642630495!2d77.61904507507602!3d12.917726987393809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15be1c82e8ed%3A0x87db22f0443f6f19!2sThe%20Oberoi%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1694862837285!5m2!1sen!2sin"
            className="w-full h-80 rounded-xl border shadow"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
        */}
      </div>
    </div>
  );
};

export default HotelDetailsPage;