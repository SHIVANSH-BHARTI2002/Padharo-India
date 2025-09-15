import React, { useState } from 'react'; // Import useState
import Navbar from '../components/Navbar';
import SearchBox from '../components/SearchBox';
import PlaceCard from '../components/PlaceCard';
import AuthModal from '../components/AuthModal'; // Import the new modal
import './Home.css';

import heroBackground from '../assets/hero-background.jpg';
import ctaBackground from '../assets/cta-background.jpg';
import tajMahal from '../assets/taj-mahal.png';

const Home = () => {
    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    const places = [
        // (Your existing places array)
        { image: tajMahal, rating: '4.6', title: 'Taj Mahal', location: 'Agra, Uttar Pradesh', description: 'A breathtaking white marble mausoleum, a symbol of eternal love.', price: '2000' },
        { image: tajMahal, rating: '4.5', title: 'Amber Fort', location: 'Jaipur, Rajasthan', description: 'A majestic fort with artistic Hindu style elements.', price: '1500' },
        { image: tajMahal, rating: '4.8', title: 'Golden Temple', location: 'Amritsar, Punjab', description: 'The holiest Gurdwara and a symbol of human brotherhood.', price: '1800' },
        { image: tajMahal, rating: '4.7', title: 'India Gate', location: 'New Delhi, Delhi', description: 'A war memorial dedicated to the soldiers of British India.', price: '1200' },
        { image: tajMahal, rating: '4.4', title: 'Mysore Palace', location: 'Mysore, Karnataka', description: 'A historical palace and the royal residence at Mysore.', price: '1600' },
        { image: tajMahal, rating: '4.9', title: 'Gateway of India', location: 'Mumbai, Maharashtra', description: 'An arch-monument built in the early 20th century.', price: '2200' },
    ];

    return (
        <div className="home-page">
            {/* Pass the function to open the modal to the Navbar */}
            <Navbar onLoginClick={() => setIsModalOpen(true)} />

            {/* Conditionally render the modal */}
            {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}

            <header className="hero-section" style={{ backgroundImage: `url(${heroBackground})` }}>
                <h1>Mysteries of India</h1>
                <SearchBox />
            </header>

            <main>
                <section className="places-section">
                    <h2>Explore the Beautiful</h2>
                    <div className="places-grid">
                        {places.slice(0, 3).map((place, index) => <PlaceCard key={index} {...place} />)}
                    </div>
                </section>

                <section className="places-section">
                    <h2>Lesser-known Wonders</h2>
                    <div className="places-grid">
                        {places.slice(3, 6).map((place, index) => <PlaceCard key={index} {...place} />)}
                    </div>
                </section>

                <section className="cta-section" style={{ backgroundImage: `url(${ctaBackground})` }}>
                    <h4>HIMALAYAN TREKS</h4>
                    <h2>Conquer the Frozen Trails</h2>
                </section>
            </main>

            <footer className="footer">
                <a href="#">About Us</a>
                <a href="#">Contacts</a>
            </footer>
        </div>
    );
};

export default Home;