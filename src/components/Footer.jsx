import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // We will create this new CSS file

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-logo">Padharo INDIA</h2>
                    <p>
                        Explore the mysteries and wonders of India with us. Your next adventure is just a click away.
                    </p>
                    <div className="socials">
                        {/* Add links to your social media profiles */}
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/cabs">Cabs</Link></li>
                        <li><Link to="/hotels">Hotels</Link></li>
                        <li><Link to="/guides">Guides</Link></li>
                        <li><Link to="/packages">Packages</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-form">
                    <h3>Contact Us</h3>
                    <form>
                        <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
                        <textarea rows="3" name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
                        <button type="submit" className="btn btn-primary">
                            Send
                        </button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} padharoindia.com | Designed with ❤️
            </div>
        </footer>
    );
};

export default Footer;