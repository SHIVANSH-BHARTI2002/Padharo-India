import React from 'react';
import './SearchBox.css';
// Make sure to have a search-icon.svg in your src/assets folder
import searchIcon from '../assets/search-icon.svg';

const SearchBox = () => {
    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <img src={searchIcon} alt="Search" className="search-icon" />
                <input type="text" placeholder="where you want to go?" />
            </div>
            <div className="search-filters">
                <select>
                    <option>Date</option>
                </select>
                <select>
                    <option>Service</option>
                </select>
                <select>
                    <option>Sort by</option>
                </select>
                <button>Explore</button>
            </div>
        </div>
    );
};

export default SearchBox;