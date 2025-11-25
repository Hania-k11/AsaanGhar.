//src/components/PropertyDetails.jsx
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Eye,
  Share2,
  Heart,
  Star,
  ArrowRight,
  X,
  BadgeCheck,
  Flame,
  Clock,
  MessageCircleMore,
  Info,
  ListChecks,
  Landmark,
  Phone,
  Mail,
  User,
  CheckCircle,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from "../context/AuthContext";

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

const processAmenities = (amenities) => {
  // Handle various data formats
  if (!amenities) return [];
  
  let amenitiesList = [];
  
  if (typeof amenities === 'string') {
    // Split by comma and clean up
    amenitiesList = amenities
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0 && item !== 'null' && item !== 'undefined');
  } else if (Array.isArray(amenities)) {
    // If it's already an array
    amenitiesList = amenities.filter(item => item && item.length > 0);
  }
  
  return amenitiesList;
};

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  
  console.log("Amenities data received:", property?.amenities);

  const queryClient = useQueryClient();

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    userType: 'Buyer/Tenant'
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });

  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  // Toast notification function
  const displayToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCopy = async () => {
    try {
      const number = `+92 ${String(property.contact_phone).replace(/^0/, "")}`;
      await navigator.clipboard.writeText(number);
      setCopied(true);
      displayToast("Phone number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      displayToast("Failed to copy phone number", 'error');
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/property/${property.property_id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: property.description || "Check out this beautiful property!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        displayToast("Property link copied to clipboard!");
      }
    } catch (err) {
      console.warn("Share failed:", err);
      displayToast("Failed to share property", 'error');
    }
  };

  useEffect(() => {
    const checkMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const handleClick = (e) => {
    if (!isMobile) {
      e.preventDefault();
      setShowDialog(true);
    }
  };

  useEffect(() => {
    if (property && property.property_id) {
      const viewedKey = `viewed_${property.property_id}`;

      if (!sessionStorage.getItem(viewedKey)) {
        fetch(`/api/property/${property.property_id}/views`, { method: "POST" })
          .then(res => res.json())
          .then(data => console.log("View count incremented:", data))
          .catch(err => console.error("Error incrementing view count:", err));

        sessionStorage.setItem(viewedKey, "true");
      }
    }
  }, [property]);

  // Check if user has already liked this property
  useEffect(() => {
    if (isLoggedIn && property?.property_id) {
      // You would typically fetch this from your API
      // For now, checking localStorage as a fallback
      const likedProperties = JSON.parse(localStorage.getItem(`liked_${userId}`) || '[]');
      setLiked(likedProperties.includes(property.property_id));
    }
  }, [isLoggedIn, property?.property_id, userId]);

  // API function for toggling favorite
    const toggleFavoriteProperty = async ({ userId, propertyId, isCurrentlyLiked }) => {
    try {
      if (isCurrentlyLiked) {
        await axios.delete(`/api/property/favorites/${userId}/${propertyId}`);
        displayToast("Removed from favorites");
      } else {
        await axios.post('/api/property/favorites', { userId, propertyId });
        displayToast("Added to favorites");
      }
      
      // Update localStorage as backup
      const likedProperties = JSON.parse(localStorage.getItem(`liked_${userId}`) || '[]');
      const updatedLiked = isCurrentlyLiked 
        ? likedProperties.filter(id => id !== propertyId)
        : [...likedProperties, propertyId];
      localStorage.setItem(`liked_${userId}`, JSON.stringify(updatedLiked));
      
      // Invalidate queries to update overview
      queryClient.invalidateQueries(['properties']);
      queryClient.invalidateQueries(['favoriteProperties']);
      queryClient.invalidateQueries(['overview']); // ⬅️ ADD THIS
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      displayToast("Failed to update favorites", "error");
    }
  };

  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = async () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      displayToast("Please fill in all required fields", 'error');
      return;
    }

    const messagePayload = {
      senderId: userId || "guest",
      receiverId: property.owner_id || property.contact_name,
      propertyId: property.property_id,
      propertyTitle: property.title,
      senderName: contactForm.name,
      senderEmail: contactForm.email,
      senderPhone: contactForm.phone,
      userType: contactForm.userType,
      text: contactForm.message,
      timestamp: new Date(),
    };

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
      });

      await fetch(`/api/property/${property.property_id}/inquiries`, {
        method: "POST",
      });

      displayToast("Message sent successfully!");
      setContactForm({ name: '', email: '', phone: '', message: '', userType: 'Buyer/Tenant' });
    } catch (error) {
      console.error("Message send error:", error);
      displayToast("Failed to send message", 'error');
    }
  };

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.image, property.image, property.image];

 

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
              showToast.type === 'success' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {showToast.type === 'success' && <CheckCircle size={16} />}
              {showToast.type === 'error' && <X size={16} />}
              {showToast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="bg-gray-50 pt-24 pb-20 px-4 md:px-20 lg:px-32 min-h-screen"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Section */}
          <div className="w-full lg:w-2/3 bg-white shadow-2xl rounded-3xl overflow-hidden relative border border-gray-200">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white text-gray-600 hover:scale-110 shadow-md transition-transform duration-300 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={async () => {
                  if (isLoggedIn) {
                    await toggleFavoriteProperty({
                      userId,
                      propertyId: property.property_id,
                      isCurrentlyLiked: liked,
                    });
                    setLiked(!liked);
                  } else {
                    displayToast("Please login to add favorites", 'error');
                    // navigate('/login');
                  }
                }}
                className={`p-2 rounded-full ${
                  liked ? "bg-red-100 text-red-600" : "bg-white text-gray-600"
                } hover:scale-110 shadow-md transition-transform duration-300`}
              >
                <Heart className="w-5 h-5" fill={liked ? "red" : "none"} />
              </button>
            </div>

            <div className="relative">
              <Slider {...sliderSettings}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setIsImagePreviewOpen(true)}
                    className="cursor-pointer relative"
                  >
                    <img
                      src={img}
                      alt={`Property view ${index + 1}`}
                      className="w-full h-[500px] object-cover rounded-t-3xl"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop";
                      }}
                    />
                    <div className="absolute top-4 left-4 z-10">
                      {(() => {
                        const isRent = property.listing_type_name?.toLowerCase().includes("rent");
                        const displayType = isRent ? "For Rent" : "For Sale";
                        const badgeColor = isRent ? "bg-blue-600" : "bg-emerald-600";

                        return (
                          <span
                            className={`text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow font-semibold tracking-wide uppercase ${badgeColor}`}
                          >
                            {displayType}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="p-10 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="border-b pb-6 border-gray-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 sm:gap-2 bg-emerald-50 px-4 py-2 rounded-full shadow-sm group hover:shadow-md transition">
                    <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                      PKR
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 group-hover:scale-105 transition-transform duration-300">
                      {property.price?.replace("PKR", "").trim() || "Contact for Price"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-base flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  {property.location_name}, {property.location_city || "Pakistan"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {property.bedrooms && (
                  <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
                    <Bed size={20} className="text-emerald-600" />
                    <span className="text-gray-800 font-medium">
                      {property.bedrooms} {Number(property.bedrooms) === 1 ? "bedroom" : "bedrooms"}
                    </span>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
                    <Bath size={20} className="text-emerald-600" />
                    <span className="text-gray-800 font-medium">
                      {property.bathrooms} {Number(property.bathrooms) === 1 ? "bathroom" : "bathrooms"}
                    </span>
                  </div>
                )}

                {property.area_sqft && (
                  <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
                    <Square size={20} className="text-emerald-600" />
                    <span className="text-gray-800 font-medium">
                      {property.area_sqft} sq ft
                    </span>
                  </div>
                )}

                {property.year_built && (
                  <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
                    <Calendar size={20} className="text-emerald-600" />
                    <span className="text-gray-800 font-medium">
                      Built {property.year_built}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Info size={20} className="text-emerald-600" />
                  </div>
                  Description
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {property.description ||
                      "This beautifully designed property offers modern amenities and ample space ideal for families or professionals. Close to schools, parks, and shopping centers."}
                  </p>
                </div>
              </motion.div>

              {/* Amenities Section */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.5 }}
  className="space-y-6"
>
  {(() => {
    const amenitiesList = processAmenities(property.amenities);
    
    // Debug logging - remove in production
    console.log("Raw amenities:", property.amenities);
    console.log("Processed amenities:", amenitiesList);
    
    return amenitiesList.length > 0 ? (
      <>
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ListChecks size={20} className="text-emerald-600" />
          </div>
          Amenities
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-700">
            {amenitiesList.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    ) : null;
  })()}
</motion.div>

              {/* Property Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Landmark size={22} className="text-emerald-600" />
                  </div>
                  Property Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                  <DetailItem
                    label="Property Type"
                    value={property.property_type_name || "Apartment"}
                  />
                  {property.year_built && (
                    <DetailItem
                      label="Built Year"
                      value={property.year_built}
                    />
                  )}
                  {property.furnishing_status_name && (
                    <DetailItem
                      label="Furnishing"
                      value={property.furnishing_status_name}
                    />
                  )}
                  {property.floor && (
                    <DetailItem label="Floor" value={property.floor} />
                  )}
                  {property.available_from && (
                    <DetailItem
                      label="Available From"
                      value={new Date(property.available_from).toLocaleDateString("en-GB")}
                    />
                  )}
                  {property.deposit && (
                    <DetailItem
                      label="Security Deposit"
                      value={`PKR ${property.deposit.toLocaleString()}`}
                    />
                  )}

                  {property.listing_type_name?.toLowerCase().includes("rent") && property.maintenance_fee && (
                    <DetailItem
                      label="Monthly Maintenance"
                      value={`PKR ${property.maintenance_fee.toLocaleString()}`}
                    />
                  )}

                  {property.lease_duration && (
                    <DetailItem
                      label="Minimum Lease Duration"
                      value={property.lease_duration}
                    />
                  )}
                </div>
              </motion.div>

              {/* Nearby Places Section */}
              {property.nearby_places && property.nearby_places.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-2xl">🏥</span>
                    Nearby Places
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-base text-gray-700">
                      {property.nearby_places
                        .split(",")
                        .map((p) => p.trim())
                        .filter(item => item.length > 0)
                        .map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Location Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-2xl">🗺️</span>
                  Location
                </h3>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                  <iframe
                    title="Property Location"
                    className="w-full h-[400px] md:h-[450px]"
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${property.latitude || 24.8607},${property.longitude || 67.0011}&hl=en&z=18&output=embed`}
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    {property.location_name}, {property.location_city || "Pakistan"}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-[30%] bg-white shadow-2xl rounded-2xl p-6 space-y-5 border border-gray-200 self-start sticky top-24"
          >
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl font-extrabold flex items-center gap-2 text-gray-800"
            >
              <MessageCircleMore className="w-6 h-6 text-emerald-600" />
              Contact Info
            </motion.h2>

            <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {property.contact_name || "Property Owner"}
                </p>
                <p className="text-xs text-emerald-600 font-normal flex items-center gap-1">
                  <BadgeCheck size={14} /> Verified Contact
                </p>
              </div>
            </div>

            {/* Phone Contact */}
            {property.pref_phone === 1 && property.contact_phone && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
              >
                <a
                  href={`tel:+92${String(property.contact_phone).replace(/^0/, "")}`}
                  onClick={handleClick}
                  className="relative z-10 flex items-center justify-center gap-3 bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow hover:bg-green-700 transition-all duration-300 w-full"
                >
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <span className="absolute w-full h-full rounded-full border border-white opacity-30 animate-[ping_0.8s_linear_infinite]" />
                    <Phone className="w-4 h-4 text-white fill-white relative z-10" />
                  </div>
                  Call Now
                </a>
              </motion.div>
            )}

            {/* Email Contact Form */}
            {property.pref_email === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={contactForm.name}
                  onChange={(e) => handleContactFormChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-500"
                  required
                />

                <input
                  type="email"
                  placeholder="Your Email *"
                  value={contactForm.email}
                  onChange={(e) => handleContactFormChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-500"
                  required
                />

                <input
                  type="tel"
                  placeholder="Your Phone (Optional)"
                  value={contactForm.phone}
                  onChange={(e) => handleContactFormChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-500"
                />

                <textarea
                  rows="4"
                  placeholder="Your message *"
                  value={contactForm.message}
                  onChange={(e) => handleContactFormChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition placeholder-gray-500 resize-none"
                  required
                ></textarea>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">I am a:</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    {["Buyer/Tenant", "Agent", "Other"].map((role, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="userType"
                          value={role}
                          checked={contactForm.userType === role}
                          onChange={(e) => handleContactFormChange('userType', e.target.value)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessage}
                  disabled={!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow font-medium"
                >
                  Send Message
                </motion.button>
              </motion.div>
            )}

            {/* WhatsApp Contact */}
            {property.pref_whatsapp === 1 && (property.contact_whatsapp || property.contact_phone) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="pt-4 border-t border-gray-200"
              >
                <a
                  href={`https://wa.me/92${String(
                    (property.contact_whatsapp || property.contact_phone).replace(/^0/, "")
                  )}?text=Hi, I'm interested in your property: ${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition duration-300 shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                  </svg>
                  WhatsApp
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Phone Call Dialog */}
        <AnimatePresence>
          {showDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
              onClick={() => setShowDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowDialog(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Call from Desktop
                  </h2>
                  <p className="text-sm text-gray-600">
                    Desktop calls aren't supported. Please dial this number manually:
                  </p>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                    <div className="text-lg font-bold text-green-700 font-mono">
                      +92 {String(property.contact_phone).replace(/^0/, "")}
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      copied 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {copied ? "✓ Copied!" : "Copy Number"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {isImagePreviewOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsImagePreviewOpen(false)}
                  className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={property.image}
                  alt="Property Preview"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop";
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

       
      </motion.div>
    </>
  );
};

export default PropertyDetails;