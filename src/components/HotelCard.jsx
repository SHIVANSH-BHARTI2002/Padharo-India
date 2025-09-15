import React from 'react';
import './HotelCard.css';
import starIcon from '../assets/star-icon.svg';

const HotelCard = ({ image, rating, name, location, description, features, price }) => {
    return (
        <div className="hotel-card">
            <img src={image} alt={name} className="hotel-card-image" />
            <div className="hotel-card-details">
                <div className="hotel-card-header">
                    <h2>{name}</h2>
                    <div className="hotel-card-rating">
                        <img src={starIcon} alt="star" /> {rating}
                    </div>
                </div>
                <p className="hotel-card-location">{location}</p>
                <p className="hotel-card-description">{description}</p>
                <ul className="hotel-card-features">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <div className="hotel-card-footer">
                    <div className="hotel-card-price">
                        Starting at
                        <span>₹{price}</span>/night
                    </div>
                    <button className="add-to-bucket-btn">Add To Bucket</button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;