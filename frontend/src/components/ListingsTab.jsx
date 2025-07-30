// src/components/ListingsTab.jsx
import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";

const ListingsTab = () => {
  const listings = [
    {
      id: 1,
      title: "Luxury Apartment in DHA",
      image: "https://source.unsplash.com/400x300/?apartment",
      price: "PKR 35,000/month",
      status: "Active",
      views: 124,
      date: "July 20, 2025",
    },
    {
      id: 2,
      title: "5 Marla House in Bahria Town",
      image: "https://source.unsplash.com/400x300/?house",
      price: "PKR 1.5 Crore",
      status: "Pending",
      views: 87,
      date: "July 18, 2025",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {listings.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border"
        >
          <img src={listing.image} alt={listing.title} className="h-48 w-full object-cover" />
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="text-emerald-600 font-bold">{listing.price}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                listing.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : listing.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {listing.status}
              </span>
              <span className="flex items-center gap-1"><Eye size={14} /> {listing.views} views</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={14} /> {listing.date}</span>
              <div className="flex gap-2">
                <button className="p-1 bg-blue-50 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                <button className="p-1 bg-red-50 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ListingsTab;
