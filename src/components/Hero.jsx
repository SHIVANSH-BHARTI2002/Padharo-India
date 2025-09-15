// src/components/Hero.jsx

import React from 'react';

const Hero = () => {
    const handleExplore = () => {
        alert('Exploring all destinations!');
    };

    const handleBookingType = (type) => {
        alert(`Switched to ${type} booking.`);
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Mysteries of India</h1>
                <p className="scroll-down">SCROLL DOWN</p>
            </div>
            <div className="booking-form">
                <div className="form-tabs">
                    <button onClick={() => handleBookingType('Flights')}>Flights</button>
                    <button className="active" onClick={() => handleBookingType('Hotel')}>Hotel</button>
                    <button onClick={() => handleBookingType('Adventure')}>Adventure</button>
                </div>
                <div className="form-inputs">
                    <select name="destination">
                        <option value="">Destination</option>
                        <option value="delhi">Delhi</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="jaipur">Jaipur</option>
                    </select>
                    <select name="articles">
                        <option value="">Articles</option>
                        <option value="guides">Travel Guides</option>
                        <option value="tips">Tips & Tricks</option>
                    </select>
                    <select name="support">
                        <option value="">Support</option>
                        <option value="faq">FAQ</option>
                        <option value="contact">Contact Us</option>
                    </select>
                    <button className="explore-btn" onClick={handleExplore}>Explore All</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;