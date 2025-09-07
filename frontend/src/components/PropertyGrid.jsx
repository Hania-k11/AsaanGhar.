// src/components/PropertyGrid.jsx
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  Heart,
  Share2,
  Calendar,
  Star,
  Edit3,
  Trash2,
  MoreVertical,
  Check,
  Clock,
  CheckCircle,
  PauseCircle,
  ChevronDown,
  Eye, 
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to get the status icon
const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return <Clock className="w-4 h-4 text-emerald-500" />;
    case "sold":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "paused":
      return <PauseCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

// Helper function to get the status color
const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900";
    case "sold":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900";
    case "paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

const PropertyGrid = ({
  properties,
  viewMode,
  likedProperties,
  toggleLike,
  isOwner = false,
  onDelete,
  onEdit,
  onChangeStatus,
}) => {
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

  const StatusDropdown = ({ property, onChangeStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statuses = ["active", "paused", "sold"];

    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-colors border ${getStatusColor(
            property.status
          )}`}
        >
          {getStatusIcon(property.status)}
          <span className="hidden xs:inline">
            {property.status.charAt(0).toUpperCase() +
              property.status.slice(1)}
          </span>
          <ChevronDown
            size={12}
            className={`transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeStatus(property.property_id, status);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    {getStatusIcon(status)}
                    <span className="capitalize">{status}</span>
                  </span>
                  {property.status === status && (
                    <Check size={14} className="text-emerald-500" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
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
          className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
            viewMode === "list" ? "flex flex-col sm:flex-row gap-0 sm:gap-6" : ""
          }`}
          whileHover={{ y: viewMode === "grid" && !isOwner ? -8 : 0 }}
          onClick={() => navigate(`/property/${property.property_id}`, { state: { property } })}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              viewMode === "list" ? "w-full sm:w-80 h-48 sm:h-full flex-shrink-0" : "h-48 sm:h-64"
            }`}
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {isOwner ? (
              <div className="absolute top-4 left-4">
                <StatusDropdown property={property} onChangeStatus={onChangeStatus} />
              </div>
            ) : (
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
            )}

            <div
              className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
                !isOwner ? "opacity-0 group-hover:opacity-100" : ""
              }`}
            >
              {/* Like Button */}
              {!isOwner && (
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
                    fill={
                      likedProperties.has(property.property_id) ? "currentColor" : "none"
                    }
                  />
                </motion.button>
              )}

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
          <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-emerald-600 transition-colors truncate">
                    {property.title}
                  </h3>
                  <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin size={14} className="mr-1 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{property.location_name}, {property.location_city || 'Karachi'}</span>
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{property.price}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-700 my-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                    <Bed size={16} className="text-emerald-500" />
                    <span>{property.bedrooms} {property.bedrooms > 1 ? "beds" : "bed"}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                    <Bath size={16} className="text-emerald-500" />
                    <span>{property.bathrooms} {property.bathrooms > 1 ? "baths" : "bath"}</span>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                    <Square size={16} className="text-emerald-500" />
                    <span>{property.area_sqft} sq ft</span>
                  </div>
                )}
                 {property.year_built && (
                <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="text-emerald-500" />
                  <span>{property.year_built} (built year)</span>
                </div>
                )}
              </div>

              {/* <div className="flex items-center justify-between text-gray-500 dark:text-gray-500 text-xs mt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>{property.views || 0} views</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={14} />
                    <span>{property.inquiries || 0} inquiries</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{property.daysListed || 0} days</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} fill="currentColor" className="text-yellow-400" />
                  <span>{property.rating || "N/A"}</span>
                </div>
              </div> */}
            </div>

{/* Actions */}
{property.adminActions ? (
  // Render admin actions if available
  <div className="mt-4">
    {property.adminActions}
  </div>
) : isOwner ? (
  // Owner actions
  <div className="flex gap-3 mt-5">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(property);
      }}
      className="flex-1 bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl py-3 px-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <Edit3 size={16} />
      <span className="hidden xs:inline">Edit</span>
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(property.property_id);
      }}
      className="flex-1 bg-red-600 text-white font-semibold rounded-xl py-3 px-4 shadow-lg shadow-red-200 dark:shadow-red-900/30 hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <Trash2 size={16} />
      <span className="hidden xs:inline">Delete</span>
    </motion.button>
  </div>
) : (
  // Default "View Details" button
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/property/${property.property_id}`, {
        state: { property },
      });
    }}
    className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl py-3 px-6 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
  >
    View Details
    <ArrowRight size={16} />
  </motion.button>
)}

         
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;