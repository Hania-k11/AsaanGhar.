// src/components/FeaturedProperties.jsx
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// API function for fetching featured properties
const fetchFeaturedProperties = async ({ userId }) => {
  const params = {
    type: 'all',
    sort: 'featured',
    page: 1,
    limit: 6,
  };

  if (userId) {
    const { data } = await axios.get(`/api/property/getallnew/${userId}`, { params });
    return data;
  } else {
    const { data } = await axios.get(`/api/property/getall`, { params });
    return data;
  }
};

// API function for toggling favorite
const toggleFavoriteProperty = async ({ userId, propertyId, isCurrentlyLiked }) => {
  if (isCurrentlyLiked) {
    await axios.delete(`/api/property/favorites/${userId}/${propertyId}`);
  } else {
    await axios.post('/api/property/favorites', { userId, propertyId });
  }
};

// API function for checking favorite status
const checkFavoriteStatus = async (userId, propertyIds) => {
  if (!userId || !propertyIds.length) return { favoriteIds: [] };
  const { data } = await axios.get(`/api/property/favorites/check/${userId}`, {
    params: { propertyIds: propertyIds.join(',') }
  });
  return data;
};

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;
  const queryClient = useQueryClient();

  const [likedProperties, setLikedProperties] = useState(new Set());

  // Fetch featured properties
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredProperties', userId],
    queryFn: () => fetchFeaturedProperties({ userId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const properties = data?.data || [];

  // Fetch favorite status for logged-in users
  const { data: favoritesData } = useQuery({
    queryKey: ['checkFavorites', userId, properties.map(p => p.property_id)],
    queryFn: () => checkFavoriteStatus(userId, properties.map(p => p.property_id)),
    enabled: isLoggedIn && properties.length > 0,
    staleTime: 30 * 1000,
  });

  // Update liked properties when favorites data changes
  useEffect(() => {
    if (favoritesData?.favoriteIds) {
      setLikedProperties(new Set(favoritesData.favoriteIds));
    }
  }, [favoritesData]);

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoriteProperty,
    onMutate: async ({ propertyId, isCurrentlyLiked }) => {
      // Optimistic update
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
      queryClient.invalidateQueries(['featuredProperties']);
      queryClient.invalidateQueries(['checkFavorites']);
      queryClient.invalidateQueries(['favoriteProperties']);
    },
    onError: (error, { propertyId, isCurrentlyLiked }) => {
      // Revert optimistic update
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

  const showToast = (message, type = "success") => {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.className = `fixed top-20 right-4 px-5 py-2.5 rounded-xl shadow-lg z-50 text-sm font-medium transition-all duration-300 ${
      type === "success"
        ? "bg-emerald-600 text-white"
        : "bg-red-600 text-white"
    }`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2500);
  };

  const handleToggleLike = (propertyId, isCurrentlyLiked) => {
    if (!isLoggedIn) {
      showToast('Please login to save favourites', 'error');
      return;
    }
    toggleFavoriteMutation.mutate({ userId, propertyId, isCurrentlyLiked });
  };

  const handleClick = () => {
    navigate("/buy");
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-200 via-emerald-50/30 to-teal-50/50 overflow-hidden">
      {/* Top Wave */}
      <div className="absolute -top-1 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
        <svg
          className="block w-full h-24 md:h-32 drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,0 C360,80 1080,80 1440,0 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-2 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,
         70.36-5.37,136.33-33.31,206.8-37.5,
         C438.64,32.43,512.34,53.67,583,72.05,
         c69.27,18,138.3,24.88,209.4,13.08,
         36.15-6,69.85-17.84,104.45-29.34,
         C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#082733"
          ></path>
        </svg>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl floating-element"></div>
      <div
        className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl floating-element"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/10 to-teal-100/10 rounded-full blur-3xl floating-element"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 rounded-full text-sm font-bold mb-8 shadow-lg">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
            Premium Properties Collection
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Featured
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Properties
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover our meticulously curated collection of premium properties
            across Pakistan. Each listing represents exceptional value, prime
            locations, and outstanding architectural excellence.
          </p>
        </div>

        {/* Property Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="pt-12 pb-36">
              <LoadingSpinner 
                variant="inline" 
                message="Loading featured properties..." 
              />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg mb-4">Error loading properties</p>
              <button
                onClick={() => queryClient.invalidateQueries(['featuredProperties'])}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-bold mb-4">No Featured Properties Available</p>
              <p className="text-gray-600 mb-6">
                Check back soon for new featured listings.
              </p>
              <button
                onClick={handleClick}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                View All Properties
              </button>
            </div>
          ) : (
            <PropertyGrid
              properties={properties}
              likedProperties={likedProperties}
              toggleLike={handleToggleLike}
              navigate={navigate}
              viewMode="grid"
            />
          )}
        </AnimatePresence>

        {/* CTA */}
        {properties.length > 0 && (
          <div className="text-center mt-20">
            <button
              onClick={handleClick}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-xl group"
            >
              View All Properties
              <ArrowRight
                size={22}
                className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>

            <p className="text-gray-500 mt-6 text-xs md:text-sm font-medium">
              • Asaan Ghar is Pakistan's first easy property site •
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;