import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropertyGrid from "./PropertyGrid";
import { Filter, Search, Grid3X3, List } from "lucide-react";

import usePropertiesApi from '../hooks/useProperties'; // normal filtered search
import { useNlpProperties } from '../hooks/NlpProperties'; // NLP search hook

const propertiesPerPage = 6;

const BuyPage = () => {
  const navigate = useNavigate();

  // Normal search states
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 150000000]);
  const [sortBy, setSortBy] = useState('featured');
  const [normalPage, setNormalPage] = useState(1);

  // NLP search states
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpPage, setNlpPage] = useState(1);
  const [nlpInput, setNlpInput] = useState('');

  // UI states
  const [viewMode, setViewMode] = useState('grid');
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Fetch normal filtered data
  const {
    data: normalData,
    isLoading: normalLoading,
    error: normalError,
  } = usePropertiesApi({
    filter,
    searchTerm,
    priceRange,
    sortBy,
    currentPage: normalPage,
    limit: propertiesPerPage,
  });

  // Fetch NLP data with fixed hook usage
  const {
    data: nlpData,
    isLoading: nlpLoading,
    error: nlpError,
  } = useNlpProperties({
    query: nlpQuery,
    page: nlpPage,
    limit: propertiesPerPage,
    filter,           // Pass current filter
    priceRange,       // Pass current priceRange
    sortBy,           // Pass current sortBy
  });

  // Reset pages when queries or filters change
  useEffect(() => {
    setNormalPage(1);
  }, [filter, searchTerm, priceRange, sortBy]);

  useEffect(() => {
    setNlpPage(1);
  }, [nlpQuery]);

  const isNlpActive = nlpQuery.trim().length > 0;

  // Data and pagination selection
  const properties = isNlpActive
    ? (nlpData?.properties?.map(p => p.property) || [])
    : (normalData?.data || []);

  const totalPages = isNlpActive
    ? (nlpData?.totalPages || 1)
    : (normalData?.pagination?.totalPages || 1);

  const currentPage = isNlpActive ? nlpPage : normalPage;
  const setPage = isNlpActive ? setNlpPage : setNormalPage;

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

  return (
    <div className="min-h-screen  bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-b from-emerald-400/10 to-emerald-700 text-white pt-18 pb-2 overflow-visible">
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
              For the first time in Pakistan search your properties in natural language.
            </p>

            {/* NLP Search Bar with Search Button */}
            <div className="max-w-4xl mx-auto mb-8 flex gap-2">
              <input
                type="text"
                placeholder="Enter to search for your dream property..."
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                className="flex-grow px-6 py-4 rounded-xl border border-white/30 bg-white/20 text-emerald-900 placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setNlpQuery(nlpInput.trim());
                  }
                }}
              />
              <button
                onClick={() => setNlpQuery(nlpInput.trim())}
                className="px-6 py-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                disabled={nlpInput.trim() === ''}
              >
                Search
              </button>
            </div>

            {/* Existing Search & Filters — disabled if NLP active */}
            <div
              className={`max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-opacity`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-900" size={20} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 placeholder-emerald-800 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                    // disabled={isNlpActive}
                  />
                </div> */}

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  // disabled={isNlpActive}
                >
                  <option value="all">All Properties</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-emerald-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  // disabled={isNlpActive}
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
                  // disabled={isNlpActive}
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
              {isNlpActive
                ? `${nlpData?.count ?? '...'} Properties Found`
                : normalData
                ? `${normalData.pagination.total} Properties Found`
                : 'Loading...'}
            </span>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex gap-2">
              {!isNlpActive &&
                ["all", "sale", "rent"].map((type) => (
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
                    // disabled={isNlpActive}
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
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-gray-500"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-gray-500"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <AnimatePresence mode="wait">
          {(normalLoading && !isNlpActive) || (nlpLoading && isNlpActive) ? (
            <p className="text-center text-gray-500 py-20">Loading properties...</p>
          ) : (normalError && !isNlpActive) || (nlpError && isNlpActive) ? (
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
                  setNlpQuery('');
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
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
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
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
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
