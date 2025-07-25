import { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./index.css";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import PropertyDetails from "./components/PropertyDetails";
import ScrollToTop from "./components/ScrollToTop";
import MouseFollower from "./components/MouseFollower";
import StartJourney from "./components/StartJourney";

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
  const [loginSource, setLoginSource] = useState("");

  const handleLoginClick = (source = "") => {
    setLoginSource(source);
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

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
          onLoginClick={handleLoginClick}
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
                    <CallToAction />
                    <StartJourney />
                  </>
                }
              />
              <Route
                path="/buy"
                element={
                  <BuyPage
                    userProperties={userProperties}
                    setUserProperties={setUserProperties}
                    isLoggedIn={isLoggedIn}
                    onLoginClick={() => handleLoginClick("buy")}
                  />
                }
              />
              <Route
                path="/sell"
                element={
                  <SellPage
                    isLoggedIn={isLoggedIn}
                    userName={userName}
                    setUserProperties={setUserProperties}
                    onLoginClick={() => handleLoginClick("sell")}
                    onLoginSuccess={handleLoginSuccess}
                  />
                }
              />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route
                path="*"
                element={
                  <div className="text-center py-20 text-xl font-semibold text-gray-700">
                    404 - Page Not Found
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <LoginModal
          show={showLoginModal}
          onClose={handleLoginClose}
          onLoginSuccess={handleLoginSuccess}
        />

        <MouseFollower />
      </div>
    </Router>
  );
}

export default App;
