import { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./index.css";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";

// Lazy-loaded pages for performance
const Hero = lazy(() => import("./components/Hero"));
const FeaturedProperties = lazy(() => import("./components/FeaturedProperties"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const CallToAction = lazy(() => import("./components/CallToAction"));
const BuyPage = lazy(() => import("./components/BuyPage"));
const SellPage = lazy(() => import("./components/SellPage"));
const RentPage = lazy(() => import("./components/RentPage"));

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userProperties, setUserProperties] = useState([]);

  const handleLoginToggle = () => setShowLoginModal((prev) => !prev);

  return (
    <Router>
      <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
        <Navbar onLoginClick={handleLoginToggle} />

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
                element={
                  <BuyPage
                    userProperties={userProperties}
                    setUserProperties={setUserProperties}
                  />
                }
              />
              <Route
                path="/sell"
                element={<SellPage setUserProperties={setUserProperties} />}
              />
              <Route
                path="/rent"
                element={<RentPage setUserProperties={setUserProperties} />}
              />
              <Route
                path="/contact"
                element={<ContactPage setUserProperties={setUserProperties} />}
              />
              <Route
                path="/about"
                element={<AboutPage setUserProperties={setUserProperties} />}
              />

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

        <LoginModal show={showLoginModal} onClose={handleLoginToggle} />
      </div>
    </Router>
  );
}

export default App;
