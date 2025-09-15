import React from 'react';
import './PlaceCard.css';
// Make sure to have a star-icon.svg in your src/assets folder
import starIcon from '../assets/star-icon.svg';

const PlaceCard = ({ image, rating, title, location, description, price }) => {
    return (
        <div className="place-card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-rating">
                <img src={starIcon} alt="star" /> {rating}
            </div>
            <div className="card-body">
                <div className="card-info">
                    <h3>{title}</h3>
                    <p className="location">{location}</p>
                    <p className="description">{description}</p>
                </div>
                <div className="card-price">
                    <button>Rs. {price}</button>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;