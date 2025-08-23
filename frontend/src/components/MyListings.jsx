import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Eye,
  Trash2,
  Plus,
  TrendingUp,
  CheckCircle,
  Clock,
  PauseCircle,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  Grid,
  List,
  MoreVertical,
  Camera,
  Users,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Layers,
  SortDesc,
  Droplet,
  Maximize,
  Sun,
  Moon,
  X,
  User,
  DollarSign as Dollar,
  Filter as FilterIcon,
  Check,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";

// Use a self-contained, stylish confirmation dialog instead of alert().
const CustomAlertDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
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
    property_id: 1,
    title: "Modern Downtown Apartment",
    location_name: "Downtown, Karachi",
    price: "8500000",
    priceLabel: "Rs 8,500,000",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1200,
    status: "active",
    views: 142,
    inquiries: 8,
    daysListed: 12,
    rating: 4.8,
    listing_type_name: "sale",
    year_built: 2020,
    waterSupply: true,
    powerBackup: false,
    security: true,
  },
  {
    property_id: 2,
    title: "Luxury Villa with Garden",
    location_name: "Clifton, Karachi",
    price: "25000000",
    priceLabel: "Rs 25,000,000",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600",
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 3500,
    status: "sold",
    views: 89,
    inquiries: 15,
    daysListed: 45,
    soldDate: "2025-07-15",
    rating: 4.9,
    listing_type_name: "sale",
    year_built: 2018,
    waterSupply: true,
    powerBackup: true,
    security: true,
  },
  {
    property_id: 3,
    title: "Cozy Studio Apartment",
    location_name: "Gulshan-e-Iqbal, Karachi",
    price: "35000",
    priceLabel: "Rs 35,000/month",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600",
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 450,
    status: "active",
    views: 67,
    inquiries: 4,
    daysListed: 8,
    rating: 4.5,
    listing_type_name: "rent",
    year_built: 2019,
    waterSupply: true,
    powerBackup: false,
    security: false,
  },
  {
    property_id: 4,
    title: "Commercial Office Space",
    location_name: "I.I. Chundrigar Road, Karachi",
    price: "12000000",
    priceLabel: "Rs 12,000,000",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    bedrooms: null,
    bathrooms: 3,
    area_sqft: 2000,
    status: "paused",
    views: 234,
    inquiries: 12,
    daysListed: 30,
    rating: 4.7,
    listing_type_name: "sale",
    year_built: 2017,
    waterSupply: false,
    powerBackup: true,
    security: true,
  },
  {
    property_id: 5,
    title: "Beachfront Penthouse",
    location_name: "Sea View, Karachi",
    price: "45000000",
    priceLabel: "Rs 45,000,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2800,
    status: "sold",
    views: 312,
    inquiries: 28,
    daysListed: 60,
    soldDate: "2025-06-20",
    rating: 5.0,
    listing_type_name: "sale",
    year_built: 2021,
    waterSupply: true,
    powerBackup: true,
    security: true,
  },
  {
    property_id: 6,
    title: "Spacious Family Home",
    location_name: "DHA, Karachi",
    price: "32000000",
    priceLabel: "Rs 32,000,000",
    image:
      "https://images.unsplash.com/photo-1570129477041-3832c3f84394?q=80&w=600",
    bedrooms: 6,
    bathrooms: 5,
    area_sqft: 4000,
    status: "active",
    views: 250,
    inquiries: 20,
    daysListed: 7,
    rating: 4.9,
    listing_type_name: "sale",
    year_built: 2015,
    waterSupply: true,
    powerBackup: true,
    security: true,
  },
  {
    property_id: 7,
    title: "Newly Built Townhouse",
    location_name: "Gulistan-e-Jauhar, Karachi",
    price: "65000",
    priceLabel: "Rs 65,000/month",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b252?q=80&w=600",
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 1500,
    status: "active",
    views: 110,
    inquiries: 10,
    daysListed: 15,
    rating: 4.6,
    listing_type_name: "rent",
    year_built: 2023,
    waterSupply: true,
    powerBackup: true,
    security: false,
  },
  {
    id: 8,
    title: "Charming Cottage",
    location: "Malir, Karachi",
    price: "7000000",
    priceLabel: "Rs 7,000,000",
    image:
      "https://images.unsplash.com/photo-1588147575971-897d264a7c13?q=80&w=600",
    beds: 2,
    baths: 1,
    area_sqft: 900,
    status: "paused",
    views: 95,
    inquiries: 6,
    daysListed: 25,
    rating: 4.2,
    listing_type_name: "sale",
    year_built: 2005,
    waterSupply: true,
    powerBackup: false,
    security: false,
  },
];

const tabs = [
  { id: "all", label: "All", icon: Layers },
  { id: "active", label: "Active", icon: Clock },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "paused", label: "Paused", icon: PauseCircle },
];

const sortOptions = [
  { id: "newest", label: "Newest First", icon: Calendar },
  { id: "oldest", label: "Oldest First", icon: Calendar },
  { id: "price_high", label: "Price: High to Low", icon: Dollar },
  { id: "price_low", label: "Price: Low to High", icon: Dollar },
  { id: "views_high", label: "Views: High to Low", icon: Eye },
  { id: "rating_high", label: "Rating: High to Low", icon: Star },
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

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
  >
    <div className={`flex items-center gap-4`}>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg}`}
      >
        <Icon className={`w-6 h-6 ${color.text}`} strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  </motion.div>
);

// Main App Component
const MyListings = () => {
  // State for all dashboard settings
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [listings, setListings] = useState(mockListings);
  const [listingToEdit, setListingToEdit] = useState(null);
  

  const [likedProperties, setLikedProperties] = useState(new Set());

  const navigate = useNavigate();

  const navigateToSellPage = useCallback(() => {
    navigate("/sell");
  }, [navigate]);

  // Toggle Like
  const toggleLike = (id) => {
    setLikedProperties((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };
  // Filter state for advanced filters
  const [filters, setFilters] = useState({
    minBeds: "",
    minBaths: "",
    minArea: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
  });

  // Derived state from filters and search
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = listings;

    // Step 1: Filter by Status Tab
    if (activeTab !== "all") {
      filtered = filtered.filter((prop) => prop.status === activeTab);
    }

    // Step 2: Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter(
        (prop) =>
          prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Step 3: Apply Advanced Filters
    if (filters.minBeds) {
      filtered = filtered.filter(
        (prop) => (prop.beds || 0) >= parseInt(filters.minBeds)
      );
    }
    if (filters.minBaths) {
      filtered = filtered.filter(
        (prop) => (prop.baths || 0) >= parseInt(filters.minBaths)
      );
    }
    if (filters.minArea) {
      filtered = filtered.filter(
        (prop) => (prop.area_sqft || 0) >= parseInt(filters.minArea)
      );
    }
    if (filters.listingType) {
      filtered = filtered.filter((prop) => prop.listing_type_name === filters.listingType);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(
        (prop) => (prop.price || 0) >= parseInt(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (prop) => (prop.price || 0) <= parseInt(filters.maxPrice)
      );
    }

    // Step 4: Sort the results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return b.id - a.id;
        case "oldest":
          return a.id - b.id;
        case "price_high":
          return (b.price || 0) - (a.price || 0);
        case "price_low":
          return (a.price || 0) - (b.price || 0);
        case "views_high":
          return (b.views || 0) - (a.views || 0);
        case "rating_high":
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
    setListings(listings.filter((listing) => listing.id !== listingToDelete));
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, [listings, listingToDelete]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  }, []);

  // Handler for edit - currently a placeholder
 const handleEditListing = useCallback((property) => {
  setListingToEdit(property); // Change this line
}, []);

const handleCloseEditModal = useCallback(() => {
  setListingToEdit(null);
}, []);

const handleSaveChanges = useCallback((editedListing) => {
  // Recalculate the priceLabel before saving
  const newPriceLabel = formatPrice(
    editedListing.price,
    editedListing.type
  );

  setListings((prevListings) =>
    prevListings.map((listing) =>
      listing.id === editedListing.id
        ? { ...editedListing, priceLabel: newPriceLabel }
        : listing
    )
  );

  // Close the modal
  setListingToEdit(null);
}, []);

  const handleChangeStatus = useCallback((id, newStatus) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );
  }, []);

  const totalListings = listings.length;
  const activeListings = listings.filter((p) => p.status === "active").length;
  const soldListings = listings.filter((p) => p.status === "sold").length;
  const pausedListings = listings.filter((p) => p.status === "paused").length;

  const getTabCount = (tabId) => {
    switch (tabId) {
      case "all":
        return totalListings;
      case "active":
        return activeListings;
      case "sold":
        return soldListings;
      case "paused":
        return pausedListings;
      default:
        return 0;
    }
  };

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveTab("all");
    setFilters({
      minBeds: "",
      minBaths: "",
      minArea: "",
      listingType: "",
      minPrice: "",
      maxPrice: "",
    });
  }, []);

  // Custom dropdown for sorting
  const SortDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = sortOptions.find((opt) => opt.id === sortOrder);

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
          <span className="font-bold whitespace-nowrap">
            {selectedOption.label}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
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
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortOrder(option.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <option.icon size={14} className="sm:w-4 sm:h-4" />
                    {option.label}
                  </span>
                  {sortOrder === option.id && (
                    <Check size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                  )}
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
      setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
      setFilters(tempFilters);
      setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
      setTempFilters({
        minBeds: "",
        minBaths: "",
        minArea: "",
        listingType: "",
        minPrice: "",
        maxPrice: "",
      });
      setFilters({
        minBeds: "",
        minBaths: "",
        minArea: "",
        listingType: "",
        minPrice: "",
        maxPrice: "",
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
            <div className="flex flex-col gap-2">
              <label
                htmlFor="minBeds"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
            <div className="flex flex-col gap-2">
              <label
                htmlFor="minBaths"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Min Baths
              </label>
              <input
                type="number"
                id="minBaths"
                name="minBaths"
                value={tempFilters.minBaths}
                onChange={handleFilterChange}
                placeholder="e.g., 2"
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="minArea"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Min Area (sq ft)
              </label>
              <input
                type="number"
                id="minArea"
                name="minArea"
                value={tempFilters.minArea}
                onChange={handleFilterChange}
                placeholder="e.g., 1000"
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="listingType"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Type
              </label>
              <select
                id="listingType"
                name="listingType"
                value={tempFilters.listingType}
                onChange={handleFilterChange}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="minPrice"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={tempFilters.minPrice}
                onChange={handleFilterChange}
                placeholder="e.g., 5000000"
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="maxPrice"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={tempFilters.maxPrice}
                onChange={handleFilterChange}
                placeholder="e.g., 50000000"
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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

const formatPrice = (price, type) => {
  if (!price) return "N/A";
  const formatter = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formattedPrice = formatter.format(price).replace("PKR", "Rs").trim();
  return `${formattedPrice}${type === "rent" ? "/month" : ""}`;
};

const EditFormModal = ({ listing, onSave, onCancel }) => {
  const [editedListing, setEditedListing] = useState(listing);

  useEffect(() => {
    if (listing) {
      setEditedListing(listing);
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setEditedListing((prev) => ({ ...prev, status }));
  };

  const handleSave = () => {
    onSave(editedListing);
  };

  if (!listing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto transform-gpu border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            ✨ Edit Listing
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={22} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedListing.title}
                onChange={handleChange}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                placeholder="e.g. Modern Family Home"
              />
            </div>

            {/* Price + Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <span className="text-base font-bold">₨</span>
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={editedListing.price}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-gray-300 pl-9 pr-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="250000"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedListing.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="block w-full rounded-xl border-gray-300 shadow-sm py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Beds/Baths/Area */}
            {/* Beds/Baths/Area */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Details
  </label>
  <div className="grid grid-cols-3 gap-6">
    <div className="flex flex-col">
      <label htmlFor="beds" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Beds</label>
      <input
        type="number"
        id="beds"
        name="beds"
        value={editedListing.beds}
        onChange={handleChange}
        className="block w-full rounded-xl border-gray-300 shadow-sm px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Beds"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="baths" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Baths</label>
      <input
        type="number"
        id="baths"
        name="baths"
        value={editedListing.baths}
        onChange={handleChange}
        className="block w-full rounded-xl border-gray-300 shadow-sm px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Baths"
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="area_sqft" className="text-sm text-gray-500 dark:text-gray-400 mb-1">Area (Sqft)</label>
      <input
        type="number"
        id="area_sqft"
        name="area_sqft"
        value={editedListing.area_sqft}
        onChange={handleChange}
        className="block w-full rounded-xl border-gray-300 shadow-sm px-3 py-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Sqft"
      />
    </div>
  </div>
</div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
  // The main component renders the whole page
  return (
    <div className={`font-sans`}>
      <div className="min-h-screen bg-white  p-2 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-700 dark:text-gray-100 mb-1">
                My Listings
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Manage and track the performance of your property listings.
              </p>
            </div>
            <div className="flex items-center gap-4">

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={navigateToSellPage}
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
                color={{
                  bg: "bg-gray-100 dark:bg-gray-700",
                  text: "text-gray-600 dark:text-gray-300",
                }}
              />
              <StatCard
                icon={Clock}
                label="Active Listings"
                value={activeListings}
                color={{
                  bg: "bg-emerald-100 dark:bg-emerald-900/30",
                  text: "text-emerald-600 dark:text-emerald-300",
                }}
              />
              <StatCard
                icon={CheckCircle}
                label="Sold Listings"
                value={soldListings}
                color={{
                  bg: "bg-green-100 dark:bg-green-900/30",
                  text: "text-green-600 dark:text-green-300",
                }}
              />
              <StatCard
                icon={PauseCircle}
                label="Paused Listings"
                value={pausedListings}
                color={{
                  bg: "bg-yellow-100 dark:bg-yellow-900/30",
                  text: "text-yellow-600 dark:text-yellow-300",
                }}
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
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-300"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 dark:bg-black/20"
                          : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                      }`}
                    >
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
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                          : "text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300"
                      }`}
                    >
                      <Grid size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                          : "text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-300"
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
              <PropertyGrid
                properties={filteredAndSortedProperties}
                viewMode={viewMode}
                likedProperties={likedProperties}
                toggleLike={toggleLike}
                isOwner={true}
                onDelete={handleDeleteListing}
                onEdit={handleEditListing}
                onChangeStatus={handleChangeStatus}
              />
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base px-4 max-w-sm mx-auto">
                  There are no listings that match your current filters. Try
                  adjusting your search.
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
          {listingToEdit && (
    <EditFormModal
      listing={listingToEdit}
      onSave={handleSaveChanges}
      onCancel={handleCloseEditModal}
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