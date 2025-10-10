import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CabsPage from "./pages/CabsPage.jsx";
import CabDetailsPage from "./pages/CabDetailsPage.jsx";
import HotelListPage from "./pages/HotelListPage.jsx";
import HotelDetailsPage from "./pages/HotelDetailsPage.jsx";
import GuidesPage from "./pages/GuidesPage.jsx";
import GuideDetailsPage from "./pages/GuideDetailsPage.jsx";
import PackagesPage from "./pages/PackagesPage.jsx";
import AuthPage from "./pages/AuthPage.jsx"; // ✅ Unified Auth Modal
import { AuthContext } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { token } = useContext(AuthContext);

  // ✅ Automatically close auth modal after successful login
  useEffect(() => {
    if (token) setIsAuthOpen(false);
  }, [token]);

  const openLoginModal = () => {
    setIsAuthOpen(true);
  };

  return (
    <Router>
      {/* ✅ Navbar with login trigger */}
      <Navbar onLoginClick={openLoginModal} />

      {/* ✅ Auth Modal */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsAuthOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <AuthPage /> {/* ✅ Handles Login, Signup, and OTP */}
          </div>
        </div>
      )}

      {/* ✅ Routes */}
      <main className="main-content pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cabs" element={<CabsPage />} />
          <Route path="/cabs/:cabName" element={<CabDetailsPage />} /> {/* ✅ Added */}
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:hotelName" element={<HotelDetailsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:guideId" element={<GuideDetailsPage />} /> {/* ✅ Added */}
          <Route path="/packages" element={<PackagesPage />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
