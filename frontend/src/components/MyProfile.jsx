/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  Heart,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Calendar,
  CheckCircle,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import MyListings from "./MyListings";
import OverviewContent from "./OverviewContent";
import Favourites from "./Favourites";
import MessagesTab from "./MessagesTab";
import SettingsTab from "./SettingsTab";
import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import LoggingOutModal from "./LoggingOutModal";
import LoadingSpinner from "./LoadingSpinner";

const mockUserDetails = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  role: "Premium Member",
  avatar: "/placeholder.svg?height=100&width=100&text=SJ",
  joinDate: "March 2023",
  location: "San Francisco, CA",
  verified: true,
  profileCompletion: 85,
  membershipTier: "Gold",
};

const mockStats = {
  messagesReceived: 15,
};

const NAVBAR_HEIGHT = "3.7rem";
const SIDEBAR_WIDTH = "20rem";

const MyProfile = () => {
  const { user, logoutUser, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cachedUserDetails, setCachedUserDetails] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Track window height changes for dynamic calculations
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (user) {
      setCachedUserDetails(user);
    }
  }, [user]);

  useEffect(() => {
    if (!user && !isLoggingOut && !isLoading) {
      navigate("/");
    }
  }, [user, isLoggingOut, navigate, isLoading]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl);
  }, [searchParams]);

  // Calculate available height dynamically
  const calculateNavigationHeight = () => {
    const navbarHeight = 60; 
    const profileHeaderHeight = window.innerWidth < 768 ? 180 : 220; 
    const signOutButtonHeight = window.innerWidth < 768 ? 70 : 80; 
    const availableHeight = windowHeight - navbarHeight - profileHeaderHeight - signOutButtonHeight - 20; 
    
    return Math.max(200, availableHeight); 
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "profile", label: "Profile", icon: User },
    { id: "listings", label: "My Listings", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    // { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const displayUserDetails = cachedUserDetails || user;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/my-profile?tab=${tabId}`);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <LoadingSpinner 
        variant="full" 
        message="Loading your profile..." 
        subMessage="Preparing your dashboard experience" 
      />
    );
  }

  if (isLoggingOut) {
    return <LoggingOutModal isLoggingOut={isLoggingOut} />;
  }

  if (!user) {
    return null;
  }

return (
  <>
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100" style={{ top: NAVBAR_HEIGHT }}>
      {/* Hamburger Button */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 left-4 p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all duration-200"
            style={{ top: `calc(${NAVBAR_HEIGHT} + 1rem)` }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed lg:relative z-40 bg-white shadow-xl flex flex-col rounded-r-2xl"
          style={{
            width: SIDEBAR_WIDTH,
            height: `${windowHeight - 60}px`,
            maxHeight: `${windowHeight - 60}px`,
          }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-6 text-white flex-shrink-0 rounded-t-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <img
                  src={displayUserDetails?.avatar || mockUserDetails.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {(displayUserDetails?.verified || mockUserDetails.verified) && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </motion.div>
              <h2 className="mt-3 text-xl font-bold">{displayUserDetails?.first_name}</h2>
              <div className="flex items-center gap-2 text-sm text-white opacity-90 mt-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {format(new Date(), "yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="p-4 space-y-2 overflow-y-auto" style={{ height: `${calculateNavigationHeight()}px` }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    activeTab === id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                  }`}
                  whileHover={{ x: activeTab === id ? 0 : 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    size={18}
                    className={activeTab === id ? "text-white" : "text-gray-500 group-hover:text-emerald-500"}
                  />
                  {label}
                  {id === "messages" && mockStats.messagesReceived > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {mockStats.messagesReceived}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-auto p-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors shadow-sm"
              >
                {isLoggingOut ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={16} />
                    </motion.div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Sign Out
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="flex-1 bg-white shadow-xl flex flex-col overflow-hidden rounded-l-2xl"
          animate={{
            marginLeft: window.innerWidth >= 1024 ? (sidebarOpen ? 0 : `-${SIDEBAR_WIDTH}`) : 0,
          }}
          initial={false}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="min-h-full"
                >
                  {activeTab === "overview" && <OverviewContent user={displayUserDetails} />}
                  {activeTab === "listings" && <MyListings />}
                  {activeTab === "favorites" && <Favourites />}
                  {activeTab === "messages" && <MessagesTab />}
                  {activeTab === "profile" && <UserProfile />}
                  {activeTab === "settings" && <SettingsTab userData={displayUserDetails} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </>
);
};

export default MyProfile;