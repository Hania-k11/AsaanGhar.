import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import house1 from "../assets/house1.jpg";
import house2 from "../assets/house2.jpg";
import house3 from "../assets/house3.jpg";
import house4 from "../assets/house4.jpg";
import house5 from "../assets/house5.jpg";
import house6 from "../assets/house6.jpg";
import house7 from "../assets/house7.jpg";
import house8 from "../assets/house8.jpg";
import house9 from "../assets/house9.jpg";
import house10 from "../assets/house10.jpg";
import house11 from "../assets/house11.jpg";
import house12 from "../assets/house12.jpg";
import house13 from "../assets/house13.jpg";
import house14 from "../assets/house14.jpg";
import house15 from "../assets/house15.jpg";

const defaultProperties = [
  { id: 1, title: "Modern Family House", location: "DHA Phase 5, Lahore", price: "PKR 1.2 Crore", image: house1, type: "sale", beds: "4 Beds", baths: "3 Baths", area: "2400 sq ft" },
  { id: 2, title: "Luxury Apartment", location: "Bahria Town, Islamabad", price: "PKR 85 Lac", image: house2, type: "sale", beds: "3 Beds", baths: "2 Baths", area: "1800 sq ft" },
  { id: 3, title: "Penthouse Suite", location: "Clifton, Karachi", price: "PKR 2.5 Crore", image: house3, type: "sale", beds: "5 Beds", baths: "4 Baths", area: "3200 sq ft" },
  { id: 4, title: "Elegant Villa", location: "PECHS Block 2", price: "PKR 6.5 Crore", image: house4, type: "sale", beds: "5 Beds", baths: "4 Baths", area: "4000 sq ft" },
  { id: 5, title: "Studio Flat", location: "Bahadurabad", price: "PKR 90 Lakh", image: house5, type: "rent", beds: "1 Bed", baths: "1 Bath", area: "800 sq ft" },
  { id: 6, title: "Townhouse", location: "North Nazimabad", price: "PKR 2.8 Crore", image: house6, type: "rent", beds: "4 Beds", baths: "3 Baths", area: "2200 sq ft" },
  { id: 7, title: "Corner Plot", location: "Scheme 33", price: "PKR 3.1 Crore", image: house7, type: "sale", beds: "N/A", baths: "N/A", area: "2800 sq ft" },
  { id: 8, title: "Duplex House", location: "Nazimabad", price: "PKR 4.2 Crore", image: house8, type: "sale", beds: "5 Beds", baths: "3 Baths", area: "3000 sq ft" },
  { id: 9, title: "Farmhouse", location: "Gadap Town", price: "PKR 12.0 Crore", image: house9, type: "sale", beds: "6 Beds", baths: "5 Baths", area: "5000 sq ft" },
  { id: 10, title: "Penthouse", location: "Sea View", price: "PKR 8.9 Crore", image: house10, type: "rent", beds: "4 Beds", baths: "4 Baths", area: "3500 sq ft" },
  { id: 11, title: "Cottage", location: "Malir Cantt", price: "PKR 1.2 Crore", image: house11, type: "sale", beds: "3 Beds", baths: "2 Baths", area: "1600 sq ft" },
  { id: 12, title: "Bungalow", location: "Defence Phase 8", price: "PKR 7.5 Crore", image: house12, type: "sale", beds: "5 Beds", baths: "4 Baths", area: "4200 sq ft" },
  { id: 13, title: "Apartment", location: "Tariq Road", price: "PKR 1.8 Crore", image: house13, type: "rent", beds: "3 Beds", baths: "2 Baths", area: "1700 sq ft" },
  { id: 14, title: "House with Basement", location: "Gulshan-e-Iqbal", price: "PKR 6.0 Crore", image: house14, type: "sale", beds: "5 Beds", baths: "4 Baths", area: "3900 sq ft" },
  { id: 15, title: "Brand New Home", location: "Shah Faisal Colony", price: "PKR 3.6 Crore", image: house15, type: "sale", beds: "4 Beds", baths: "3 Baths", area: "2500 sq ft" }
];

const BuyPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const newFiltered =
      filter === "all"
        ? defaultProperties
        : defaultProperties.filter((p) => p.type === filter);
    setFilteredProperties(newFiltered);
  }, [filter]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <motion.h1
        className="text-3xl font-bold text-emerald-600 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Properties for {filter === "rent" ? "Rent" : filter === "sale" ? "Sale" : "Sale & Rent"}
      </motion.h1>

      <div className="flex gap-4 mb-6">
        {["all", "sale", "rent"].map((type) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${
              filter === type
                ? "bg-emerald-600 text-white"
                : "bg-white text-emerald-600 border-emerald-600"
            }`}
            onClick={() => setFilter(type)}
          >
            {type === "all" ? "All" : type === "sale" ? "For Sale" : "For Rent"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              className="bg-white rounded-xl p-4 shadow-md border flex flex-col justify-between"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold truncate">{property.title}</h2>
                <p className="text-emerald-600 font-bold">{property.price}</p>
              </div>
              <p className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={14} className="mr-1" /> {property.location}
              </p>
              <div className="flex justify-between text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-1"><Bed size={14} /> {property.beds}</div>
                <div className="flex items-center gap-1"><Bath size={14} /> {property.baths}</div>
                <div className="flex items-center gap-1"><Square size={14} /> {property.area}</div>
              </div>
              <button
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
                className="mt-auto bg-green-100 text-green-800 font-semibold rounded-lg py-2 w-full border border-green-500 hover:bg-green-200 flex items-center justify-center gap-2 transition-all"
              >
                View Details <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BuyPage;
