import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bath,
  Bed,
  Square,
  X,
  BadgeCheck,
  Flame,
  Clock,
  Heart,
  ArrowRight,
  MessageCircleMore,
  Info,
  ListChecks,
  Landmark,
  Phone,
  Mail,
  Star
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
      type: "For Rent",
      beds: "3 Beds",
      baths: "2 Baths",
      area: "1800 sq ft",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Cozy Studio Apartment",
      price: "PKR 45 Lac",
      location: "Gulberg, Lahore",
      type: "For Rent",
      beds: "1 Bed",
      baths: "1 Bath",
      area: "850 sq ft",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      title: "Modern Family House",
      price: "PKR 1.2 Crore",
      location: "DHA Phase 6, Karachi",
      type: "For Sale",
      beds: "4 Beds",
      baths: "3 Baths",
      area: "2400 sq ft",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&crop=center",
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
    <div className="bg-gray-50 pt-24 pb-20 px-4 md:px-20 lg:px-32 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full ${liked ? "bg-red-100 text-red-600" : "bg-white text-gray-600"} hover:scale-110 shadow-md`}
            >
              <Heart className="w-6 h-6" fill={liked ? "red" : "none"} />
            </button>
          </div>

          <div className="relative">
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <div key={index} onClick={() => setIsImagePreviewOpen(true)} className="cursor-pointer">
                  <img src={img} alt="Property" className="w-full h-[500px] object-cover" />
                </div>
              ))}
            </Slider>

            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} /> Featured
              </span>
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Flame size={12} /> Hot
              </span>
              <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <BadgeCheck size={12} /> Verified
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                {property.title}
              </h1>
              <span className={`ml-4 text-sm font-semibold text-white px-3 py-1 rounded-full ${property.type === "For Rent" ? "bg-sky-800" : "bg-emerald-800"}`}>
                {property.type}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={16} /> {property.location}
            </div>
            <p className="text-3xl font-bold text-emerald-600">{property.price}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-700"><Bed size={18} /> {property.beds}</div>
              <div className="flex items-center gap-2 text-gray-700"><Bath size={18} /> {property.baths}</div>
              <div className="flex items-center gap-2 text-gray-700"><Square size={18} /> {property.area}</div>
            </div>

            <div className="text-gray-700 space-y-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2"><Info size={20} /> Description</h3>
                <p>This beautifully designed property offers modern amenities and ample space ideal for families or professionals. Close to schools, parks, and shopping centers.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2"><ListChecks size={20} /> Amenities</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Car Parking</li>
                  <li>24/7 Security</li>
                  <li>Balcony</li>
                  <li>Internet</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2"><Landmark size={20} /> Details</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Built Year: 2021</li>
                  <li>Floors: 2</li>
                  <li>Furnished: Yes</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">🗺️ Location</h3>
              <iframe
                className="w-full h-64 rounded-xl border"
                loading="lazy"
                allowFullScreen
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18..."
              ></iframe>
            </div>
          </div>
        </div>

      {/* Right Contact Card */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-full lg:w-1/3 bg-white shadow-2xl rounded-3xl p-6 space-y-6 border border-gray-200 self-start"
>
  {/* Heading */}
  <motion.h2
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-xl font-semibold flex items-center gap-2 text-gray-800"
  >
    <MessageCircleMore className="w-5 h-5 text-emerald-600" />
    Contact Owner
  </motion.h2>

  {/* Owner Card */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 shadow-sm"
  >
    <img
      src="https://i.pravatar.cc/80"
      alt="Owner"
      className="w-12 h-12 rounded-full border-2 border-emerald-600 shadow"
    />
    <div>
      <p className="text-sm font-semibold text-gray-800">Zainab Rauf</p>
      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
        <BadgeCheck size={14} /> Verified Owner
      </p>
    </div>
  </motion.div>

  {/* Contact Inputs */}
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
        className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition duration-300"
      />
    ))}

    <textarea
      rows="3"
      placeholder="Your message"
      className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition duration-300"
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
    ></textarea>

    {/* User Type */}
    <div className="space-y-1">
      <p className="text-sm font-medium">I am a:</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        {["Buyer/Tenant", "Agent", "Other"].map((role, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input type="radio" name="userType" className="accent-emerald-600" /> {role}
          </label>
        ))}
      </div>
    </div>

    {/* Notification */}
    <label className="flex gap-2 text-sm text-gray-700">
      <input type="checkbox" className="accent-emerald-600" />
      Keep me informed about similar properties.
    </label>

    {/* Buttons */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex gap-2 pt-2"
    >
      <button
  onClick={handleSendMessage}
  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm hover:bg-emerald-700 transition duration-300 shadow"
>
  Send Message
</button>

      <a
        href={`https://wa.me/92XXXXXXXXXX?text=Hi, I'm interested in your property: ${property.title}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm text-center hover:bg-green-600 transition duration-300 shadow"
      >
        WhatsApp
      </a>
    </motion.div>
  </motion.div>

  {/* Report */}
  {/* Report Section */}
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

            <div className="space-y-3 pb-2">
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

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm hover:bg-emerald-700 transition shadow-sm"
                >
                  Send Message
                </button>

                <a
                  href={`https://wa.me/92XXXXXXXXXX?text=Hi, I'm interested in your property: ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm text-center hover:bg-green-600 transition shadow-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>




      {/* Similar Properties */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Similar Properties</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {similarProperties.map((property) => (
            <motion.div
              key={property.id}
              className="bg-white rounded-xl p-4 shadow-md border flex flex-col justify-between"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded-lg mb-3" />
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold truncate">{property.title}</h2>
                <p className="text-emerald-600 font-bold">{property.price}</p>
              </div>
              <p className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={14} className="mr-1" /> {property.location}
              </p>
              <div className="flex justify-between text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-1"><Bed size={14} /> {property.beds}</div>
                <div className="flex items-center gap-1"><Bath size={14} /> {property.baths}</div>
                <div className="flex items-center gap-1"><Square size={14} /> {property.area}</div>
              </div>
              <button
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                className="mt-auto bg-green-100 text-green-800 font-semibold rounded-lg py-2 w-full border border-green-500 hover:bg-green-200 flex items-center justify-center gap-2 transition-all"
              >
                View Details <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
