import React from "react";
import { FaStar, FaSpa, FaSwimmer, FaDumbbell, FaUtensils, FaCocktail } from "react-icons/fa";

const RoomCard = ({ room }) => {
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
  );
};

export default RoomCard;