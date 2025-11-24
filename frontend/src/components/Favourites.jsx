//src/components/Favourites.jsx
/* eslint-disable no-unused-vars */

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
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
  Loader,
  Undo2,
  AlertCircle,
} from "lucide-react";
import PropertyGrid from "./PropertyGrid"; 
import { useNavigate } from "react-router-dom";

// API functions
const fetchFavoriteProperties = async ({ queryKey }) => {
  const [_key, { userId, filter, searchTerm, priceRange, sortBy, currentPage, limit }] = queryKey;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const params = {
    type: filter,
    search: searchTerm,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit,
  };

  console.log("Fetching favorites with params:", params);

  const { data } = await axios.get(`/api/property/favorites/${userId}`, { params });
  console.log("Fetched favorite properties:", data);
  return data;
};

const toggleFavoriteProperty = async ({ userId, propertyId, isCurrentlyLiked }) => {
  if (isCurrentlyLiked) {
    // Remove from favorites
    const { data } = await axios.delete(`/api/property/favorites/${userId}/${propertyId}`);
    return { ...data, action: 'removed', propertyId };
  } else {
    // Add to favorites
    const { data } = await axios.post('/api/property/favorites', { userId, propertyId });
    return { ...data, action: 'added', propertyId };
  }
};

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Reusable Filter/Sort Button Component
const ActionButton = React.memo(({ icon: Icon, label, onClick, isActive, className = "", disabled = false }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.02 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm lg:text-base ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200"
        : disabled
        ? "border border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
        : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
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

// Enhanced Toast Component
const ToastPortal = ({ children }) => {
  const [toastContainer, setToastContainer] = useState(null);

  useEffect(() => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none';
      document.body.appendChild(container);
    }
    setToastContainer(container);

    return () => {
      if (container && container.children.length === 0) {
        container.remove();
      }
    };
  }, []);

  if (!toastContainer) return null;

  return toastContainer;
};

const Favourites = () => {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for all filters and sorting
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 9999999999]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Local liked properties state for immediate UI updates
  const [localLikedProperties, setLocalLikedProperties] = useState(new Set());

  // Undo functionality refs
  const undoTimeoutRef = useRef(null);
  const toastRef = useRef(null);
  const searchInputRef = useRef(null);
  const [pendingUndo, setPendingUndo] = useState(null);

  // Constants for filter/sort options
  const sortOptions = [
    { value: "newest", label: "Newest First", icon: Star },
    { value: "price_low", label: "Price: Low to High", icon: DollarSign },
    { value: "price_high", label: "Price: High to Low", icon: DollarSign },
    { value: "views_high", label: "Most Viewed", icon: SquareStack },
    { value: "oldest", label: "Oldest First", icon: Building },
  ];

  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
  ];

  // Fetch favorite properties with better caching and stability
  const { 
    data: favoritesData, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['favoriteProperties', { 
      userId, 
      filter: filterType, 
      searchTerm: debouncedSearchTerm, 
      priceRange, 
      sortBy, 
      currentPage, 
      limit 
    }],
    queryFn: fetchFavoriteProperties,
    enabled: isLoggedIn && !!userId,
    keepPreviousData: true,
    staleTime: 60 * 1000, // Increased to 60 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    notifyOnChangeProps: ['data', 'error', 'isLoading'], // Only notify on specific prop changes
  });

  // Update local liked properties when data changes (memoized)
  useEffect(() => {
    if (favoritesData?.data && !pendingUndo) {
      const likedIds = new Set(favoritesData.data.map(property => property.property_id));
      setLocalLikedProperties(prevLiked => {
        // Only update if the sets are different
        if (prevLiked.size !== likedIds.size || 
            [...likedIds].some(id => !prevLiked.has(id))) {
          return likedIds;
        }
        return prevLiked;
      });
    }
  }, [favoritesData?.data, pendingUndo]);

  // Enhanced toast system
  const showToast = useCallback((message, type = "success", duration = 3000, hasUndo = false, undoAction = null) => {
    // Clear existing toast
    if (toastRef.current) {
      document.body.removeChild(toastRef.current);
      toastRef.current = null;
    }

    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-3 rounded-xl shadow-xl z-50 text-sm font-medium transition-all duration-300 transform pointer-events-auto max-w-sm ${
      type === "success"
        ? "bg-emerald-600 text-white"
        : type === "error"
        ? "bg-red-600 text-white"
        : "bg-gray-800 text-white"
    }`;

    const content = document.createElement("div");
    content.className = "flex items-center justify-between gap-3";
    
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    content.appendChild(messageSpan);

    if (hasUndo && undoAction) {
      const undoBtn = document.createElement("button");
      undoBtn.textContent = "Undo";
      undoBtn.className = "bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold";
      undoBtn.onclick = () => {
        undoAction();
        if (toastRef.current) {
          document.body.removeChild(toastRef.current);
          toastRef.current = null;
        }
      };
      content.appendChild(undoBtn);
    }

    toast.appendChild(content);
    document.body.appendChild(toast);
    toastRef.current = toast;

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
      toast.style.opacity = "1";
    });

    // Auto remove
    setTimeout(() => {
      if (toastRef.current === toast) {
        toast.style.transform = "translateX(100%)";
        toast.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
          if (toastRef.current === toast) {
            toastRef.current = null;
          }
        }, 300);
      }
    }, duration);
  }, []);

  // Toggle favorite mutation with improved error handling
  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoriteProperty,
    onMutate: async ({ propertyId, isCurrentlyLiked }) => {
      // Clear any pending undo
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = null;
      }
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['favoriteProperties']);

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['favoriteProperties', { 
        userId, 
        filter: filterType, 
        searchTerm: debouncedSearchTerm, 
        priceRange, 
        sortBy, 
        currentPage, 
        limit 
      }]);

      // Optimistic update
      setLocalLikedProperties(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(propertyId);
          setPendingUndo(propertyId);
        } else {
          newSet.add(propertyId);
        }
        return newSet;
      });

      return { previousData, propertyId, isCurrentlyLiked };
    },
    onSuccess: (result, variables) => {
      const { propertyId, isCurrentlyLiked } = variables;
      
      // Invalidate and refetch
      queryClient.invalidateQueries(['favoriteProperties']);
      queryClient.invalidateQueries(['properties']); // Also invalidate main properties
      queryClient.invalidateQueries(['overview']);

      if (result.action === 'removed') {
        showToast(
          "Property removed from favorites", 
          "success", 
          5000, 
          true, 
          () => handleUndoRemoval(propertyId)
        );
        
        // Auto-clear pending undo after 5 seconds
        undoTimeoutRef.current = setTimeout(() => {
          setPendingUndo(null);
          undoTimeoutRef.current = null;
        }, 5000);
      } else {
        showToast("Property added to favorites!", "success");
        setPendingUndo(null);
      }
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context?.previousData) {
        setLocalLikedProperties(prev => {
          const newSet = new Set(prev);
          if (variables.isCurrentlyLiked) {
            newSet.add(variables.propertyId);
          } else {
            newSet.delete(variables.propertyId);
          }
          return newSet;
        });
      }
      
      setPendingUndo(null);
      showToast("Failed to update favorites. Please try again.", "error");
      console.error('Error toggling favorite:', error);
    },
  });

  // Handle undo removal
  const handleUndoRemoval = useCallback((propertyId) => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
    
    setPendingUndo(null);
    toggleFavoriteMutation.mutate({ userId, propertyId, isCurrentlyLiked: false });
    showToast("Property restored to favorites!", "success");
  }, [userId, toggleFavoriteMutation, showToast]);

  // Handle toggle like
  const handleToggleLike = useCallback((propertyId) => {
    if (!userId) {
      showToast("Please log in to manage favorites", "error");
      return;
    }
    
    if (toggleFavoriteMutation.isLoading) {
      return; // Prevent multiple rapid clicks
    }
    
    const isCurrentlyLiked = localLikedProperties.has(propertyId);
    toggleFavoriteMutation.mutate({ userId, propertyId, isCurrentlyLiked });
  }, [userId, localLikedProperties, toggleFavoriteMutation, showToast]);

  // Clear filters with confirmation if there are many active filters
  const clearFilters = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    
    const activeFilters = [
      searchInput !== "",
      filterType !== "all",
      priceRange[0] !== 0,
      priceRange[1] !== 9999999999,
    ].filter(Boolean).length;

    if (activeFilters > 2) {
      if (!window.confirm("Clear all filters? This will reset your search.")) {
        return;
      }
    }

    // Clear search input and maintain focus
    setSearchInput("");
    setFilterType("all");
    setPriceRange([0, 9999999999]);
    setCurrentPage(1);
    
    // Restore focus to search input after clearing
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
    
    showToast("Filters cleared", "success");
  }, [searchInput, filterType, priceRange, showToast]);

  // Reset page when filters change (but not on initial load)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [filterType, debouncedSearchTerm, priceRange, sortBy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      if (toastRef.current) {
        document.body.removeChild(toastRef.current);
      }
    };
  }, []);

  const isFilterActive =
    debouncedSearchTerm !== "" ||
    filterType !== "all" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 9999999999;

  const isSearching = searchInput !== debouncedSearchTerm && searchInput.length > 0;

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view and manage your favorite properties.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Favorites</h1>
          <p className="text-gray-600 mb-6">{error?.message || 'Something went wrong while loading your favorites.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/buy')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Properties
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const properties = favoritesData?.data || [];
  const pagination = favoritesData?.pagination || {};

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-4">
              <div className="p-3 lg:p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl text-white shadow-xl shadow-red-200">
                <Heart className="w-7 h-7 lg:w-8 lg:h-8" fill="currentColor" />
              </div>
              My Favorites
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              {pagination.total || 0} saved propert{pagination.total === 1 ? 'y' : 'ies'}
              {isFilterActive && " matching your filters"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-lg border border-gray-100">
            <ActionButton 
              icon={LayoutGrid} 
              onClick={() => setViewMode("grid")} 
              isActive={viewMode === "grid"} 
              label="Grid" 
              className="px-3" 
            />
            <ActionButton 
              icon={List} 
              onClick={() => setViewMode("list")} 
              isActive={viewMode === "list"} 
              label="List" 
              className="px-3" 
            />
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchInput}
                onChange={(e) => {
                  e.preventDefault();
                  setSearchInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchInputRef.current?.blur();
                  }
                }}
                className="w-full pl-12 pr-12 py-3 lg:py-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                aria-label="Search properties"
                autoComplete="off"
                spellCheck="false"
              />
              {/* Search state indicator */}
              {isSearching && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {searchInput && !isSearching && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchInput("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative min-w-[220px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 lg:py-4 pr-10 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 w-full font-medium text-gray-700"
                  aria-label="Sort properties"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <ActionButton
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
                isActive={showFilters || isFilterActive}
                label={`Filters${isFilterActive ? ' (Active)' : ''}`}
                className="min-w-[130px]"
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
                  <div className="lg:col-span-2">
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
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange[0] === 0 ? "" : priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange[1] === 9999999999 ? "" : priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 9999999999])}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="lg:col-span-1 flex items-end">
                    <ActionButton
                      icon={RefreshCw}
                      onClick={clearFilters}
                      label="Reset Filters"
                      className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      disabled={!isFilterActive}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading overlay for background fetching */}
        {isFetching && !isLoading && (
          <div className="fixed top-20 right-4 z-40">
            <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 text-sm text-gray-600">
              <Loader className="w-4 h-4 animate-spin text-emerald-500" />
              Updating...
            </div>
          </div>
        )}

        {/* Properties Display */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {properties.length > 0 ? (
            <>
              <PropertyGrid
                properties={properties}
                viewMode={viewMode}
                likedProperties={localLikedProperties}
                toggleLike={handleToggleLike}
                navigate={navigate}
              />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium text-sm"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                            currentPage === page
                              ? "bg-emerald-500 text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium text-sm"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-16 lg:py-24"
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-red-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                {isFilterActive ? "No matching favorites found" : "No saved favorites yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {isFilterActive
                  ? "Try adjusting your search terms or filters to find your saved properties."
                  : "Start exploring properties and click the heart icon to save your favorites here."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isFilterActive && (
                  <ActionButton 
                    icon={RefreshCw} 
                    onClick={clearFilters} 
                    label="Clear Filters" 
                    className="mx-auto sm:mx-0" 
                  />
                )}
                <button
                  onClick={() => navigate('/buy')}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                >
                  Browse Properties
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats - Enhanced */}
        {properties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 lg:p-8 border border-emerald-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <SquareStack className="w-5 h-5 text-emerald-600" />
              Your Favorites Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard 
                label="Total Saved" 
                value={pagination.total || 0} 
                color="text-emerald-600" 
                icon={Heart}
              />
              <StatCard
                label="For Sale"
                value={properties.filter((p) => p.listing_type_name === "sale").length}
                color="text-blue-600"
                icon={Home}
              />
              <StatCard
                label="For Rent"
                value={properties.filter((p) => p.listing_type_name === "rent").length}
                color="text-purple-600"
                icon={Building}
              />
            </div>
            {pagination.total > 0 && (
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <p className="text-sm text-gray-600 text-center">
                  Showing {properties.length} of {pagination.total} favorites
                  {isFilterActive && " matching your filters"}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Tips section for empty state */}
        {properties.length === 0 && !isFilterActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 border border-blue-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started with Favorites</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Browse Properties</h4>
                <p className="text-sm text-gray-600">Explore our listings to find properties you love</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Save Favorites</h4>
                <p className="text-sm text-gray-600">Click the heart icon to save properties you like</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Track & Compare</h4>
                <p className="text-sm text-gray-600">Organize and compare your saved properties</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateX(100%); }
          10%, 90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100%); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-out;
        }
        
        /* Loading shimmer effect */
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Smooth transitions for all interactive elements */
        button, input, select {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Favourites;