import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Square, ArrowRight, Heart, Share2, Calendar, Star,
  Edit3, Eye, Trash2, Plus, TrendingUp, CheckCircle, Clock, PauseCircle,
  DollarSign, BarChart3, Filter, Search, Grid, List, MoreVertical,
  Camera, Users, MessageSquare, AlertCircle, RefreshCw, Layers, SortDesc,
  Droplet, Maximize, Sun, Moon, X, User, DollarSign as Dollar,
  Filter as FilterIcon, Check, ChevronDown
} from 'lucide-react';

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

// Mock data for user listings
const mockListings = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, Karachi",
    price: 8500000,
    priceLabel: "Rs 8,500,000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600",
    beds: 3,
    baths: 2,
    area: 1200,
    status: "active",
    views: 142,
    inquiries: 8,
    daysListed: 12,
    rating: 4.8,
    type: "sale",
    yearBuilt: 2020,
    waterSupply: true,
    powerBackup: false,
    security: true
  },
  {
    id: 2,
    title: "Luxury Villa with Garden",
    location: "Clifton, Karachi",
    price: 25000000,
    priceLabel: "Rs 25,000,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600",
    beds: 5,
    baths: 4,
    area: 3500,
    status: "sold",
    views: 89,
    inquiries: 15,
    daysListed: 45,
    soldDate: "2025-07-15",
    rating: 4.9,
    type: "sale",
    yearBuilt: 2018,
    waterSupply: true,
    powerBackup: true,
    security: true
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    location: "Gulshan-e-Iqbal, Karachi",
    price: 35000,
    priceLabel: "Rs 35,000/month",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600",
    beds: 1,
    baths: 1,
    area: 450,
    status: "active",
    views: 67,
    inquiries: 4,
    daysListed: 8,
    rating: 4.5,
    type: "rent",
    yearBuilt: 2019,
    waterSupply: true,
    powerBackup: false,
    security: false
  },
  {
    id: 4,
    title: "Commercial Office Space",
    location: "I.I. Chundrigar Road, Karachi",
    price: 12000000,
    priceLabel: "Rs 12,000,000",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    beds: null,
    baths: 3,
    area: 2000,
    status: "paused",
    views: 234,
    inquiries: 12,
    daysListed: 30,
    rating: 4.7,
    type: "sale",
    yearBuilt: 2017,
    waterSupply: false,
    powerBackup: true,
    security: true
  },
  {
    id: 5,
    title: "Beachfront Penthouse",
    location: "Sea View, Karachi",
    price: 45000000,
    priceLabel: "Rs 45,000,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
    beds: 4,
    baths: 3,
    area: 2800,
    status: "sold",
    views: 312,
    inquiries: 28,
    daysListed: 60,
    soldDate: "2025-06-20",
    rating: 5.0,
    type: "sale",
    yearBuilt: 2021,
    waterSupply: true,
    powerBackup: true,
    security: true
  },
  {
    id: 6,
    title: "Spacious Family Home",
    location: "DHA, Karachi",
    price: 32000000,
    priceLabel: "Rs 32,000,000",
    image: "https://images.unsplash.com/photo-1570129477041-3832c3f84394?q=80&w=600",
    beds: 6,
    baths: 5,
    area: 4000,
    status: "active",
    views: 250,
    inquiries: 20,
    daysListed: 7,
    rating: 4.9,
    type: "sale",
    yearBuilt: 2015,
    waterSupply: true,
    powerBackup: true,
    security: true
  },
  {
    id: 7,
    title: "Newly Built Townhouse",
    location: "Gulistan-e-Jauhar, Karachi",
    price: 65000,
    priceLabel: "Rs 65,000/month",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b252?q=80&w=600",
    beds: 3,
    baths: 3,
    area: 1500,
    status: "active",
    views: 110,
    inquiries: 10,
    daysListed: 15,
    rating: 4.6,
    type: "rent",
    yearBuilt: 2023,
    waterSupply: true,
    powerBackup: true,
    security: false
  },
  {
    id: 8,
    title: "Charming Cottage",
    location: "Malir, Karachi",
    price: 7000000,
    priceLabel: "Rs 7,000,000",
    image: "https://images.unsplash.com/photo-1588147575971-897d264a7c13?q=80&w=600",
    beds: 2,
    baths: 1,
    area: 900,
    status: "paused",
    views: 95,
    inquiries: 6,
    daysListed: 25,
    rating: 4.2,
    type: "sale",
    yearBuilt: 2005,
    waterSupply: true,
    powerBackup: false,
    security: false
  }
];

const tabs = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'active', label: 'Active', icon: Clock },
  { id: 'sold', label: 'Sold', icon: CheckCircle },
  { id: 'paused', label: 'Paused', icon: PauseCircle }
];

const sortOptions = [
  { id: 'newest', label: 'Newest First', icon: Calendar },
  { id: 'oldest', label: 'Oldest First', icon: Calendar },
  { id: 'price_high', label: 'Price: High to Low', icon: Dollar },
  { id: 'price_low', label: 'Price: Low to High', icon: Dollar },
  { id: 'views_high', label: 'Views: High to Low', icon: Eye },
  { id: 'rating_high', label: 'Rating: High to Low', icon: Star },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
    variants={itemVariants}
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
  const [showActions, setShowActions] = useState(false);

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
            <span className="hidden xs:inline">{property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
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
            <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-emerald-500" />
              <span>{property.yearBuilt}</span>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-500 text-xs mt-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                <span>{property.views} views</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>{property.inquiries} inquiries</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{property.daysListed} days</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} fill="currentColor" className="text-yellow-400" />
              <span>{property.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-5 relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl py-3 px-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <BarChart3 size={16} />
            <span className="hidden xs:inline">Analytics</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(property)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl py-3 px-4 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit3 size={16} />
            <span className="hidden xs:inline">Edit</span>
          </motion.button>

          {/* More actions dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <MoreVertical size={20} />
            </motion.button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-14 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-xl z-20 overflow-hidden border border-gray-100 dark:border-gray-600"
                >
                  <button className="flex items-center gap-2 p-3 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <TrendingUp size={16} /> Promote
                  </button>
                  <button onClick={() => onDelete(property.id)} className="flex items-center gap-2 p-3 w-full text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 size={16} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main App Component
const MyListings = () => {
  // State for all dashboard settings
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [listings, setListings] = useState(mockListings);

  // Filter state for advanced filters
  const [filters, setFilters] = useState({
    minBeds: '',
    minBaths: '',
    minArea: '',
    listingType: '',
    minPrice: '',
    maxPrice: ''
  });

  // Derived state from filters and search
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = listings;
    
    // Step 1: Filter by Status Tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(prop => prop.status === activeTab);
    }
    
    // Step 2: Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter(prop => 
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Step 3: Apply Advanced Filters
    if (filters.minBeds) {
      filtered = filtered.filter(prop => (prop.beds || 0) >= parseInt(filters.minBeds));
    }
    if (filters.minBaths) {
      filtered = filtered.filter(prop => (prop.baths || 0) >= parseInt(filters.minBaths));
    }
    if (filters.minArea) {
      filtered = filtered.filter(prop => (prop.area || 0) >= parseInt(filters.minArea));
    }
    if (filters.listingType) {
      filtered = filtered.filter(prop => prop.type === filters.listingType);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(prop => (prop.price || 0) >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(prop => (prop.price || 0) <= parseInt(filters.maxPrice));
    }

    // Step 4: Sort the results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'views_high':
          return (b.views || 0) - (a.views || 0);
        case 'rating_high':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return b.id - a.id;
      }
    });

    return sorted;
  }, [listings, activeTab, searchQuery, filters, sortOrder]);

  // Handler for delete confirmation
  const handleDeleteListing = useCallback((id) => {
    setListingToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setListings(listings.filter(listing => listing.id !== listingToDelete));
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, [listings, listingToDelete]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, []);

  // Handler for edit - currently a placeholder
  const handleEditListing = useCallback((property) => {
    alert(`Editing listing: ${property.title}`);
  }, []);

  const totalListings = listings.length;
  const activeListings = listings.filter(p => p.status === 'active').length;
  const soldListings = listings.filter(p => p.status === 'sold').length;
  const pausedListings = listings.filter(p => p.status === 'paused').length;

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'all': return totalListings;
      case 'active': return activeListings;
      case 'sold': return soldListings;
      case 'paused': return pausedListings;
      default: return 0;
    }
  };

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
    setFilters({
      minBeds: '',
      minBaths: '',
      minArea: '',
      listingType: '',
      minPrice: '',
      maxPrice: ''
    });
  }, []);
  
  // Custom dropdown for sorting
  const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = sortOptions.find(opt => opt.id === sortOrder);

  return (
    <div className="relative">
      {/* Sort Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <SortDesc size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden sm:inline">Sort by:</span>
        <span className="font-bold whitespace-nowrap">{selectedOption.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => { setSortOrder(option.id); setIsOpen(false); }}
                className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <option.icon size={14} className="sm:w-4 sm:h-4" />
                  {option.label}
                </span>
                {sortOrder === option.id && <Check size={14} className="sm:w-4 sm:h-4 text-emerald-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


  // Advanced Filter Modal
const FilterModal = () => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      minBeds: '',
      minBaths: '',
      minArea: '',
      listingType: '',
      minPrice: '',
      maxPrice: ''
    });
    setFilters({
      minBeds: '',
      minBaths: '',
      minArea: '',
      listingType: '',
      minPrice: '',
      maxPrice: ''
    });
    setIsFilterModalOpen(false);
  };

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

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
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

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Each field */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label htmlFor="minBeds" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Min Beds
            </label>
            <input
              type="number"
              id="minBeds"
              name="minBeds"
              value={tempFilters.minBeds}
              onChange={handleFilterChange}
              placeholder="e.g., 2"
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Repeat similar changes for other inputs/selects */}
          {/* ... */}
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
      value={totalListings}
      color={{ bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-300" }}
    />
    <StatCard
      icon={Clock}
      label="Active Listings"
      value={activeListings}
      color={{ bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-300" }}
    />
    <StatCard
      icon={CheckCircle}
      label="Sold Listings"
      value={soldListings}
      color={{ bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-300" }}
    />
    <StatCard
      icon={PauseCircle}
      label="Paused Listings"
      value={pausedListings}
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
                    <tab.icon size={16} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-white/20 dark:bg-black/20' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }`}>
                      {getTabCount(tab.id)}
                    </span>
                  </motion.button>
                ))}
              </div>

{/* yahan se resonsive hogi filter wali jagah */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap w-full">

                <div className="relative flex-1 sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300'
                      }`}
                    >
                      <Grid size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300'
                      }`}
                    >
                      <List size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid/List */}
          <AnimatePresence mode="wait">
            {filteredAndSortedProperties.length > 0 ? (
              <motion.div
                key={`${viewMode}-${activeTab}-${sortOrder}-${JSON.stringify(filters)}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                  : "space-y-6 lg:space-y-8"
                }
              >
                {filteredAndSortedProperties.map((property) => (
                  <ListingCard
                    key={property.id}
                    property={property}
                    viewMode={viewMode}
                    onDelete={handleDeleteListing}
                    onEdit={handleEditListing}
                  />
                ))}
              </motion.div>
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
<<<<<<< HEAD
              ))}
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-emerald-600'
                  }`}
                >
                  <Grid size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-emerald-600'
                  }`}
                >
                  <List size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${activeTab}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
              : "space-y-4 sm:space-y-6"
            }
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${viewMode === "list" ? "flex flex-col sm:flex-row gap-0 sm:gap-6" : ""}`}
                whileHover={{ y: viewMode === "grid" ? -8 : 0 }}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-full sm:w-80 h-48 sm:h-64" : "h-48 sm:h-64"}`}>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${getStatusColor(property.status)} flex items-center gap-1`}>
                      {getStatusIcon(property.status)}
                      <span className="hidden xs:inline">{property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Hidden on mobile, shown on hover on desktop */}
                  <div className="hidden sm:flex absolute top-3 sm:top-4 right-3 sm:right-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <Edit3 size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>

                  {/* Performance Stats Overlay */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex gap-2">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <Eye size={10} className="sm:w-3 sm:h-3" />
                      <span className="text-xs">{property.views}</span>
                    </div>
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <MessageSquare size={10} className="sm:w-3 sm:h-3" />
                      <span className="text-xs">{property.inquiries}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className={`p-4 sm:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors truncate">
                        {property.title}
                      </h3>
                      <p className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5 mr-1 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Calendar size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                        <span>Listed {property.daysListed} days ago</span>
                        {property.soldDate && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Sold on {new Date(property.soldDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-lg sm:text-2xl font-bold text-emerald-600">{property.price}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star size={10} fill="currentColor" className="sm:w-3 sm:h-3 text-yellow-400" />

                        <span className="text-xs sm:text-sm text-gray-600">{property.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex justify-between items-center py-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-700">
                      {property.beds !== "N/A" && (
                        <div className="flex items-center gap-1">
                          <Bed size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                          <span className="text-xs sm:text-sm">{property.beds}</span>
                        </div>
                      )}
                      {property.baths !== "N/A" && (
                        <div className="flex items-center gap-1">
                          <Bath size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                          <span className="text-xs sm:text-sm">{property.baths}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Square size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                        <span className="text-xs sm:text-sm">{property.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 text-sm sm:text-base"
                    >
                      <Edit3 size={14} className="sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <BarChart3 size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Analytics</span>
                      <span className="xs:hidden">Stats</span>
                    </motion.button>
                  </div>
                </div>
=======
>>>>>>> bcab5acec35d476ee50087e76321a4fd484570ff
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
