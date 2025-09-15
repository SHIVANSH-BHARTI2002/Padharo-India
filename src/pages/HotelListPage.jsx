import React from 'react';
import Navbar from '../components/Navbar';
import HotelSearchBox from '../components/HotelSearchBox';
import HotelCard from '../components/HotelCard';
import './HotelListPage.css';

import mumbaiHero from '../assets/mumbai-hero.jpg';
import hotelRoom from '../assets/hotel-room.jpg';

const HotelListPage = () => {

    const hotels = [
        {
            image: hotelRoom,
            rating: '4.6',
            name: 'HOTEL MUMBAI VALNAI',
            location: 'Malad, Mumbai',
            description: 'Spacious rooms with AC available, outdoor swimming pool, garden, and restaurant.',
            features: ['Free Cancellation', 'Breakfast Available', 'Book on arrival available', 'Free WiFi', '1 bedroom, 2bedroom and 3 bedroom available'],
            price: '5,330'
        },
        {
            image: hotelRoom,
            rating: '4.3',
            name: 'HOTEL MUMBAI VALNAI',
            location: 'Malad, Mumbai',
            description: 'Spacious rooms with AC available, outdoor swimming pool, garden, and restaurant.',
            features: ['Free Cancellation', 'Breakfast Available', 'Book on arrival available', 'Free WiFi'],
            price: '4,800'
        },
        {
            image: hotelRoom,
            rating: '4.8',
            name: 'HOTEL MUMBAI VALNAI',
            location: 'Malad, Mumbai',
            description: 'Spacious rooms with AC available, outdoor swimming pool, garden, and restaurant.',
            features: ['Free Cancellation', 'Breakfast Available', 'Book on arrival available', 'Free WiFi', '1 bedroom, 2bedroom and 3 bedroom available'],
            price: '6,200'
        }
    ];

    return (
        <div className="hotel-list-page">
            <Navbar />

            <header className="hotel-hero-section" style={{ backgroundImage: `url(${mumbaiHero})` }}>
                <HotelSearchBox />
            </header>

            <main className="hotel-list-main">
                <div className="hotel-list-container">
                    {hotels.map((hotel, index) => (
                        <HotelCard key={index} {...hotel} />
                    ))}
                </div>
            </main>

            <footer className="footer">
                <a href="#">About Us</a>
                <a href="#">Contacts</a>
            </footer>
        </div>
    );
};

export default HotelListPage;