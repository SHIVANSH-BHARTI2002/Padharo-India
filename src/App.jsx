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
import CabDetailsPage from './pages/CabDetailsPage';

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
          <Route path="/cabs/:cabName" element={<CabDetailsPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:hotelName" element={<HotelDetailsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Routes>
      </main>

      <Footer /> {/* Add the Footer component here */}
    </Router>
  );
}

export default App;