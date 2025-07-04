import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import BuyPage from "./components/BuyPage";
import "./index.css";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Router>
      <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeaturedProperties />
                <HowItWorks />
                <Testimonials />
                <CallToAction />
              </>
            }
          />
          <Route path="/buy" element={<BuyPage />} />
        </Routes>
        <Footer />
        <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    </Router>
  );
}

export default App;
