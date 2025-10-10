import React from "react";
// Removed unused FaStar, FaSpa, etc. icons since they aren't used in the component body
// import { FaStar, FaSpa, FaSwimmer, FaDumbbell, FaUtensils, FaCocktail } from "react-icons/fa"; 

// 🔑 MODIFICATION 1: Destructure and provide default props for safety
const RoomCard = ({ 
    room = { 
        image: '', 
        type: 'Standard Room', 
        details: 'No details available.', 
        price: 0, 
        taxes: 0, 
        cancellation: 'No cancellation policy.', 
        perks: [] // CRITICAL: Ensure perks defaults to an empty array
    } 
}) => {
    // 🔑 MODIFICATION 2: Ensure price and taxes are handled as numbers
    const safePrice = parseFloat(room.price) || 0;
    const safeTaxes = parseFloat(room.taxes) || 0;
    const safePerks = Array.isArray(room.perks) ? room.perks : [];

    return (
        <div className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition overflow-hidden">
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
                        {/* 🔑 Use safePerks to prevent map() on undefined */}
                        <ul className="mt-3 space-y-1 text-sm text-gray-700">
                            {safePerks.map((perk, idx) => (
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
                                {/* 🔑 Use safePrice and format for INR */}
                                ₹{safePrice.toLocaleString('en-IN')} 
                            </p>
                            <p className="text-xs text-gray-500">
                                {/* 🔑 Use safeTaxes and format for INR */}
                                +₹{safeTaxes.toLocaleString('en-IN')} taxes & fees
                            </p>
                        </div>
                        {/* 🔑 MODIFICATION 3: Change button color to match site's theme (amber/orange) */}
                        <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:opacity-90 transition">
                            Select
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;