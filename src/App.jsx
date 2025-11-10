/* === Filename: src/App.jsx === */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CabsPage from './pages/CabsPage';
import CabDetailsPage from './pages/CabDetailsPage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailsPage from './pages/GuideDetailsPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import DriverProfilePage from './pages/DriverProfilePage';
import GuideDashboard from './pages/GuideDashboard'; 
import HotelDashboard from './pages/HotelDashboard';
// --- NEW IMPORT ---
import AdminDashboard from './pages/AdminDashboard';
// --- END NEW IMPORT ---
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, you would wrap the dashboard routes in a
  // <ProtectedRoute> component that checks auth context.

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
          <Route path="/guides/:guideId" element={<GuideDetailsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:packageId" element={<PackageDetailsPage />} />
          
          {/* User Profile & Dashboards */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/driver-profile" element={<DriverProfilePage />} />
          <Route path="/dashboard/guide" element={<GuideDashboard />} />
          <Route path="/dashboard/hotel" element={<HotelDashboard />} />
          
          {/* --- NEW ROUTE --- */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* --- END NEW ROUTE --- */}
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;