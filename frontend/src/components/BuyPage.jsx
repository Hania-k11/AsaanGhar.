import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropertyGrid from "./PropertyGrid";
import { Filter, Search, Grid3X3, List } from "lucide-react";

import usePropertiesApi from '../hooks/useProperties'; // your React Query hook

const propertiesPerPage = 6;

const BuyPage = () => {
  const navigate = useNavigate();

  // Filters and UI state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 150000000]); // Adjust max price as per your needs
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // React Query fetch with current filters and pagination
  const { data, isLoading, error } = usePropertiesApi({
    filter,
    searchTerm,
    priceRange,
    sortBy,
    currentPage,
    limit: propertiesPerPage,
  });

  const properties = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Like toggle handler
  const toggleLike = (propertyId) => {
    setLikedProperties(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(propertyId)) {
        newLiked.delete(propertyId);
      } else {
        newLiked.add(propertyId);
      }
      return newLiked;
    });
  };

  // Reset to page 1 when filters/search/sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-b from-emerald-400/10 to-emerald-700 text-white pt-36 pb-20 overflow-visible">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent leading-tight">
              Buy your Properties at Ease
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Discover exceptional homes that match your lifestyle. From luxury penthouses to cozy apartments.
            </p>

            {/* Search & Filters */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-900" size={20} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 placeholder-emerald-800 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Properties</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Filter size={20} />
                  Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top filter and view mode controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">
              {data ? `${data.pagination.total} Properties Found` : 'Loading...'}
            </span>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex gap-2">
              {["all", "sale", "rent"].map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    filter === type
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-white text-emerald-600 border-2 border-emerald-200 hover:border-emerald-400"
                  }`}
                  onClick={() => setFilter(type)}
                >
                  {type === "all" ? "All" : type === "sale" ? "For Sale" : "For Rent"}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500"}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <p className="text-center text-gray-500 py-20">Loading properties...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-20">Error loading properties.</p>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-bold mb-4">No Properties Found</p>
              <p className="mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchTerm("");
                  setPriceRange([0, 150000000]);
                  setSortBy('featured');
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <PropertyGrid
              properties={properties}
              viewMode={viewMode}
              likedProperties={likedProperties}
              toggleLike={toggleLike}
              navigate={navigate}
            />
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-12 gap-2"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === index + 1
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
