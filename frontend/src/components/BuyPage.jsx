// src/components/BuyPage.jsx
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";
import { Filter, Search, Grid3X3, List } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usePropertiesApi from "../hooks/useProperties";
import { useNlpProperties } from "../hooks/NlpProperties";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const propertiesPerPage = 6;

// API function for toggling favorite
const toggleFavoriteProperty = async ({ userId, propertyId, isCurrentlyLiked }) => {
    if (isCurrentlyLiked) {
        await axios.delete(`/api/property/favorites/${userId}/${propertyId}`);
    } else {
        await axios.post('/api/property/favorites', { userId, propertyId });
    }
};

const BuyPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;

  // Normal search states
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");  
  const [priceRange, setPriceRange] = useState([0, 9999999999999.99]);
  const [sortBy, setSortBy] = useState("featured");
  const [normalPage, setNormalPage] = useState(1);

  // NLP search states
  const [searchParams, setSearchParams] = useSearchParams();

  const [nlpInput, setNlpInput] = useState(searchParams.get("q") || "");
  const [nlpQuery, setNlpQuery] = useState(searchParams.get("q") || "");
  const [nlpPage, setNlpPage] = useState(Number(searchParams.get("page")) || 1);

  // whenever nlpQuery or page changes, sync to URL
  useEffect(() => {
    const params = {};
    if (nlpQuery) params.q = nlpQuery;
    if (nlpPage > 1) params.page = nlpPage;
    setSearchParams(params);
  }, [nlpQuery, nlpPage, setSearchParams]);

  useEffect(() => {
    setFilter("all");
  }, [nlpQuery]);

  // UI states
  const [viewMode, setViewMode] = useState("grid");
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

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

  const {
    data: nlpData,
    isLoading: nlpLoading,
    error: nlpError,
  } = useNlpProperties({
    query: nlpQuery,
    page: nlpPage,
    limit: propertiesPerPage,
    filter, 
    priceRange, 
    sort: sortBy, 
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
    ? nlpData?.properties?.map((p) => p?.property ?? p) || []
    : normalData?.data || [];

  const totalPages = isNlpActive
    ? nlpData?.totalPages || 1
    : normalData?.pagination?.totalPages || 1;

  const currentPage = isNlpActive ? nlpPage : normalPage;
  const setPage = isNlpActive ? setNlpPage : setNormalPage;

  // UPDATE: changedddz
useEffect(() => {
  if (!properties.length) return;

  setLikedProperties((prev) => {
    const likedIds = new Set(
      properties
        .filter((property) => property.is_favorite || property.isFavorite)
        .map((property) => property.property_id)
    );

    // If the contents are the same, don't trigger another render
    if (prev.size === likedIds.size) {
      let same = true;
      for (const id of likedIds) {
        if (!prev.has(id)) {
          same = false;
          break;
        }
      }
      if (same) return prev; // no change → React will NOT re-render
    }

    return likedIds;
  });
}, [properties]);


  const queryClient = useQueryClient();
  
  // Like toggle handler with optimistic updates
  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoriteProperty,
    onMutate: async ({ propertyId, isCurrentlyLiked }) => {
      // Optimistic update - immediately update the UI
      setLikedProperties(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(propertyId);
        } else {
          newSet.add(propertyId);
        }
        return newSet;
      });
    },
    onSuccess: () => {
      // Invalidate queries to trigger a fresh fetch and update UI across components
      queryClient.invalidateQueries(['properties']);
      queryClient.invalidateQueries(['favoriteProperties']);
      queryClient.invalidateQueries(['overview']);
      
      // Show success toast
      // showToast('Favorites updated!');
    },
    onError: (error, { propertyId, isCurrentlyLiked }) => {
      // Revert the optimistic update on error
      setLikedProperties(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(propertyId);
        } else {
          newSet.delete(propertyId);
        }
        return newSet;
      });
      
      console.error('Failed to toggle favorite:', error);
      showToast('Failed to update favorites.', 'error');
    },
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.className = `fixed top-4 right-4 px-5 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in-out text-sm font-medium transition-transform transform-gpu ${
      type === "success"
        ? "bg-emerald-600 text-white"
        : "bg-red-600 text-white"
    }`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2500);
  };

  const handleToggleLike = (propertyId, isCurrentlyLiked) => {
    if (!userId) {
      // Handle not logged-in case - you might want to show a login prompt
      showToast('Please login to save favorites', 'error');
      return;
    }
    toggleFavoriteMutation.mutate({ userId, propertyId, isCurrentlyLiked });
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateX(100%); }
          10%, 90% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2.5s ease-out;
        }
      `}</style>

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
              For the first time in Pakistan search your properties in natural
              language.
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
                  if (e.key === "Enter") {
                    setNlpQuery(nlpInput.trim());
                  }
                }}
              />
              <button
                onClick={() => setNlpQuery(nlpInput.trim())}
                className="px-6 py-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                disabled={nlpInput.trim() === ""}
              >
                Search
              </button>
            </div>

            {/* Existing Search & Filters */}
            <div className={`max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-opacity`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {isNlpActive
                ? `${nlpData?.count ?? "..."} Properties Found`
                : normalData
                ? `${normalData.pagination.total} Properties Found`
                : "Loading..."}
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
                  {type === "all"
                    ? "All"
                    : type === "sale"
                    ? "For Sale"
                    : "For Rent"}
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
          <div className="pt-12 pb-36 ">
          <LoadingSpinner 
  variant="inline" 
  message="Loading properties..." 
/>
</div>
          ) : (normalError && !isNlpActive) || (nlpError && isNlpActive) ? (
            <p className="text-center text-red-500 py-20">
              Error loading properties.
            </p>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-bold mb-4">No Properties Found</p>
              <p className="mb-6">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchTerm("");
                  setPriceRange([0, 150000000]);
                  setSortBy("featured");
                  setNlpQuery("");
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
              toggleLike={handleToggleLike}
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