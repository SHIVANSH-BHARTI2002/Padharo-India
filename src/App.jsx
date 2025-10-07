import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import Home from "./pages/Home.jsx";
import CabsPage from "./pages/CabsPage.jsx";
import HotelListPage from "./pages/HotelListPage.jsx";
import HotelDetailsPage from "./pages/HotelDetailsPage.jsx";
import GuidesPage from "./pages/GuidesPage.jsx";
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

      <main className="main-content pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cabs" element={<CabsPage />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/hotels/:hotelName" element={<HotelDetailsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Routes>
      </main>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;