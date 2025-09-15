// src/components/Destinations.jsx

import React from 'react';
import tajMahalImg from '../assets/tajmahal.jpg';
import hawaMahalImg from '../assets/hawa-mahal.jpg';
import goldenTempleImg from '../assets/golden-temple.jpg';

const DestinationCard = ({ image, rating, title, location }) => (
    <div className="destination-card">
        <img src={image} alt={title} />
        <div className="card-rating">{rating}</div>
        <div className="card-info">
            <h3>{title}</h3>
            <p>{location}</p>
        </div>
    </div>
);

const Destinations = () => {
    return (
        <section className="destinations">
            <h2>Explore the beautiful</h2>
            <div className="destinations-grid">
                <DestinationCard
                    image={tajMahalImg}
                    rating="4.8"
                    title="The Taj Mahal"
                    location="AGRA, INDIA"
                />
                <DestinationCard
                    image={hawaMahalImg}
                    rating="4.7"
                    title="Hawa Mahal"
                    location="JAIPUR, INDIA"
                />
                <DestinationCard
                    image={goldenTempleImg}
                    rating="4.9"
                    title="The Golden Temple"
                    location="AMRITSAR, INDIA"
                />
            </div>
        </section>
    );
};

export default Destinations;