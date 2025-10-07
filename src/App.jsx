<<<<<<< HEAD
import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import Home from "./pages/Home.jsx";
import CabsPage from "./pages/CabsPage.jsx";
import PackagesPage from "./pages/PackagesPage.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const { token } = useContext(AuthContext);

  // This effect closes the modal automatically after a successful login
  useEffect(() => {
    if (token) {
      setIsAuthOpen(false);
    }
  }, [token]);


  const handleAuthToggle = () => {
    setIsLoginView(!isLoginView);
  };

  const openLoginModal = () => {
    setIsLoginView(true);
    setIsAuthOpen(true);
  };

  return (
    <BrowserRouter>
      {/* The Navbar needs the onLoginClick prop to open the modal */}
      <Navbar onLoginClick={openLoginModal} />
      
      {isAuthOpen && (
        // This is the new modal overlay with the blur effect
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsAuthOpen(false)}
        >
          <div 
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the form
          >
            {isLoginView ? (
              <LoginForm onToggle={handleAuthToggle} />
            ) : (
              <SignUpForm onToggle={handleAuthToggle} />
            )}
          </div>
        </div>
      )}

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cabs" element={<CabsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Routes>
      </main>
      
      <Footer />
    </BrowserRouter>
=======
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CabsPage from './pages/CabsPage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import GuidesPage from './pages/GuidesPage';
import PackagesPage from './pages/PackagesPage';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer'; // Import the new footer
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <Navbar onLoginClick={() => setIsModalOpen(true)} />
      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cabs" element={<CabsPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:hotelName" element={<HotelDetailsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Routes>
      </main>

      <Footer /> {/* Add the Footer component here */}
    </Router>
>>>>>>> origin/main
  );
}

export default App;