import React from 'react';
import './HotelSearchBox.css';
import searchIcon from '../assets/search-icon.svg';

const HotelSearchBox = () => {
    return (
        <div className="hotel-search-container">
            <div className="hotel-search-input-wrapper">
                <img src={searchIcon} alt="Search" className="hotel-search-icon" />
                <input type="text" placeholder="Place of Stay" />
            </div>
            <div className="hotel-search-filters">
                <input type="text" placeholder="Start Date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
                <input type="text" placeholder="End Date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
                <select>
                    <option>Sort by</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                </select>
                <button>Explore</button>
            </div>
        </div>
    );
};

export default HotelSearchBox;