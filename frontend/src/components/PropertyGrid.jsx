// src/components/PropertyGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, ArrowRight, Heart, Share2, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyGrid = ({ properties, viewMode, likedProperties, toggleLike }) => {
  const navigate = useNavigate();

  // Function to handle sharing
  const handleShare = (e, property) => {
    e.stopPropagation(); // Prevent triggering parent click events
    const shareUrl = `${window.location.origin}/property/${property.property_id}`;

    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: property.description || "Check out this property!",
          url: shareUrl,
        })
        .catch((err) => console.error("Share failed", err));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Property link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
    }
  };

  return (
    <motion.div
      key={viewMode}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "space-y-6"
      }
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
            viewMode === "list" ? "flex gap-6" : ""
          }`}
          whileHover={{ y: -8 }}
          onClick={() => navigate(`/property/${property.property_id}`, { state: { property } })}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              viewMode === "list" ? "w-80 h-64" : "h-64"
            }`}
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 left-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  property.listing_type_name === "sale"
                    ? "bg-emerald-500/90 text-white"
                    : "bg-blue-500/90 text-white"
                }`}
              >
                For {property.listing_type_name === "sale" ? "Sale" : "Rent"}
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(property.property_id);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  likedProperties.has(property.property_id)
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart
                  size={16}
                  fill={likedProperties.has(property.property_id) ? "currentColor" : "none"}
                />
              </motion.button>

              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleShare(e, property)}
                className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                <Share2 size={16} />
              </motion.button>
            </div>
          </div>

          {/* Details */}
          <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
            <div className="flex justify-between items-start mb-3" >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {property.title}
                </h3>
                <p className="flex items-center text-gray-600 text-sm">
                  <MapPin size={14} className="mr-1 text-emerald-500" />
                  {property.location_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{property.price}</p>
                {/* <div className="flex items-center gap-1 mt-1">
                  <Star
                    size={12}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                  <span className="text-sm text-gray-600">{property.rating}</span>
                </div> */}
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-700">
                {property.beds !== "N/A" && (
                  <div className="flex items-center gap-1">
                    <Bed size={16} className="text-emerald-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.baths !== "N/A" && (
                  <div className="flex items-center gap-1">
                    <Bath size={16} className="text-emerald-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Square size={16} className="text-emerald-500" />
                  <span>{property.area_sqft}</span>
                </div>
              </div>

              {property.yearBuilt && property.yearBuilt !== "N/A" && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{property.year_built}</span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/property/${property.property_id}`, { state: { property } });
              }}
              className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl py-3 px-6 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              View Details
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;
