import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Star,
} from "lucide-react"
import PropertyGrid from "./PropertyGrid"

// Mock data for all properties (in real app, this would come from props or context)
const mockAllProperties = [
  {
    id: 1,
    title: "Modern Downtown Condo",
    price: "$850,000",
    location: "123 Market St, San Francisco, CA",
    beds: "2",
    baths: "2",
    area: "1,200 sqft",
    type: "sale",
    image: "/api/placeholder/400/300",
    rating: 4.8,
    yearBuilt: "2020",
    description: "Stunning modern condo with city views and premium amenities."
  },
  {
    id: 2,
    title: "Victorian House in Mission",
    price: "$1,200,000",
    location: "456 Valencia St, San Francisco, CA",
    beds: "3",
    baths: "2",
    area: "1,800 sqft",
    type: "sale",
    image: "/api/placeholder/400/300",
    rating: 4.6,
    yearBuilt: "1905",
    description: "Charming Victorian home with original details and modern updates."
  },
  {
    id: 3,
    title: "Luxury Penthouse Downtown",
    price: "$2,100,000",
    location: "789 Pine St, San Francisco, CA",
    beds: "4",
    baths: "3",
    area: "2,500 sqft",
    type: "sale",
    image: "/api/placeholder/400/300",
    rating: 4.9,
    yearBuilt: "2018",
    description: "Exclusive penthouse with panoramic city views and luxury finishes."
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    price: "$2,800/month",
    location: "321 Folsom St, San Francisco, CA",
    beds: "1",
    baths: "1",
    area: "600 sqft",
    type: "rent",
    image: "/api/placeholder/400/300",
    rating: 4.2,
    yearBuilt: "2015",
    description: "Perfect starter home in a vibrant neighborhood."
  },
  {
    id: 5,
    title: "Family Home with Garden",
    price: "$980,000",
    location: "654 Oak St, San Francisco, CA",
    beds: "3",
    baths: "2",
    area: "1,600 sqft",
    type: "sale",
    image: "/api/placeholder/400/300",
    rating: 4.7,
    yearBuilt: "1985",
    description: "Spacious family home with beautiful garden and quiet neighborhood."
  },
  {
    id: 6,
    title: "Modern Loft Space",
    price: "$3,200/month",
    location: "987 Mission St, San Francisco, CA",
    beds: "2",
    baths: "1",
    area: "1,100 sqft",
    type: "rent",
    image: "/api/placeholder/400/300",
    rating: 4.4,
    yearBuilt: "2010",
    description: "Industrial-style loft with high ceilings and exposed brick."
  }
]

const Favourites = ({ 
  likedProperties = new Set([1, 3, 5]), // Default liked properties for demo
  toggleLike,
  navigate,
  allProperties = mockAllProperties // In real app, pass this as prop
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterType, setFilterType] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  const propertyTypes = ["all", "sale", "rent"]
  const sortOptions = [
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "title", label: "Name" },
    { value: "area", label: "Size" },
    { value: "yearBuilt", label: "Year Built" }
  ]

  // Get only liked properties
  const likedPropertiesData = useMemo(() => {
    return allProperties.filter(property => likedProperties.has(property.id))
  }, [allProperties, likedProperties])

  // Filter and sort liked properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = likedPropertiesData.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || property.type === filterType
      
      // Extract numeric price for comparison
      const numericPrice = parseInt(property.price.replace(/[$,/month]/g, ''))
      const matchesPrice = numericPrice >= priceRange[0] && numericPrice <= priceRange[1]
      
      return matchesSearch && matchesType && matchesPrice
    })

    // Sort properties
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      // Handle different sort types
      if (sortBy === "price") {
        aValue = parseInt(a.price.replace(/[$,/month]/g, ''))
        bValue = parseInt(b.price.replace(/[$,/month]/g, ''))
      } else if (sortBy === "area") {
        aValue = parseInt(a.area.replace(/[,sqft]/g, ''))
        bValue = parseInt(b.area.replace(/[,sqft]/g, ''))
      } else if (sortBy === "yearBuilt") {
        aValue = parseInt(aValue)
        bValue = parseInt(bValue)
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [likedPropertiesData, searchTerm, sortBy, sortOrder, filterType, priceRange])

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setPriceRange([0, 5000000])
    setSortBy("rating")
    setSortOrder("desc")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
                  <Heart className="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" />
                </div>
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredAndSortedProperties.length} of {likedPropertiesData.length} saved properties
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 lg:p-3 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 lg:p-3 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorite properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sort */}
              <div className="relative min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 lg:py-4 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 w-full"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-4 py-3 lg:py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span>{sortOrder === "asc" ? "Low to High" : "High to Low"}</span>
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 min-w-[100px] ${
                  showFilters
                    ? "bg-emerald-500 text-white shadow-md"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Property Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>
                          {type === "all" ? "All Types" : type === "sale" ? "For Sale" : "For Rent"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="text-gray-400 px-2">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000000])}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredAndSortedProperties.length > 0 ? (
            <PropertyGrid
              properties={filteredAndSortedProperties}
              viewMode={viewMode}
              likedProperties={likedProperties}
              toggleLike={toggleLike}
              navigate={navigate}
            />
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 lg:py-24"
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-red-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                {searchTerm || filterType !== "all" 
                  ? "No matching favorites found" 
                  : likedPropertiesData.length === 0 
                    ? "No favorites yet" 
                    : "No properties match your criteria"
                }
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search criteria or filters to find your saved properties."
                  : likedPropertiesData.length === 0
                    ? "Start exploring properties and save your favorites to see them here."
                    : "Adjust your filters to see more of your saved properties."
                }
              </p>
              {(searchTerm || filterType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium shadow-lg shadow-emerald-200"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        {likedPropertiesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 lg:p-8 border border-emerald-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Favorites Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600">
                  {likedPropertiesData.length}
                </div>
                <div className="text-sm text-gray-600">Total Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600">
                  {likedPropertiesData.filter(p => p.type === "sale").length}
                </div>
                <div className="text-sm text-gray-600">For Sale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600">
                  {likedPropertiesData.filter(p => p.type === "rent").length}
                </div>
                <div className="text-sm text-gray-600">For Rent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                  {(likedPropertiesData.reduce((sum, p) => sum + p.rating, 0) / likedPropertiesData.length).toFixed(1)}
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Favourites