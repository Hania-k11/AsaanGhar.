import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Heart, MessageSquare, Settings, User, LogOut, Calendar, CheckCircle, Menu, X, LayoutDashboard
} from "lucide-react"

import MyListings from "./MyListings"
import OverviewContent from "./OverviewContent"
import Favourites from "./Favourites"
import MessagesTab from "./MessagesTab"
import MyProfileTab from "./MyProfileTab"
import SettingsTab from "./SettingsTab"
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";


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
}

const mockStats = {
  messagesReceived: 15,
}

const NAVBAR_HEIGHT = "3.7rem";
const SIDEBAR_WIDTH = "20rem"; 

const MyProfile = () => {
 
  
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true) 
  const { userDetails,logout } = useAuth(); 
   const navigate = useNavigate();
 
  useEffect(() => {
    const handleResize = () => {
      
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(true)
      }
    }
    
    window.addEventListener("resize", handleResize)
    handleResize() 
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

const handleLogout = async () => {
    await logout();         // Make sure logout is async if needed
    navigate('/');          // Redirect to homepage
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "listings", label: "My Listings", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  }

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <motion.div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-4 border-t-emerald-500 border-slate-200 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 w-12 h-12 border-4 border-r-4 border-r-blue-500 border-transparent rounded-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-xl font-semibold text-slate-700">Loading your profile...</p>
        <p className="text-sm text-slate-500 mt-2">Preparing your dashboard experience</p>
      </motion.div>
    </div>
  )

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Close sidebar on small screens when a tab is selected
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }



//  const StatusMessage = ({ message, type }) => (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className={`flex flex-col items-center justify-center min-h-screen text-center p-8 rounded-lg shadow-xl ${
//         type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
//       }`}
//     >
//       <motion.span
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="mb-4 text-5xl"
//       >
//         {type === "error" ? "⚠️" : "🔒"}
//       </motion.span>
//       <h2 className="text-2xl font-bold mb-3">{type === "error" ? "Oops! Something Went Wrong." : "Access Denied."}</h2>
//       <p className="text-lg mb-6">{message}</p>
//       {type === "login" && (
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300"
//           // onClick={() => openLoginModal()} // You'd need a prop or context function to open the modal
//         >
//           Login Now
//         </motion.button>
//       )}
//     </motion.div>
//   );

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100" style={{ top: NAVBAR_HEIGHT }}>
      {/* Sidebar Toggle Button - Only show when sidebar is closed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 left-4 p-2 rounded-full outline-2 outline-emerald-300 bg-emerald-600 shadow-lg hover:bg-emerald-800 transition-all duration-200 hover:shadow-xl "
            style={{ top: `calc(${NAVBAR_HEIGHT} + 1rem)` }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} className="text-white " />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay for small screens when sidebar is open */}
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

      {/* Main layout container */}
      <div className="flex h-full">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : "-100%",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed lg:relative z-40 h-full bg-white shadow-xl flex flex-col"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Profile Header - Fixed */}
          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-6 text-white flex-shrink-0 relative">
            {/* Close button for sidebar */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-white" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <img
                  src={userDetails?.avatar || mockUserDetails.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {(userDetails?.verified || mockUserDetails.verified) && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </motion.div>
              <h2 className="mt-3 text-xl font-bold">{userDetails?.name}</h2>
              <div className="flex items-center gap-2 text-sm text-white opacity-90 mt-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {userDetails?.joinDate || mockUserDetails.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Scrollable */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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

          {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors duration-200"
            >
              <LogOut size={16} />
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content - Responsive to sidebar state */}
        <motion.div
          className="flex-1 bg-white shadow-xl flex flex-col overflow-hidden"
          animate={{
            marginLeft: window.innerWidth >= 1024 ? (sidebarOpen ? 0 : `-${SIDEBAR_WIDTH}`) : 0
          }}
          initial={false}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
         

          {/* Scrollable Content Area */}
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
                  {activeTab === "overview" && (
                    <OverviewContent userDetails={userDetails || mockUserDetails} />
                  )}
                  {activeTab === "listings" && <MyListings />}
                  {activeTab === "favorites" && <Favourites />}
                  {activeTab === "messages" && <MessagesTab />}
                  {activeTab === "profile" && <MyProfileTab />}
                  {activeTab === "settings" && (
                    <SettingsTab userData={userDetails || mockUserDetails} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MyProfile;