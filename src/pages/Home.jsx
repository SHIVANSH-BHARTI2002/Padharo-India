import React from 'react';
// Remove Navbar and AuthModal imports as they are now in App.jsx
import SearchBox from '../components/SearchBox';
import PlaceCard from '../components/PlaceCard';
import './Home.css';

// ... (keep the rest of your imports)
import heroBackground from '../assets/hero-background.jpg';
import ctaBackground from '../assets/cta-background.jpg';
import fort from '../assets/fort.jpg';
import tajMahal from '../assets/taj-mahal.png';

const Home = () => {
    // Remove the isModalOpen state and related functions

    const places = [
        { image: tajMahal, rating: '4.6', title: 'Taj Mahal', location: 'Agra, Uttar Pradesh', description: 'A breathtaking white marble mausoleum, a symbol of eternal love.', price: '2000' },
        { image: fort, rating: '4.5', title: 'Amber Fort', location: 'Jaipur, Rajasthan', description: 'A majestic fort with artistic Hindu style elements.', price: '1500' },
        { image: tajMahal, rating: '4.8', title: 'Golden Temple', location: 'Amritsar, Punjab', description: 'The holiest Gurdwara and a symbol of human brotherhood.', price: '1800' },
        { image: tajMahal, rating: '4.7', title: 'India Gate', location: 'New Delhi, Delhi', description: 'A war memorial dedicated to the soldiers of British India.', price: '1200' },
        { image: tajMahal, rating: '4.4', title: 'Mysore Palace', location: 'Mysore, Karnataka', description: 'A historical palace and the royal residence at Mysore.', price: '1600' },
        { image: tajMahal, rating: '4.9', title: 'Gateway of India', location: 'Mumbai, Maharashtra', description: 'An arch-monument built in the early 20th century.', price: '2200' },
    ];

    return (
        <div className="home-page">
            {/* The Navbar is no longer rendered here */}
            {/* The AuthModal is no longer rendered here */}
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