import {  Suspense, lazy } from "react";
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
import { AuthProvider } from "./context/AuthContext";
import ReactDOM from "react-dom/client";
import { useContext, useState } from 'react'
import { AuthContext } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import MyProfile from "./components/MyProfile";



const Hero = lazy(() => import("./components/Hero"));
const FeaturedProperties = lazy(() =>
  import("./components/FeaturedProperties")
);
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const CallToAction = lazy(() => import("./components/CallToAction"));
const BuyPage = lazy(() => import("./components/BuyPage"));
const SellPage = lazy(() => import("./components/SellPage"));

function App() {


 const state = useContext(AuthContext)
  // console.log("Contextyy", state)
  const { userDetails } = useAuth();
  console.log("User Details:", userDetails);

  return (

     <AuthProvider>
        
         
         
      
    <Router>
      <ScrollToTop />
      <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Suspense
            fallback={<div className="text-center py-10">Loading...</div>}
          >
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
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/sell" element={<SellPage />} />
              
             
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
              <Route path="/my-profile" element={<MyProfile />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <LoginModal />

        <MouseFollower />
      </div>
    </Router>
      </AuthProvider>
  );
}

export default App;
