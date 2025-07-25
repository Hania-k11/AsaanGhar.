import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropertyGrid from "./PropertyGrid"
import { MapPin, Bed, Bath, Square, ArrowRight, Heart, Share2, Filter, Search, Grid3X3, List, Eye, Star, TrendingUp, Award, Calendar } from "lucide-react";

const defaultProperties = [
  { id: 1, title: "Modern Family House", location: "DHA Phase 5, Lahore", price: "PKR 1.2 Crore", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", type: "sale", beds: "4 Beds", baths: "3 Baths", area: "2400 sq ft", rating: 4.8, views: 1250, featured: true, yearBuilt: "2022" },
  { id: 2, title: "Luxury Apartment", location: "Bahria Town, Islamabad", price: "PKR 85 Lac", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", type: "sale", beds: "3 Beds", baths: "2 Baths", area: "1800 sq ft", rating: 4.6, views: 980, featured: false, yearBuilt: "2021" },
  { id: 3, title: "Penthouse Suite", location: "Clifton, Karachi", price: "PKR 2.5 Crore", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", type: "sale", beds: "5 Beds", baths: "4 Baths", area: "3200 sq ft", rating: 4.9, views: 2100, featured: true, yearBuilt: "2023" },
  { id: 4, title: "Elegant Villa", location: "PECHS Block 2", price: "PKR 6.5 Crore", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", type: "sale", beds: "5 Beds", baths: "4 Baths", area: "4000 sq ft", rating: 4.7, views: 1800, featured: true, yearBuilt: "2022" },
  { id: 5, title: "Studio Flat", location: "Bahadurabad", price: "PKR 90 Lakh", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", type: "rent", beds: "1 Bed", baths: "1 Bath", area: "800 sq ft", rating: 4.3, views: 650, featured: false, yearBuilt: "2020" },
  { id: 6, title: "Townhouse", location: "North Nazimabad", price: "PKR 2.8 Crore", image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800", type: "rent", beds: "4 Beds", baths: "3 Baths", area: "2200 sq ft", rating: 4.5, views: 1100, featured: false, yearBuilt: "2021" },
  { id: 7, title: "Corner Plot", location: "Scheme 33", price: "PKR 3.1 Crore", image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800", type: "sale", beds: "N/A", baths: "N/A", area: "2800 sq ft", rating: 4.4, views: 850, featured: false, yearBuilt: "N/A" },
  { id: 8, title: "Duplex House", location: "Nazimabad", price: "PKR 4.2 Crore", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", type: "sale", beds: "5 Beds", baths: "3 Baths", area: "3000 sq ft", rating: 4.6, views: 1400, featured: false, yearBuilt: "2022" },
  { id: 9, title: "Farmhouse", location: "Gadap Town", price: "PKR 12.0 Crore", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800", type: "sale", beds: "6 Beds", baths: "5 Baths", area: "5000 sq ft", rating: 4.9, views: 3200, featured: true, yearBuilt: "2023" },
  { id: 10, title: "Penthouse", location: "Sea View", price: "PKR 8.9 Crore", image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800", type: "rent", beds: "4 Beds", baths: "4 Baths", area: "3500 sq ft", rating: 4.8, views: 2800, featured: true, yearBuilt: "2023" },
  { id: 11, title: "Cottage", location: "Malir Cantt", price: "PKR 1.2 Crore", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", type: "sale", beds: "3 Beds", baths: "2 Baths", area: "1600 sq ft", rating: 4.4, views: 750, featured: false, yearBuilt: "2021" },
  { id: 12, title: "Bungalow", location: "Defence Phase 8", price: "PKR 7.5 Crore", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", type: "sale", beds: "5 Beds", baths: "4 Baths", area: "4200 sq ft", rating: 4.7, views: 2500, featured: true, yearBuilt: "2022" },
  { id: 13, title: "Apartment", location: "Tariq Road", price: "PKR 1.8 Crore", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", type: "rent", beds: "3 Beds", baths: "2 Baths", area: "1700 sq ft", rating: 4.5, views: 900, featured: false, yearBuilt: "2020" },
  { id: 14, title: "House with Basement", location: "Gulshan-e-Iqbal", price: "PKR 6.0 Crore", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", type: "sale", beds: "5 Beds", baths: "4 Baths", area: "3900 sq ft", rating: 4.6, views: 1900, featured: false, yearBuilt: "2021" },
  { id: 15, title: "Brand New Home", location: "Shah Faisal Colony", price: "PKR 3.6 Crore", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", type: "sale", beds: "4 Beds", baths: "3 Baths", area: "2500 sq ft", rating: 4.5, views: 1200, featured: false, yearBuilt: "2023" }
];

const BuyPage = () => {
   const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 15]);
  const propertiesPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
    let filtered = defaultProperties;

    // Filter by type
    if (filter !== "all") {
      filtered = filtered.filter((p) => p.type === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range (simplified for demonstration)
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace(/[^\d.]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort properties
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "featured": return b.featured - a.featured || b.rating - a.rating;
        case "price-low": return parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, ''));
        case "price-high": return parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, ''));
        case "newest": return parseInt(b.yearBuilt || "0") - parseInt(a.yearBuilt || "0");
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [filter, searchTerm, sortBy, priceRange]);

  const toggleLike = (propertyId) => {
    const newLiked = new Set(likedProperties);
    if (newLiked.has(propertyId)) {
      newLiked.delete(propertyId);
    } else {
      newLiked.add(propertyId);
    }
    setLikedProperties(newLiked);
  };

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section with Enhanced Header */}
      <div className="bg-gradient-to-b from-emerald-400/10 to-emerald-700 text-white pt-24 pb-5 ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Buy your Properties at Ease
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Discover exceptional homes that match your lifestyle. From luxury penthouses to cozy apartments.
            </p>
            
            {/* Advanced Search Bar */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-900" size={20} />
                  <input
                    type="text"
                    placeholder="Search "
                   
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 placeholder-emerald-800 bg-white/20 border border-white/30 rounded-lg text-emerald-900  focus:outline-none focus:ring-2 focus:ring-white/50"
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
      

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Filter Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">
              {filteredProperties.length} Properties Found
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

        {/* Enhanced Property Grid */}
      <AnimatePresence mode="wait">
  <PropertyGrid
    properties={paginatedProperties}
    viewMode={viewMode}
    likedProperties={likedProperties}
    toggleLike={toggleLike}
    navigate={navigate}
  />
</AnimatePresence>



        {/* Enhanced Pagination */}
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

        {/* No Results State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
                setPriceRange([0, 15]);
              }}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;