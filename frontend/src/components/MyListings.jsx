import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Square, ArrowRight, Heart, Share2, Calendar, Star,
  Edit3, Eye, Trash2, Plus, TrendingUp, CheckCircle, Clock, PauseCircle,
  DollarSign, BarChart3, Filter, Search, Grid, List, MoreVertical,
  Camera, Users, MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react';

// Mock data for user listings
const mockListings = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, Karachi",
    price: "Rs 8,500,000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    beds: "3",
    baths: "2",
    area: "1,200 sq ft",
    status: "active",
    views: 142,
    inquiries: 8,
    daysListed: 12,
    rating: 4.8,
    type: "sale",
    yearBuilt: "2020"
  },
  {
    id: 2,
    title: "Luxury Villa with Garden",
    location: "Clifton, Karachi",
    price: "Rs 25,000,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
    beds: "5",
    baths: "4",
    area: "3,500 sq ft",
    status: "sold",
    views: 89,
    inquiries: 15,
    daysListed: 45,
    soldDate: "2025-07-15",
    rating: 4.9,
    type: "sale",
    yearBuilt: "2018"
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    location: "Gulshan-e-Iqbal, Karachi",
    price: "Rs 35,000/month",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    beds: "1",
    baths: "1",
    area: "450 sq ft",
    status: "active",
    views: 67,
    inquiries: 4,
    daysListed: 8,
    rating: 4.5,
    type: "rent",
    yearBuilt: "2019"
  },
  {
    id: 4,
    title: "Commercial Office Space",
    location: "I.I. Chundrigar Road, Karachi",
    price: "Rs 12,000,000",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    beds: "N/A",
    baths: "3",
    area: "2,000 sq ft",
    status: "paused",
    views: 234,
    inquiries: 12,
    daysListed: 30,
    rating: 4.7,
    type: "sale",
    yearBuilt: "2017"
  },
  {
    id: 5,
    title: "Beachfront Penthouse",
    location: "Sea View, Karachi",
    price: "Rs 45,000,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    beds: "4",
    baths: "3",
    area: "2,800 sq ft",
    status: "sold",
    views: 312,
    inquiries: 28,
    daysListed: 60,
    soldDate: "2025-06-20",
    rating: 5.0,
    type: "sale",
    yearBuilt: "2021"
  }
];

const MyListings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filterProperties = (properties, status) => {
    let filtered = properties;
    
    if (status !== 'all') {
      filtered = filtered.filter(prop => prop.status === status);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(prop => 
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />;
      case 'sold': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'paused': return <PauseCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sold': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: mockListings.length },
    { id: 'active', label: 'Active', count: mockListings.filter(p => p.status === 'active').length },
    { id: 'sold', label: 'Sold', count: mockListings.filter(p => p.status === 'sold').length },
    { id: 'paused', label: 'Paused', count: mockListings.filter(p => p.status === 'paused').length }
  ];

  const filteredProperties = filterProperties(mockListings, activeTab);

  const totalViews = mockListings.reduce((sum, prop) => sum + prop.views, 0);
  const totalInquiries = mockListings.reduce((sum, prop) => sum + prop.inquiries, 0);
  const soldProperties = mockListings.filter(p => p.status === 'sold').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">My Listings</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage and track your property listings</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              Add New Listing
            </motion.button>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-white'
                  }`}>
                    {tab.count}
                  </span>
                </motion.button>
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">Try adjusting your filters or search terms</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Add Your First Listing
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyListings;