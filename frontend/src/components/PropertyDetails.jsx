import React, { useState } from "react";
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
  Mail
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const handleSendMessage = async () => {
  const messagePayload = {
    senderId: "currentUserId", // Replace with actual current user ID
    receiverId: property.ownerId || "ownerId", // Replace with actual property.ownerId
    propertyId: property.id,
    propertyTitle: property.title,
    text: reviewText,
    timestamp: new Date(),
  };

  try {
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messagePayload),
    });

    alert("Message sent to owner.");
    // Optionally navigate to messages page
    // navigate("/messages");
  } catch (error) {
    console.error("Message send error:", error);
    alert("Failed to send message.");
  }
};


  if (!property) {
    return (
      <div className="text-center pt-40 text-xl text-gray-600">
        Property not found.
      </div>
    );
  }

  const images = [property.image, property.image, property.image];

 const similarProperties = [
  {
    id: 2,
    title: "Luxury Apartment",
    price: "PKR 85 Lac",
    location: "Bahria Town, Islamabad",
    latitude: 33.4574,
    longitude: 72.9845,
    type: "For Rent",
    beds: "3 Beds",
    baths: "2 Baths",
    area: "1800 sq ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center",
    views: 1785,
    rating: 4.4,
    yearBuilt: 2021
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    price: "PKR 45 Lac",
    location: "Gulberg, Lahore",
    latitude: 31.5204,
    longitude: 74.3587,
    type: "For Rent",
    beds: "1 Bed",
    baths: "1 Bath",
    area: "850 sq ft",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center",
    views: 960,
    rating: 4.2,
    yearBuilt: 2019
  },
  {
    id: 5,
    title: "Modern Family House",
    price: "PKR 1.2 Crore",
    location: "DHA Phase 6, Karachi",
    latitude: 24.8121,
    longitude: 67.0789,
    type: "For Sale",
    beds: "4 Beds",
    baths: "3 Baths",
    area: "2400 sq ft",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&crop=center",
    views: 2100,
    rating: 4.8,
    yearBuilt: 2022
  }
];


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="bg-gray-50 pt-24 pb-20 px-4 md:px-20 lg:px-32 min-h-screen"
  >

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Section */}
<div className="w-full lg:w-2/3 bg-white shadow-2xl rounded-3xl overflow-hidden relative border-4 border-transparent bg-clip-padding animate-border bg-[linear-gradient(115deg,#fff,#fff),linear-gradient(115deg,#10b981,#0f766e)] bg-origin-border">
  <div className="absolute top-4 right-4 z-10">
    <button
      onClick={() => setLiked(!liked)}
      className={`p-2 rounded-full ${liked ? "bg-red-100 text-red-600" : "bg-white text-gray-600"} hover:scale-110 shadow-md transition-transform duration-300`}
    >
      <Heart className="w-6 h-6" fill={liked ? "red" : "none"} />
    </button>
  </div>

  <div className="relative">
    <Slider {...sliderSettings}>
      {images.map((img, index) => (
        <div key={index} onClick={() => setIsImagePreviewOpen(true)} className="cursor-pointer relative">
          <img src={img} alt="Property" className="w-full h-[500px] object-cover rounded-t-3xl" />
          <div className="absolute top-4 left-4 z-10">
            {(() => {
              const isRent = property.type?.toLowerCase().includes("rent");
              const displayType = isRent ? "For Rent" : "For Sale";
              const badgeColor = isRent ? "bg-blue-600" : "bg-emerald-600";

              return (
                <span className={`text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow font-semibold tracking-wide uppercase ${badgeColor}`}>
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
        <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">PKR</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 group-hover:scale-105 transition-transform duration-300">
          {property.price.replace("PKR", "").trim()}
        </span>
      </div>
    </div>
    <p className="text-gray-600 text-base flex items-center gap-2">
      <MapPin size={18} className="text-emerald-600" />
      {property.location}, {property.city}
    </p>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5 }}
    className="grid grid-cols-2 md:grid-cols-3 gap-4"
  >
    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
      <Bed size={20} className="text-emerald-600" />
      <span className="text-gray-800 font-medium">{property.beds}</span>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
      <Bath size={20} className="text-emerald-600" />
      <span className="text-gray-800 font-medium">{property.baths}</span>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:shadow-md transition">
      <Square size={20} className="text-emerald-600" />
      <span className="text-gray-800 font-medium">{property.area}</span>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="space-y-4"
  >
    <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
      <Info size={20} className="text-emerald-600" /> Description
    </h3>
    <p className="text-gray-700 leading-relaxed text-base">
      {property.description || "This beautifully designed property offers modern amenities and ample space ideal for families or professionals. Close to schools, parks, and shopping centers."}
    </p>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="space-y-4"
  >
    <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
      <ListChecks size={20} className="text-emerald-600" /> Amenities
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-base text-gray-700">
      {(property.amenities || [
        "Car Parking",
        "Gated Community",
        "Air Conditioning",
        "Balcony",
        "24/7 Security",
        "Pet Friendly"
      ]).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 rounded-full" />
          {item}
        </div>
      ))}
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="space-y-4"
  >
    <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
      <Landmark size={20} className="text-emerald-600" /> Property Details
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-base text-gray-700">
      <p><span className="font-medium">Property Type:</span> Apartment</p>
      <p><span className="font-medium">Built Year:</span> {property.builtYear || "2021"}</p>
      <p><span className="font-medium">Furnishing:</span> {property.furnishing || "Fully Furnished"}</p>
      <p><span className="font-medium">Floor:</span> 2</p>
      <p><span className="font-medium">Available From:</span> {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : "30/03/2025"}</p>
      <p><span className="font-medium">Security Deposit:</span> {property.securityDeposit ? `PKR ${property.securityDeposit}` : "PKR 100,000"}</p>
      {property.type?.toLowerCase().includes("rent") && (
        <p><span className="font-medium">Monthly Maintenance:</span> {property.maintenance ? `PKR ${property.maintenance}` : "PKR 5,000"}</p>
      )}
    </div>
  </motion.div>

  {property.nearbyFacilities && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">🏥 Nearby Facilities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-base text-gray-700">
        {(property.nearbyFacilities || [
          "Hospitals",
          "Schools",
          "Shopping Centres"
        ]).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full" /> {item}
          </div>
        ))}
      </div>
    </motion.div>
  )}

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    className="pt-6"
  >
    <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-3">
      🗺️ Location
    </h3>
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <iframe
        title="Property Location"
        className="w-full h-[320px] md:h-[360px] rounded-2xl"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&hl=en&z=18&output=embed`}
      ></iframe>
      <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
        {property.location}, {property.city}
      </div>
    </div>
  </motion.div>
</div>
</div>

<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-full lg:w-[30%] bg-white shadow-2xl rounded-2xl p-6 space-y-5 border border-gray-200 self-start"
>
  <motion.h2
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-xl font-extrabold flex items-center gap-2 text-gray-800"
  >
    <MessageCircleMore className="w-6 h-6 text-emerald-600" />
    Contact Owner
  </motion.h2>

  <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm">
    <img
      src="https://i.pravatar.cc/80"
      alt="Owner"
      className="w-11 h-11 rounded-full border-2 border-emerald-600 shadow-sm"
    />
    <div>
      <p className="text-sm font-semibold text-gray-800">Zainab Rauf</p>
      <p className="text-xs text-emerald-600 font-normal flex items-center gap-1">
        <BadgeCheck size={14} /> Verified Owner
      </p>
    </div>
  </div>

  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="relative"
  >
    <a
      href="tel:+923001234567"
      className="relative z-10 flex items-center justify-center gap-3 bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow hover:bg-green-700 transition-all duration-300 w-full"
    >
      <div className="relative w-7 h-7 flex items-center justify-center">
        <span className="absolute w-full h-full rounded-full border border-white opacity-30 animate-[ping_0.8s_linear_infinite]" />
        <span className="absolute w-full h-full rounded-full border border-white opacity-20 animate-[ping_0.8s_linear_infinite] delay-[150ms]" />
        <span className="absolute w-full h-full rounded-full border border-white opacity-10 animate-[ping_0.8s_linear_infinite] delay-[300ms]" />
        <Phone className="w-4 h-4 text-white fill-white relative z-10" />
      </div>
      Call Now
    </a>
  </motion.div>

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.6 }}
    className="space-y-4"
  >
    {["Name", "Email", "Phone"].map((placeholder, index) => (
      <input
        key={index}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition placeholder-gray-500"
      />
    ))}

    <textarea
      rows="4"
      placeholder="Your message"
      className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition placeholder-gray-500"
    ></textarea>

    <div className="space-y-2">
      <p className="text-sm font-medium">I am a:</p>
      <div className="flex flex-wrap gap-3 text-sm text-gray-700">
        {["Buyer/Tenant", "Agent", "Other"].map((role, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input type="radio" name="userType" className="accent-emerald-600" /> {role}
          </label>
        ))}
      </div>
    </div>

    <label className="flex gap-2 text-sm text-gray-700">
      <input type="checkbox" className="accent-emerald-600" />
      Keep me informed about similar properties.
    </label>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex gap-2 pt-1"
    >
      <button
        onClick={handleSendMessage}
        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm hover:bg-emerald-700 transition duration-300 shadow"
      >
        Send Email
      </button>
      <a
        href={`https://wa.me/92XXXXXXXXXX?text=Hi, I'm interested in your property: ${property.title}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-green-500 text-white py-2.5 rounded-lg text-sm text-center hover:bg-green-600 transition duration-300 shadow"
      >
        WhatsApp
      </a>
    </motion.div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.4 }}
    className="pt-4 border-t border-gray-200"
  >
    <button
      onClick={() => alert("Report submitted. Our team will review this property.")}
      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition duration-300 shadow-sm"
    >
      <Info size={16} className="text-red-500" />
      Report this Property
    </button>
  </motion.div>
</motion.div>
</div>
{/* Image Modal */}
<AnimatePresence>
  {isImagePreviewOpen && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-gray-200">
        {/* Close Button */}
        <button
          onClick={() => setIsImagePreviewOpen(false)}
          className="absolute top-4 right-4 z-10 bg-white text-gray-700 hover:bg-red-600 hover:text-white p-2 rounded-full shadow-lg transition"
        >
          <X size={20} />
        </button>
        {/* Image Side */}
        <div className="w-full lg:w-2/3 bg-gray-50 p-6 sm:p-10 space-y-6 flex flex-col justify-start items-center">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{property.title}</h2>
            <p className="text-lg sm:text-xl font-semibold text-emerald-600">{property.price}</p>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-xl max-h-[550px]">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
        {/* Contact Form Side */}  
<div className="w-full lg:w-1/3 bg-white px-5 sm:px-6 py-6 pt-8 border-t lg:border-t-0 lg:border-l flex flex-col space-y-6 overflow-y-auto">
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <MessageCircleMore className="w-5 h-5 text-emerald-600" />
      Contact Owner
    </h3>

    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 shadow-sm">
      <img
        src="https://i.pravatar.cc/80"
        alt="Owner"
        className="w-10 h-10 rounded-full border-2 border-emerald-600 shadow-sm"
      />
      <div>
        <p className="text-sm font-semibold text-gray-800">Zainab Rauf</p>
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <BadgeCheck size={14} /> Verified Owner
        </p>
      </div>
    </div>

    {/* Call Now button below Verified Owner */}
    <a
      href="tel:+923001234567"
      className="relative z-10 flex items-center justify-center gap-3 bg-green-600 text-white font-semibold py-3 px-5 rounded-xl text-base shadow-lg hover:bg-green-700 transition-all duration-300 w-full"
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <span className="absolute w-full h-full rounded-full border border-white opacity-30 animate-[ping_0.8s_linear_infinite]" />
        <span className="absolute w-full h-full rounded-full border border-white opacity-20 animate-[ping_0.8s_linear_infinite] delay-[150ms]" />
        <span className="absolute w-full h-full rounded-full border border-white opacity-10 animate-[ping_0.8s_linear_infinite] delay-[300ms]" />
        <Phone className="w-5 h-5 text-white fill-white relative z-10" />
      </div>
      <span className="text-[15px] font-semibold tracking-wide">Call Now</span>
    </a>

    <div className="space-y-3 pt-2">
      {["Name", "Email", "Phone"].map((ph, i) => (
        <input
          key={i}
          placeholder={ph}
          className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
      ))}
      <textarea
        rows="3"
        placeholder="Your message"
        className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
      ></textarea>

      <div className="space-y-1">
        <p className="text-sm font-medium">I am a:</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {["Buyer/Tenant", "Agent", "Other"].map((role, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="radio" name="type" className="accent-emerald-600" /> {role}
            </label>
          ))}
        </div>
      </div>

      <label className="flex gap-2 text-sm text-gray-700">
        <input type="checkbox" className="accent-emerald-600" />
        Keep me informed about similar properties.
      </label>

      <div className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2">
          <button
            onClick={handleSendMessage}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm hover:bg-emerald-700 transition duration-300 shadow"
          >
            Send Email
          </button>

          <a
            href={`https://wa.me/92XXXXXXXXXX?text=Hi, I'm interested in your property: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm text-center hover:bg-green-600 transition duration-300 shadow"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

    </motion.div>
  )}
</AnimatePresence>
{/* Similar Properties Section */}
<div className="mt-20">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Similar Properties</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {similarProperties.map((property, index) => (
      <motion.div
        key={property.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
        whileHover={{ y: -8 }}
      >
        {/* Property Image */}
        <div className="relative overflow-hidden h-64">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         
            {/* Top-Left Badge */}
<div className="absolute top-4 left-4">
  <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
    property.type?.toLowerCase().includes("rent")
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700"
  }`}>
    {property.type}
  </span>
</div>













        
          {/* Top-Right Action Icons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors">
              <Heart size={16} />
            </button>
            <button className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        {/* Property Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                {property.title}
              </h3>
              <p className="flex items-center text-gray-600 text-sm">
                <MapPin size={14} className="mr-1 text-emerald-500" />
                {property.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">{property.price}</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-700">
              {property.beds !== "N/A" && (
                <div className="flex items-center gap-1">
                  <Bed size={16} className="text-emerald-500" />
                  <span>{property.beds}</span>
                </div>
              )}
              {property.baths !== "N/A" && (
                <div className="flex items-center gap-1">
                  <Bath size={16} className="text-emerald-500" />
                  <span>{property.baths}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Square size={16} className="text-emerald-500" />
                <span>{property.area}</span>
              </div>
            </div>
            {property.yearBuilt && property.yearBuilt !== "N/A" && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar size={14} />
                <span>{property.yearBuilt}</span>
              </div>
            )}
          </div>
          {/* View Details Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
            className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl py-3 px-6 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            View Details
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    ))}
  </div>
</div>
</motion.div>
  );
};

export default PropertyDetails;    
