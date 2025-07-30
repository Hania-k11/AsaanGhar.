// src/pages/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, MessageSquare, Settings, User, LogOut } from "lucide-react"; // Added LogOut for a more complete profile
import { useAuth } from "../context/AuthContext";

import ListingsTab from "../components/ListingsTab";
import FavoritesTab from "../components/FavoritesTab";
import MessagesTab from "../components/MessagesTab";
import SettingsTab from "../components/SettingsTab";
import OverviewTab from "../components/OverviewTab";

const MyProfile = () => {
  const { userDetails, logout } = useAuth(); // Destructure logout from AuthContext
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate a slightly longer loading for a more noticeable effect
    const timer = setTimeout(() => {
      if (userDetails) {
        setIsLoading(false);
      } else {
        setError("Please log in to view your profile.");
        setIsLoading(false);
      }
    }, 800); // Increased delay for perceived loading

    return () => clearTimeout(timer);
  }, [userDetails]);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "listings", label: "My Listings", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Animation variants for the main content transition
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Spinner component for loading state
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-t-4 border-t-emerald-500 border-gray-200 rounded-full"
      ></motion.div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading your profile...</p>
      <p className="text-sm text-gray-500">Just a moment while we gather your details.</p>
    </div>
  );

  // Error/Login Required component
  const StatusMessage = ({ message, type }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center min-h-screen text-center p-8 rounded-lg shadow-xl ${
        type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
      }`}
    >
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-5xl"
      >
        {type === "error" ? "⚠️" : "🔒"}
      </motion.span>
      <h2 className="text-2xl font-bold mb-3">{type === "error" ? "Oops! Something Went Wrong." : "Access Denied."}</h2>
      <p className="text-lg mb-6">{message}</p>
      {type === "login" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300"
          // onClick={() => openLoginModal()} // You'd need a prop or context function to open the modal
        >
          Login Now
        </motion.button>
      )}
    </motion.div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <StatusMessage message={error} type="error" />;
  }

  if (!userDetails) {
    return <StatusMessage message="You need to log in to view this page." type="login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row pt-24 pb-8 px-4 sm:px-6 lg:px-8 gap-8">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full lg:w-80 bg-white border-b lg:border-r lg:border-b-0 shadow-lg p-6 rounded-2xl flex flex-col items-center lg:items-start h-fit mb-8 lg:mb-0"
      >
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center w-full pb-6 border-b border-gray-100">
          <motion.img
            src={userDetails.avatar || "https://i.ibb.co/NC5L0h7/placeholder-avatar.jpg"} // Updated placeholder
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-5 border-emerald-500 shadow-lg object-cover ring-4 ring-emerald-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
          <h2 className="mt-4 text-xl font-extrabold text-gray-900 tracking-tight">
            {userDetails.name || "Guest User"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{userDetails.role || "User"}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout} // Assuming `logout` function exists in AuthContext
            className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-full font-semibold hover:bg-red-100 transition-colors duration-200 shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </motion.button>
        </div>

        {/* Tabs */}
        <nav className="space-y-3 mt-6 w-full">
          {tabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 group ${
                activeTab === id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md hover:shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} className={activeTab === id ? "text-white" : "text-gray-500 group-hover:text-emerald-500 transition-colors"} />
              {label}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-[400px]" // Ensure consistent height for animation
          >
            {activeTab === "overview" && <OverviewTab userData={userDetails} />}
            {activeTab === "listings" && <ListingsTab />}
            {activeTab === "favorites" && <FavoritesTab />}
            {activeTab === "messages" && <MessagesTab />}
            {activeTab === "settings" && <SettingsTab userData={userDetails} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyProfile;