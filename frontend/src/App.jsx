// Updated App.jsx
import { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./index.css";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import PropertyDetails from "./components/PropertyDetails";
import ScrollToTop from "./components/ScrollToTop";


const Hero = lazy(() => import("./components/Hero"));
const FeaturedProperties = lazy(() => import("./components/FeaturedProperties"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const CallToAction = lazy(() => import("./components/CallToAction"));
const BuyPage = lazy(() => import("./components/BuyPage"));
const SellPage = lazy(() => import("./components/SellPage"));


function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLoginToggle = () => setShowLoginModal((prev) => !prev);

  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
        <Navbar
          onLoginClick={handleLoginToggle}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={handleLogout}
        />

        <main className="flex-grow">
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
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
              <Route
                path="/buy"
                element={<BuyPage userProperties={userProperties} setUserProperties={setUserProperties} />}
              />
              <Route
                path="/sell"
                element={isLoggedIn ? <SellPage setUserProperties={setUserProperties} /> : <Navigate to="/" replace />}
              />
              
              <Route path="/contact" element={<ContactPage setUserProperties={setUserProperties} />} />
              <Route path="/about" element={<AboutPage setUserProperties={setUserProperties} />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route
                path="*"
                element={<div className="text-center py-20 text-xl font-semibold text-gray-700">404 - Page Not Found</div>}
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <LoginModal
          show={showLoginModal}
          onClose={handleLoginToggle}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
