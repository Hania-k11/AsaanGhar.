//src/components/Favourites.jsx

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  Star,
  RefreshCw,
  SquareStack,
  DollarSign,
  Building,
  BedDouble,
  ShowerHead,
  MapPin,
  Home,
  Tags,
} from "lucide-react";
import PropertyGrid from "./PropertyGrid"; // This is assumed to be a robust component
import { useNavigate } from "react-router-dom";

// Mock data for all properties.
// In a real application, this would be fetched from an API.
const mockAllProperties = [
  {
  property_id: "1",
    title: "Modern Downtown Condo",
    price: "850000",
    location_name: "123 Market St, San Francisco, CA",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1200,
    listing_type_name: "sale",
    image: "https://images.unsplash.com/photo-1549517045-bc93de07f01d?q=80&w=400",
    rating: 4.8,
    year_built: 2020,
    description: "Stunning modern condo with city views and premium amenities.",
  },
  {
    property_id: "2",
    title: "Victorian House in Mission",
    price: "1200000",
    priceLabel: "$1,200,000",
    location_name: "456 Valencia St, San Francisco, CA",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1800,
    listing_type_name: "sale",
    image: "https://images.unsplash.com/photo-1570129477041-3b7c2b3e4073?q=80&w=400",
    rating: 4.6,
    year_built: 1905,
    description: "Charming Victorian home with original details and modern updates.",
  },
  {
    property_id: "3",
    title: "Luxury Penthouse Downtown",
    price: "2100000",
    priceLabel: "$2,100,000",
    location_name: "789 Pine St, San Francisco, CA",
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2500,
    listing_type_name: "sale",
    image: "https://images.unsplash.com/photo-1615529141938-e6b7d52a20a4?q=80&w=400",
    rating: 4.9,
    year_built: 2018,
    description: "Exclusive penthouse with panoramic city views and luxury finishes.",
  },
  {
    property_id: "4",
    title: "Cozy Studio Apartment",
    price: "2800",
    priceLabel: "$2,800/month",
    location_name: "321 Folsom St, San Francisco, CA",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 600,
    listing_type_name: "rent",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400",
    rating: 4.2,
    year_built: 2015,
    description: "Perfect starter home in a vibrant neighborhood.",
  },
  {
    propety_id: "5",
    title: "Family Home with Garden",
    price: "980000",
    priceLabel: "$980,000",
    locationname: "654 Oak St, San Francisco, CA",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1600,
    listing_type_name: "sale",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8db56?q=80&w=400",
    rating: 4.7,
    year_built: 1985,
    description: "Spacious family home with beautiful garden and quiet neighborhood.",
  },
  {
    property_id: "6",
    title: "Modern Loft Space",
    price: "3200",
    priceLabel: "$3,200/month",
    location_name: "987 Mission St, San Francisco, CA",
    bedrooms: 2,
    bathrooms: 1,
    area_sqft: 1100,
    listing_type_name: "rent",
    image: "https://images.unsplash.com/photo-1547349942-83b3815c325c?q=80&w=400",
    rating: 4.4,
    year_built: 2010,
    description: "Industrial-style loft with high ceilings and exposed brick.",
  },
  {
    property_id: "7",
    title: "Charming Coastal Cottage",
    price: "1500000",
    priceLabel: "$1,500,000",
    location_name: "101 Ocean Blvd, Half Moon Bay, CA",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1450,
    listing_type_name: "sale",
    image: "https://images.unsplash.com/photo-1598464350172-e1d51c3a647d?q=80&w=400",
    rating: 4.9,
    yearBuilt: 1998,
    description: "A beautiful cottage steps from the beach.",
  },
  {
    id: "8",
    title: "Spacious Suburban Home",
    price: "600000",
    priceLabel: "$600,000",
    location: "72 Maple St, Daly City, CA",
    beds: 4,
    baths: 2.5,
    area: 2400,
    type: "sale",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400",
    rating: 4.5,
    yearBuilt: 2008,
    description: "Ideal family home with a large backyard.",
  },
];

// Reusable Filter/Sort Button Component
const ActionButton = React.memo(({ icon: Icon, label, onClick, isActive, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm lg:text-base ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200"
        : "border border-gray-200 text-gray-700 hover:bg-gray-100"
    } ${className}`}
  >
    <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
    <span>{label}</span>
  </motion.button>
));

// Reusable StatCard Component
const StatCard = React.memo(({ label, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    className="text-center"
  >
    <div className={`text-2xl lg:text-3xl font-bold ${color} flex items-center justify-center gap-1`}>
      {value}
      {Icon && <Icon className="w-4 h-4 fill-current" />}
    </div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </motion.div>
));

const Favourites = ({
  allProperties = mockAllProperties,
  likedProperties = new Set(["1", "3", "5", "4","2", "6", "7", "8"]), // Use string IDs
  toggleLike,
}) => {
  // State for all filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 2500000]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  // Constants for filter/sort options
  const sortOptions = [
    { value: "rating", label: "Rating", icon: Star },
    { value: "price", label: "Price", icon: DollarSign },
    { value: "area", label: "Size", icon: SquareStack },
    { value: "yearBuilt", label: "Year Built", icon: Building },
  ];

  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
  ];

  // Memoize the liked properties to prevent re-filtering on every render
  const likedPropertiesData = useMemo(() => {
    return allProperties.filter((property) => likedProperties.has(property.property_id));
  }, [allProperties, likedProperties]);

  // Memoize the final filtered and sorted list
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = likedPropertiesData.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || property.type === filterType;
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesBeds = beds === 0 || property.beds >= beds;
      const matchesBaths = baths === 0 || property.baths >= baths;

      return matchesSearch && matchesType && matchesPrice && matchesBeds && matchesBaths;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [likedPropertiesData, searchTerm, sortBy, sortOrder, filterType, priceRange, beds, baths]);

  // Use useCallback to memoize callback functions
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterType("all");
    setPriceRange([0, 2500000]);
    setBeds(0);
    setBaths(0);
  }, []);

  const isFilterActive =
    searchTerm !== "" ||
    filterType !== "all" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2500000 ||
    beds !== 0 ||
    baths !== 0;

  return (
    <div className="min-h-screen bg-white p-2 ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-4">
              <div className="p-3 lg:p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl text-white shadow-xl shadow-red-200">
                <Heart className="w-7 h-7 lg:w-8 lg:h-8" fill="currentColor" />
              </div>
              My Favorites
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              You have {likedPropertiesData.length} saved properties. Explore and manage them here.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-lg border border-gray-100">
            <ActionButton icon={LayoutGrid} onClick={() => setViewMode("grid")} isActive={viewMode === "grid"} label="Grid" className="px-3" />
            <ActionButton icon={List} onClick={() => setViewMode("list")} isActive={viewMode === "list"} label="List" className="px-3" />
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 lg:p-8 shadow-2xl border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, location, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Main Action Buttons (Sort & Filter) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 lg:py-4 pr-10 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 w-full font-medium text-gray-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <ActionButton
                icon={sortOrder === "asc" ? SortAsc : SortDesc}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                label={sortOrder === "asc" ? "Low to High" : "High to Low"}
                className="min-w-[140px]"
              />
              <ActionButton
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
                isActive={showFilters || isFilterActive}
                label="Filters"
                className="min-w-[120px]"
              />
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-6 pt-6 border-t border-gray-200 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Property Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                      {propertyTypeOptions.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setFilterType(value)}
                          className={`flex-1 text-sm py-2 px-4 rounded-lg transition-colors duration-200 font-medium ${
                            filterType === value ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange[0] === 0 ? "" : priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange[1] === 2500000 ? "" : priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2500000])}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Bed and Bath Filters */}
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={beds === 0 ? "" : beds}
                        onChange={(e) => setBeds(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Baths</label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={baths === 0 ? "" : baths}
                        onChange={(e) => setBaths(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex items-end">
                    <ActionButton
                      icon={RefreshCw}
                      onClick={clearFilters}
                      label="Reset Filters"
                      className="w-full bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Display */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {filteredAndSortedProperties.length > 0 ? (
            <PropertyGrid
              properties={filteredAndSortedProperties}
              viewMode={viewMode}
              likedProperties={likedProperties}
              toggleLike={toggleLike}
              navigate={navigate}
            />
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 lg:py-24">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-red-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                {isFilterActive ? "No matching favorites found" : "You have no saved favorites"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {isFilterActive
                  ? "Try adjusting your search or filters to find your saved properties."
                  : "Start exploring properties and save your favorites to see them here."}
              </p>
              {isFilterActive && (
                <ActionButton icon={RefreshCw} onClick={clearFilters} label="Reset Filters" className="mx-auto" />
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        {likedPropertiesData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 lg:p-8 border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Favorites Summary</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <StatCard label="Total Saved" value={likedPropertiesData.length} color="text-emerald-600" />
              <StatCard
                label="For Sale"
                value={likedPropertiesData.filter((p) => p.listing_type_name === "sale").length}
                color="text-green-600"
              />
              <StatCard
                label="For Rent"
                value={likedPropertiesData.filter((p) => p.listing_type_name === "rent").length}
                color="text-blue-600"
              />
             
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favourites;