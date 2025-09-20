// src/components/PropertyGrid.jsx
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
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
  Check,
  Clock,
  CheckCircle,
  PauseCircle,
  ChevronDown,
  Eye,
  MessageSquare,
  AlertCircle,
  Tag,
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
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

// Helper function to calculate days since listing
const getDaysListed = (postedAt) => {
  if (!postedAt) return "N/A";

  try {
    const postedDate = new Date(postedAt);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  } catch (error) {
    return "N/A";
  }
};

// Helper function to get the status color
const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100/80 text-emerald-800 border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50 backdrop-blur-sm";
    case "sold":
      return "bg-green-100/80 text-green-800 border-green-200/50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50 backdrop-blur-sm";
    case "paused":
      return "bg-yellow-100/80 text-yellow-800 border-yellow-200/50 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50 backdrop-blur-sm";
    default:
      return "bg-gray-100/80 text-gray-800 border-gray-200/50 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/50 backdrop-blur-sm";
  }
};

// Toast notification function
const showToast = (message, type = "success") => {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const feedback = document.createElement("div");
  feedback.textContent = message;
  feedback.className = `toast-notification fixed top-20 right-4 px-5 py-2.5 rounded-xl shadow-lg z-50 text-sm font-medium transition-all duration-300 transform ${
    type === "success"
      ? "bg-emerald-600 text-white"
      : "bg-red-600 text-white"
  }`;
  
  document.body.appendChild(feedback);
  
  // Animate in
  setTimeout(() => {
    feedback.style.transform = "translateX(0)";
    feedback.style.opacity = "1";
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    feedback.style.transform = "translateX(100%)";
    feedback.style.opacity = "0";
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
};

const PropertyGrid = ({
  properties = [],
  viewMode = "grid",
  likedProperties = new Set(),
  toggleLike,
  isOwner = false,
  onDelete,
  onEdit,
  onChangeStatus,
  onChangeListingType,
}) => {
  console.log("Properties received in PropertyGrid:", properties);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  // Handle sharing with clipboard fallback
  const handleShare = async (e, property) => {
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/property/${property.property_id}`;
      const shareData = {
        title: property.title,
        text: property.description || "Check out this beautiful property!",
        url: shareUrl,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showToast("Property shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Property link copied to clipboard!");
      }
    } catch (err) {
      console.warn("Share failed:", err);
      showToast("Failed to share property", "error");
    }
  };

  const handleDelete = async (e, propertyId) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      setDeletingId(propertyId);
      try {
        await onDelete(propertyId);
        showToast("Property deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        showToast("Failed to delete property", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (e, property) => {
    e.stopPropagation();
    onEdit(property);
  };

  const handleLike = async (e, propertyId) => {
    e.stopPropagation();
    try {
      const wasLiked = likedProperties.has(propertyId);
      await toggleLike(propertyId, wasLiked);
      showToast(wasLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Like toggle error:", error);
      showToast("Failed to update favorites", "error");
    }
  };

  const StatusDropdown = ({ property, onChangeStatus }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
  const handleClickOutside = () => {
    setIsOpen(false);
  };
  
  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [isOpen]);
    const statuses = ["active", "paused", "sold"];

    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${getStatusColor(
            property.status || 'active'
          )} shadow-sm hover:shadow-md`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getStatusIcon(property.status || 'active')}
          <span className="hidden xs:inline capitalize">
            {(property.status || 'active')}
          </span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
  className="fixed inset-0 z-40"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
  }}
/>
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute top-full left-0 mt-2 w-36 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl z-50 border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-md overflow-hidden"
                role="menu"
                onClick={(e) => e.stopPropagation()}
              >
                {statuses.map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeStatus(property.property_id, status);
                      setIsOpen(false);
                      showToast(`Status changed to ${status}`);
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-50 dark:hover:from-emerald-900/30 transition-all duration-200"
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </span>
                    {(property.status || 'active') === status && (
                      <Check size={16} className="text-emerald-500" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ListingTypeDropdown = ({ property, onChangeListingType }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
  const handleClickOutside = () => {
    setIsOpen(false);
  };
  
  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [isOpen]);
  const listingTypes = [
    { id: 'sale', name: 'Sale', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'rent', name: 'Rent', color: 'bg-blue-100 text-blue-700 border-blue-200' }
  ];
  
 // In the ListingTypeDropdown component, replace the currentType calculation:
  const currentType = property.listing_type_name?.toLowerCase() === 'sale' || 
                   property.listing_type_id === 2 ? 'sale' : 'rent';
  const currentTypeData = listingTypes.find(t => t.id === currentType);

  return (
    <div className="relative">
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  }}
  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${currentTypeData?.color} shadow-sm hover:shadow-md backdrop-blur-sm`}
  aria-expanded={isOpen}
  aria-haspopup="true"
>
  <Tag size={12} />
  <span>{currentTypeData?.name}</span>
  <ChevronDown
    size={12}
    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
  />
</motion.button>




      <AnimatePresence>
        {isOpen && (
          <>
            <div 
  className="fixed inset-0 z-40"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
  }}
/>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute top-full left-0 mt-2 w-32 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl z-50 border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-md overflow-hidden"
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              {listingTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeListingType(property.property_id, type.id);
                    setIsOpen(false);
                    showToast(`Changed to ${type.name}`);
                  }}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-50 dark:hover:from-emerald-900/30 transition-all duration-200"
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={12} />
                    <span>{type.name}</span>
                  </span>
                  
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={viewMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          : "space-y-4 sm:space-y-5"
      }
    >
      {properties.map((property, index) => {
        const propertyId = property.property_id ?? property.id;
        const isDeleting = deletingId === propertyId;
        
        return (
          <motion.article
            key={propertyId} 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
            className={`group relative bg-white/80 dark:bg-gray-800/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-sm ${
              viewMode === "list"
                ? "flex flex-col sm:flex-row gap-0 sm:gap-4"
                : "flex flex-col"
            } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
            whileHover={{
              y: viewMode === "grid" && !isOwner ? -6 : 0,
              boxShadow: viewMode === "grid" && !isOwner ? "0 25px 50px -12px rgba(0,0,0,0.25)" : undefined,
            }}
            role="article"
            aria-label={`Property: ${property.title}`}
            onClick={() => {
              if (!isDeleting) {
                navigate(`/property/${propertyId}`, { state: { property } });
              }
            }}
          >
            {/* Image Section */}
            <div
              className={`relative overflow-hidden ${
                viewMode === "list"
                  ? "w-full sm:w-48 md:w-56 h-40 sm:h-full flex-shrink-0 rounded-t-3xl sm:rounded-tr-none sm:rounded-l-3xl"
                  : "h-48 sm:h-56 md:h-64 rounded-t-3xl"
              }`}
            >
              <motion.img
                src={property.image}
                alt={property.title || "Property image"}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                whileHover={{ scale: 1.05 }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop";
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Status or Listing Type */}
              {isOwner ? (
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
    <StatusDropdown property={property} onChangeStatus={onChangeStatus} />
    <ListingTypeDropdown property={property} onChangeListingType={onChangeListingType} />
  </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 left-3 z-10"
                >
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${
                      property.listing_type_name?.toLowerCase().includes("sale") || property.listing_type_name === "sale"
                        ? "bg-gradient-to-r from-emerald-500/90 to-emerald-600 text-white"
                        : "bg-gradient-to-r from-blue-500/90 to-blue-600 text-white"
                    } backdrop-blur-sm border border-white/20`}
                  >
                    For {property.listing_type_name?.toLowerCase().includes("sale") || property.listing_type_name === "sale" ? "Sale" : "Rent"}
                  </span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute top-3 right-3 flex gap-1.5 z-10 transition-all duration-300 ${
                  !isOwner ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                {!isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleLike(e, propertyId)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      likedProperties.has(propertyId)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500 dark:bg-gray-700/90 dark:text-gray-300"
                    } shadow-sm`}
                    aria-label={likedProperties.has(propertyId) ? "Unlike" : "Like"}
                  >
                    <Heart size={16} fill={likedProperties.has(propertyId) ? "currentColor" : "none"} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleShare(e, property)}
                  className="p-2 bg-white/90 rounded-full text-gray-700 shadow-sm hover:bg-emerald-50 hover:text-emerald-600 dark:bg-gray-700/90 dark:text-gray-300 dark:hover:bg-emerald-900/20 transition-all duration-200"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </motion.button>
              </motion.div>
            </div>

            {/* Details Section */}
            <div
              className={`p-3.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between ${
                viewMode === "list" ? "min-h-[180px]" : ""
              }`}
            >
              <div className="space-y-2.5">
                {/* Title & Price */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {property.title || "Untitled Property"}
                    </h3>
                    <p className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <MapPin size={14} className="mr-1 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">
                        {property.location_name || "Location not specified"}, {property.location_city || "Pakistan"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right sm:text-left mt-1 sm:mt-0 flex-shrink-0">
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {property.price || "Contact for Price"}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap items-center gap-2.5 py-2.5 border-y border-gray-100/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl px-2.5">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <Bed size={14} className="text-emerald-500" />
                      <span>{property.bedrooms} {Number(property.bedrooms) > 1 ? "Beds" : "Bed"}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <Bath size={14} className="text-emerald-500" />
                      <span>{property.bathrooms} {Number(property.bathrooms) > 1 ? "Baths" : "Bath"}</span>
                    </div>
                  )}
                  {property.area_sqft && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <Square size={14} className="text-emerald-500" />
                      <span>{property.area_sqft} sqft</span>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <Calendar size={14} className="text-emerald-500" />
                      <span>{property.year_built}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/30 rounded-lg p-2">
                  <div className="flex gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> 
                      <span>{property.views || 0} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> 
                      <span>{property.inquiries || 0} inquiries</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 
                      <span>{getDaysListed(property.posted_at)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={12} className="text-red-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      {property.favorite_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Owner or View) */}
              {isOwner ? (
                <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-2 border-t border-gray-100/50 dark:border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleEdit(e, property)}
                    disabled={isDeleting}
                    className="flex-1 bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 font-medium rounded-xl py-2.5 px-3 hover:shadow-md transition-all text-sm backdrop-blur-sm disabled:opacity-50"
                  >
                    <Edit3 size={16} className="inline mr-1.5" />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleDelete(e, propertyId)}
                    disabled={isDeleting}
                    className="flex-1 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white font-medium rounded-xl py-2.5 px-3 shadow-sm hover:shadow transition-all text-sm disabled:opacity-50"
                  >
                    <Trash2 size={16} className="inline mr-1.5" />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/property/${propertyId}`, { state: { property } });
                  }}
                  className="mt-3 w-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white font-medium rounded-xl py-2.5 px-4 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  View Details
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              )}
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
};

export default PropertyGrid;