import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProperties from "./components/FeaturedProperties";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./index.css";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default App;


