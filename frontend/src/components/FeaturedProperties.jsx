// src/components/FeaturedProperties.jsx
/* eslint-disable no-unused-vars */

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FeaturedProperties = () => {
  const navigate = useNavigate();

  const [likedProperties, setLikedProperties] = useState(new Set());

  const handleClick = () => {
    navigate("/buy");
  };

  const toggleLike = (propertyId) => {
    setLikedProperties((prev) => {
      const updated = new Set(prev);
      if (updated.has(propertyId)) {
        updated.delete(propertyId);
      } else {
        updated.add(propertyId);
      }
      return updated;
    });
  };

  const properties = [
    {
      property_id: 1,
      title: "Modern Family Home",
      price: "20000000",
      location_name: "DHA",
      listing_type_name: "sale",
      bedrooms: "4",
      bathrooms: "3",
      area_sqft: "2400",
      year_built: "2021",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center",
    },
    {
      property_id: 2,
      title: "Luxury Apartment",
      price: "PKR 85 Lac",
      location_name: "Gulshan-e-Iqbal",
      listingg_type_name: "rent",
      bedrooms: "3",
      bathrooms: "2",
      area_sqft: "1800 ",
      year_built: "2021",
      rating: 4.1,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center",
    },
    {
      property_id: 3,
      title: "Penthouse Suite",
      price: "25000000",
      location_name: "Clifton, Karachi",
      listing_type_name: "sale",
      bedrooms: "5",
      bathrooms: "4",
      area_sqft: "3200 ",
      year_built: "2021",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=400&fit=crop&crop=center",
    },
    {
      property_id: 4,
      title: "Cozy Studio Apartment",
      price: "4500000",
      location_name: "Gulberg, Lahore",
      listing_type_name: "rent",
      bedrooms: "1",
      bathrooms: "1",
      area_sqft: "850",
      rating: 4.2,
      year_built: "2021",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center",
    },
    {
      property_id: 5,
      title: "Countryside Villa",
      price: "3800000",
      location_name: "Murree Hills",
      listing_type_name: "sale",
      bedrooms: "6",
      bathrooms: "5",
      area_sqft: "4500",
      year_built: "2021",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1600607688960-e095effe7b22?w=600&h=400&fit=crop&crop=center",
    },
    {
      property_id: 6,
      title: "Commercial Space",
      price: "10000000",
      location: "Blue Area, Islamabad",
      type: "sale",
      bedrooms: "N/A",
      bathrooms: "2",
      area_sqft: "2000 ",
      year_built: "2021",
      rating: 3.9,
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&h=400&fit=crop&crop=center",
    },
  ];

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

      {/* botTOMMMMMMMMMMMMMMMM */}
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
          <PropertyGrid
            properties={properties}
            likedProperties={likedProperties}
            toggleLike={toggleLike}
            navigate={navigate}
            viewMode="grid" // ✅ Force grid view
          />
        </AnimatePresence>

        {/* CTA */}
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
      </div>
    </section>
  );
};

export default FeaturedProperties;
