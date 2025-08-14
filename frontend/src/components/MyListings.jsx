import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Square, ArrowRight, Heart, Share2, Calendar, Star,
  Edit3, Eye, Trash2, Plus, TrendingUp, CheckCircle, Clock, PauseCircle,
  DollarSign, BarChart3, Filter, Search, Grid, List, MoreVertical,
  Camera, Users, MessageSquare, AlertCircle, RefreshCw, Layers, SortDesc,
  Droplet, Maximize, Sun, Moon, X, User, DollarSign as Dollar,
  Filter as FilterIcon, Check, ChevronDown, ChevronsLeft, ChevronLeft,
  ChevronRight, ChevronsRight
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";

// Import the API hooks
import usePropertiesApi from '../hooks/useProperties';
import { useNlpProperties } from '../hooks/NlpProperties';

// Use a self-contained, stylish confirmation dialog instead of alert().
const CustomAlertDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const propertiesPerPage = 4;

const tabs = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'active', label: 'Active', icon: Clock },
  { id: 'sold', label: 'Sold', icon: CheckCircle },
  { id: 'paused', label: 'Paused', icon: PauseCircle }
];

const sortOptions = [
  { id: 'newest', label: 'Newest First', icon: Calendar },
  { id: 'oldest', label: 'Oldest First', icon: Calendar },
  { id: 'price_high', label: 'Price: High to Low', icon: DollarSign },
  { id: 'price_low', label: 'Price: Low to High', icon: DollarSign },
  { id: 'views_high', label: 'Views: High to Low', icon: Eye },
  { id: 'rating_high', label: 'Rating: High to Low', icon: Star },
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'active': return <Clock className="w-4 h-4 text-emerald-500" />;
    case 'sold': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'paused': return <PauseCircle className="w-4 h-4 text-yellow-500" />;
    default: return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900';
    case 'sold': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900';
    case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900';
    default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
  }
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
  >
    <div className={`flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.text}`} strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value.toLocaleString()}</p>
      </div>
    </div>
  </motion.div>
);

const ListingCard = ({ property, viewMode, onDelete, onEdit }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      key={property.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${viewMode === "list" ? "flex flex-col sm:flex-row gap-0 sm:gap-6" : ""}`}
      whileHover={{ y: viewMode === "grid" ? -8 : 0 }}
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-full sm:w-80 h-48 sm:h-full flex-shrink-0" : "h-48 sm:h-64"}`}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${getStatusColor(property.status)} flex items-center gap-2`}>
            {getStatusIcon(property.status)}
            <span className="hidden xs:inline">{property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-emerald-600 transition-colors truncate">
                {property.title}
              </h3>
              <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <MapPin size={14} className="mr-1 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{property.location}</span>
              </p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{property.priceLabel}</p>
            </div>
          </div>

          {/* Property Features */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-700 my-4">
            {property.beds && (
              <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                <Bed size={16} className="text-emerald-500" />
                <span>{property.beds} beds</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                <Bath size={16} className="text-emerald-500" />
                <span>{property.baths} baths</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                <Square size={16} className="text-emerald-500" />
                <span>{property.area} sq ft</span>
              </div>
            )}
            {property.yearBuilt && (
                <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="text-emerald-500" />
                  <span>{property.yearBuilt}</span>
                </div>
              )}
          </div>

          {/* Performance Stats */}
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-500 text-xs mt-3">
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
              <span>{property.rating || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(property)}
            className="flex-1 bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl py-3 px-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit3 size={16} />
            <span className="hidden xs:inline">Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(property.id)}
            className="flex-1 bg-red-600 text-white font-semibold rounded-xl py-3 px-4 shadow-lg shadow-red-200 dark:shadow-red-900/30 hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Trash2 size={16} />
            <span className="hidden xs:inline">Delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Pagination Component
 * @param {object} props - The component props.
 * @param {number} props.currentPage - The current active page.
 * @param {number} props.totalPages - The total number of pages.
 * @param {function} props.onPageChange - Callback function to set the page.
 * @param {number} props.totalItems - The total number of items across all pages.
 * @param {number} props.itemsPerPage - The number of items displayed per page.
 */
const ElitePagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of items being shown
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generates the array of page numbers and ellipses to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // For more than 7 pages, use ellipses
      if (currentPage <= 4) {
        // If near the beginning
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // If near the end
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // If in the middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Reusable button component for pagination controls
  const PageButton = ({ children, onClick, disabled = false, isActive = false, isIcon = false }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center h-10 rounded-xl font-semibold text-sm transition-all duration-200
        ${isIcon ? 'w-10' : 'px-4'}
        ${disabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400'}
        ${isActive ? '!bg-emerald-600 !text-white !border-emerald-600 dark:!bg-emerald-500 dark:!border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30' : ''}
      `}
    >
      {children}
    </motion.button>
  );

  const Ellipsis = () => (
    <span className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">...</span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
    >
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-bold text-gray-800 dark:text-gray-200">{startItem}</span> to <span className="font-bold text-gray-800 dark:text-gray-200">{endItem}</span> of <span className="font-bold text-gray-800 dark:text-gray-200">{totalItems}</span> results
      </div>
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <PageButton onClick={() => onPageChange(1)} disabled={currentPage === 1} isIcon>
          <ChevronsLeft size={16} />
        </PageButton>
        <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} isIcon>
          <ChevronLeft size={16} />
        </PageButton>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <Ellipsis key={`ellipsis-${index}`} />
          ) : (
            <PageButton
              key={page}
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PageButton>
          )
        )}

        <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} isIcon>
          <ChevronRight size={16} />
        </PageButton>
        <PageButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} isIcon>
          <ChevronsRight size={16} />
        </PageButton>
      </nav>
    </motion.div>
  );
};


// Main App Component
const MyListings = () => {
  const navigate = useNavigate();

  // New filter state vars (UI-driven)
  const [minBeds, setMinBeds] = useState('');
  const [minBaths, setMinBaths] = useState('');
  const [minArea, setMinArea] = useState('');
  const [listingType, setListingType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Core UI state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const priceRangeValue = [minPrice ? Number(minPrice) : 0, maxPrice ? Number(maxPrice) : 150000000];
  // Sorting
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [nlpQuery, setNlpQuery] = useState('');

  // Tab, view, modal states
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [listings, setListings] = useState([]); // Local cache for delete placeholder
  const [likedProperties, setLikedProperties] = useState(new Set());

  // NLP mode
  const isNlpActive = nlpQuery.trim().length > 0;

  // API calls
  const {
    data: normalData,
    isLoading: normalLoading,
    error: normalError,
  } = usePropertiesApi({
    filter,
    searchTerm,
    priceRange: priceRangeValue,
    sortBy: sortBy,
    currentPage: page,
    limit: propertiesPerPage,
    minBeds,
    minBaths,
    minArea,
    listingType,
    minPrice,
    maxPrice,
    
  });

  const {
    data: nlpData,
    isLoading: nlpLoading,
    error: nlpError,
  } = useNlpProperties({
    query: nlpQuery,
    page,
    limit: propertiesPerPage,
    filter,
    priceRange: priceRangeValue,
    sort: sortBy,
  });

  // UI data aggregation
  const properties = isNlpActive
    ? (nlpData?.properties?.map(p => p?.property ?? p) || [])
    : (normalData?.data || []);

  const totalListingsCount = isNlpActive
    ? (nlpData?.count ?? 0)
    : (normalData?.pagination?.total ?? 0);

  // Sync tab to API filter
  useEffect(() => {
    if (activeTab === 'all') {
      setFilter('all');
    } else if (activeTab === 'active') {
      setFilter('active');
    } else if (activeTab === 'sold') {
      setFilter('sold');
    } else if (activeTab === 'paused') {
      setFilter('paused');
    }
  }, [activeTab]);

  // Handlers
  const handleDeleteListing = useCallback((id) => {
    setListingToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setListings(prev => prev.filter(listing => listing.id !== listingToDelete));
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, [listingToDelete]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, []);

  const handleEditListing = useCallback((property) => {
    alert(`Editing listing: ${property.title}`);
  }, []);

  // Sorting dropdown
  const SortDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = sortOptions.find(opt => opt.id === sortBy);

    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <SortDesc size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Sort by:</span>
          <span className="font-bold whitespace-nowrap">{selectedOption?.label ?? ''}</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => { setSortBy(option.id); setIsOpen(false); }}
                    className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Icon size={14} className="sm:w-4 sm:h-4" />
                      {option.label}
                    </span>
                    {sortBy === option.id && <Check size={14} className="sm:w-4 sm:h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Filter Modal wired to main filter state
  const FilterModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsFilterModalOpen(false)}
        ></div>

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Advanced Filters
            </h3>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Form Fields (wired to main state) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="minBeds" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Beds
              </label>
              <input
                type="number"
                id="minBeds"
                value={minBeds}
                onChange={(e) => setMinBeds(e.target.value)}
                placeholder="e.g., 2"
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="minBaths" className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Baths</label>
              <input type="number" id="minBaths" value={minBaths} onChange={(e) => setMinBaths(e.target.value)} placeholder="e.g., 2" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="minArea" className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Area (sq ft)</label>
              <input type="number" id="minArea" value={minArea} onChange={(e) => setMinArea(e.target.value)} placeholder="e.g., 1000" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="listingType" className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select id="listingType" value={listingType} onChange={(e) => setListingType(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="minPrice" className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
              <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="e.g., 5000000" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
              <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g., 50000000" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Clear Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl py-2 sm:py-3 px-4 sm:px-6 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 text-sm sm:text-base"
            >
              Apply Filters
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Reset All Filters
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setNlpQuery('');
    setActiveTab('all');
    setFilter('all');
    setMinBeds('');
    setMinBaths('');
    setMinArea('');
    setListingType('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSortBy('newest');
  }, []);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(totalListingsCount / propertiesPerPage));

  // Derived actions
  const handleApplyFilters = () => {
    // Apply is reflected by bound state; reset to first page
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    // Clear individual fields (FilterModal uses this too)
    setMinBeds('');
    setMinBaths('');
    setMinArea('');
    setListingType('');
    setMinPrice('');
    setMaxPrice('');
  };

  // The main component renders the whole page
  return (
    <div className={`${darkMode ? 'dark' : ''} font-sans`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6 lg:p-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">My Listings</h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Manage and track the performance of your property listings.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                <Plus size={20} />
                Add New Listing
              </motion.button>
            </div>
          </motion.header>

          {/* Stats and Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            {/* Stats Summary */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100 dark:border-gray-700">
              <StatCard
                icon={Layers}
                label="Total Listings"
                value={totalListingsCount}
                color={{ bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-300" }}
              />
              <StatCard
                icon={Clock}
                label="Active Listings"
                value={properties.filter(p => p.status === 'active').length}
                color={{ bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-300" }}
              />
              <StatCard
                icon={CheckCircle}
                label="Sold Listings"
                value={properties.filter(p => p.status === 'sold').length}
                color={{ bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-300" }}
              />
              <StatCard
                icon={PauseCircle}
                label="Paused Listings"
                value={properties.filter(p => p.status === 'paused').length}
                color={{ bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-300" }}
              />
            </div>

            {/* Filters, Search, and View Controls */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-emerald-400 snap-x snap-mandatory">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-300'
                    }`}
                  >
                    {(() => { const Icon = tab.icon; return <Icon size={16} />; })()}
                    <span className="whitespace-nowrap">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 dark:bg-black/20' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}>
                      {properties.filter(p => tab.id === 'all' || p.status === tab.id).length}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap w-full">
                <div className="relative flex-1 sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <FilterIcon size={18} />
                    Advanced Filters
                  </motion.button>

                  <SortDropdown />

                  <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300'}`}
                    >
                      <Grid size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300'}`}
                    >
                      <List size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Reset Filters Button in main controls */}
              <div className="flex justify-end mt-2">
                <button onClick={handleResetFilters} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <RefreshCw size={16} />
                  Reset Filters
                </button>
              </div>

            </div>
          </motion.div>

          {/* Properties Grid/List */}
          <AnimatePresence mode="wait">
             {(normalLoading && !isNlpActive) || (nlpLoading && isNlpActive) ? (
                <p className="text-center text-gray-500 py-20">Loading properties...</p>
              ) : (normalError && !isNlpActive) || (nlpError && isNlpActive) ? (
                <p className="text-center text-red-500 py-20">Error loading properties.</p>
              ) : properties.length > 0 ? (
                <>
                   <PropertyGrid
                     properties={properties}
                     viewMode={viewMode}
                     likedProperties={likedProperties}
                     toggleLike={() => {}} // No like function for my listings
                     onDelete={handleDeleteListing}
                     onEdit={handleEditListing}
                   />
                   {/* NEW: Elite Pagination controls */}
                   <ElitePagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={totalListingsCount}
                      itemsPerPage={propertiesPerPage}
                   />
                </>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`col-span-full text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700`}
              >
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No listings found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base px-4 max-w-sm mx-auto">
                  There are no listings that match your current filters. Try adjusting your search.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetFilters}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl transition-all duration-300 text-base"
                >
                  <RefreshCw className="inline-block w-4 h-4 mr-2" />
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFilterModalOpen && <FilterModal />}
        {isDeleteModalOpen && (
          <CustomAlertDialog
            title="Delete Listing?"
            message="Are you sure you want to permanently delete this listing? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default MyListings;