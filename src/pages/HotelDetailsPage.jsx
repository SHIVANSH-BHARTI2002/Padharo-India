import React from "react";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import {

  FaStar,

  FaSpa,

  FaSwimmer,

  FaDumbbell,

  FaUtensils,

  FaCocktail,

} from "react-icons/fa";


// Import images

import hotelExterior from "../assets/exterior.jpg";

import room1 from "../assets/room1.jpg";

import room2 from "../assets/room2.jpg";


const hotelData = {

  name: "HOTEL MUMBAI VALNAI",

  rating: 4.8,

  starRating: 5,

  description: "A Luxury Hotel on MG Road near Offices and Malls.",

  location: "2.2 km drive to Commercial Street",

  reviews: 2240,

  checkIn: "Tue, 23 Sep 2025",

  checkOut: "Wed, 24 Sep 2025",

  guests: "1 Room, 2 Adults",

  amenities: [

    { name: "Spa", icon: <FaSpa /> },

    { name: "Swimming Pool", icon: <FaSwimmer /> },

    { name: "Gym", icon: <FaDumbbell /> },

    { name: "Restaurant", icon: <FaUtensils /> },

    { name: "Lounge", icon: <FaCocktail /> },

    { name: "Bar", icon: <FaCocktail /> },

  ],

  roomOptions: [

    {

      type: "Room With Free Cancellation",

      image: room2,

      details:

        "342 sq.ft (32 sq.mt) | 1 Queen Bed | 1 Bathroom | Swimming Pool View | Heater",

      price: 4500,

      taxes: 576,

      cancellation: "Free Cancellation before 21 Sep 01:59 PM",

      perks: ["MMTPS Best Available Rate..."],

    },

    {

      type: "Room With Free Cancellation | Breakfast only",

      image: room1,

      details:

        "342 sq.ft (32 sq.mt) | 1 Queen Bed | 1 Bathroom | Swimming Pool View",

      price: 5800,

      taxes: 594,

      cancellation: "Free Cancellation before 21 Sep 01:59 PM",

      perks: ["Free Breakfast"],

    },

    {

      type: "Super Package",

      image: room1,

      details:

        "342 sq.ft (32 sq.mt) | 1 Queen Bed | 1 Bathroom | Swimming Pool View",

      price: 5330,

      taxes: 345,

      cancellation: "Free Cancellation before 21 Sep 01:59 PM",

      perks: [

        "Complimentary One-way Airport Transfer",

        "15% off on Food & Beverage services",

        "15% Off on Laundry service",

        "Breakfast included",

      ],

    },

  ],

};


const HotelDetailsPage = () => {

  return (

    <div className="bg-gray-50 min-h-screen font-sans pt-24">

      {/* Navbar */}

      <Navbar />


      {/* Sticky Booking Bar */}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 z-50">

        <div className="container mx-auto px-6 py-4 flex justify-between items-center">

          <div>

            <p className="text-sm text-gray-500">

              {hotelData.checkIn} – {hotelData.checkOut} | {hotelData.guests}

            </p>

            <h3 className="text-lg font-semibold text-gray-900">

              {hotelData.name}

            </h3>

          </div>

          <div className="flex items-center gap-6">

            <div className="text-right">

              <p className="text-xl font-bold text-blue-600">

                ₹{hotelData.roomOptions[0].price.toLocaleString()}

              </p>

              <p className="text-xs text-gray-500">+ taxes & fees</p>

            </div>

            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:opacity-90 transition">

              Book Now

            </button>

          </div>

        </div>

      </div>


      {/* Hero Section */}

      <section className="container mx-auto px-4 md:px-8 mt-6 relative z-10">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-4xl font-bold text-gray-900">

            {hotelData.name}

          </h1>

          <div className="flex items-center mt-3 gap-2">

            {[...Array(hotelData.starRating)].map((_, i) => (

              <FaStar key={i} className="text-yellow-400" />

            ))}

            <span className="text-gray-600 text-sm">

              {hotelData.rating} · {hotelData.reviews} reviews

            </span>

          </div>

          <p className="text-gray-600 mt-3">{hotelData.description}</p>


          {/* Tabs */}

          <div className="mt-6 border-b flex gap-8 text-gray-600 font-medium">

            {["Overview", "Rooms", "Amenities", "Reviews", "Location"].map(

              (tab, i) => (

                <button

                  key={i}

                  className="pb-3 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 transition"

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

              src={hotelExterior}

              alt="Hotel Exterior"

              className="w-full h-96 object-cover rounded-2xl shadow-md"

            />

          </div>

          <div className="grid grid-rows-2 gap-4">

            <img

              src={room1}

              alt="Room"

              className="w-full h-44 object-cover rounded-2xl shadow-md"

            />

            <img

              src={room2}

              alt="Room"

              className="w-full h-44 object-cover rounded-2xl shadow-md"

            />

          </div>

        </div>

      </section>


      {/* Rooms Section */}

      <section className="container mx-auto px-4 md:px-8 py-16">

        <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>

        <div className="space-y-8">

          {hotelData.roomOptions.map((room, i) => (

            <div

              key={i}

              className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition overflow-hidden"

            >

              <div className="flex flex-col md:flex-row">

                <img

                  src={room.image}

                  alt={room.type}

                  className="w-full md:w-1/3 h-64 object-cover"

                />

                <div className="flex-1 p-6 flex flex-col justify-between">

                  <div>

                    <h3 className="text-xl font-semibold text-gray-900">

                      {room.type}

                    </h3>

                    <p className="text-sm text-gray-500 mt-1">

                      {room.details}

                    </p>

                    <ul className="mt-3 space-y-1 text-sm text-gray-700">

                      {room.perks.map((perk, idx) => (

                        <li key={idx} className="flex items-center gap-2">

                          ✅ {perk}

                        </li>

                      ))}

                    </ul>

                    <p className="mt-3 text-green-600 font-medium text-sm">

                      {room.cancellation}

                    </p>

                  </div>

                  <div className="mt-6 flex justify-between items-end">

                    <div>

                      <p className="text-2xl font-bold text-gray-900">

                        ₹{room.price.toLocaleString()}

                      </p>

                      <p className="text-xs text-gray-500">

                        +₹{room.taxes.toLocaleString()} taxes & fees

                      </p>

                    </div>

                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition">

                      Select

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Amenities */}

      <section className="container mx-auto px-4 md:px-8 py-16 bg-white rounded-2xl shadow-md">

        <h2 className="text-3xl font-bold mb-6">Amenities</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {hotelData.amenities.map((a, i) => (

            <div

              key={i}

              className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"

            >

              <span className="text-blue-600 text-xl">{a.icon}</span>

              <span className="text-gray-700 font-medium">{a.name}</span>

            </div>

          ))}

        </div>

      </section>


      {/* Reviews */}

      <section className="container mx-auto px-4 md:px-8 py-16">

        <h2 className="text-3xl font-bold mb-6">Guest Reviews</h2>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

          <div className="flex items-center gap-3">

            <span className="text-5xl font-bold text-green-600">

              {hotelData.rating}

            </span>

            <p className="text-gray-600">

              Excellent · {hotelData.reviews} reviews

            </p>

          </div>

          <div className="border-t pt-4 space-y-3 text-gray-700">

            <p>“Amazing hospitality and beautiful rooms.” – Ramesh</p>

            <p>“Great food & perfect location near MG Road.” – Priya</p>

          </div>

        </div>

      </section>


      {/* Location */}

      <section className="container mx-auto px-4 md:px-8 py-16">

        <h2 className="text-3xl font-bold mb-6">Location</h2>

        <p className="text-gray-600 mb-4">{hotelData.location}</p>

        <iframe

          title="Hotel Location"

          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9191642630495!2d77.61904507507602!3d12.917726987393809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15be1c82e8ed%3A0x87db22f0443f6f19!2sThe%20Oberoi%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1694862837285!5m2!1sen!2sin"

          className="w-full h-80 rounded-xl border shadow"

          allowFullScreen

          loading="lazy"

        ></iframe>

      </section>


      {/* Footer */}

      <Footer />

    </div>

  );

};


export default HotelDetailsPage; 