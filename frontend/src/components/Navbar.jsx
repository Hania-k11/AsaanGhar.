import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Settings, 
  UserCircle,
  Loader2,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal"; 
import LoggingOutModal from "./LoggingOutModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const navigate = useNavigate();

  const { user, logoutUser } = useAuth();
  const { setShowLoginModal } = useAuth();

  const desktopDropdownRef = useRef();
  const mobileDropdownRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
   
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Buy", path: "/buy" },
    { name: "Sell", path: "/sell" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Enhanced logout function with smooth transition
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    
   
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

if (isLoggingOut) {
  return <LoggingOutModal isLoggingOut={isLoggingOut} />;
}


  return (
    <>
     

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : " bg-white md:bg-white/30 shadow-sm py-3"
        }`}
      >
        <div className="z-[9999] container mx-auto px-4 flex justify-between items-center">
          <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }}
           onClick={() => navigate("/")} >
            <Home className="h-8 w-8 text-emerald-600 mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Asaan Ghar
            </span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div
            className="hidden md:flex items-center space-x-4 relative"
            ref={desktopDropdownRef}
          >
            {user ? (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md transition"
                  >
                    <User className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium text-gray-800">
                    {user.first_name}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-600 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={containerVariants}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 overflow-hidden"
                    >
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "#f3f4f6", x: 3 }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/my-profile");
                        }}
                      >
                        <UserCircle className="w-4 h-4 mr-2 text-emerald-600" />
                        My Profile
                      </motion.div>

                      <div className="border-t border-gray-100 my-2"></div>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "#fee2e2", x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-all"
                        onClick={handleLogout} 
                      >
                        {isLoggingOut ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <LogOut className="w-4 h-4 mr-2" />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => setShowLoginModal(true)}
              >
                Login / Register
              </motion.button>
            )}
          </div>

          <div
            className="md:hidden flex items-center space-x-3 relative"
            ref={mobileDropdownRef}
          >
            {user && (
              <div
                className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={20} />
              </div>
            )}
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-2 bg-emerald-600 text-white rounded-xl shadow"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </motion.button>
            )}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white/20 backdrop-blur-md rounded-xl p-2.5 border border-white/30 shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} className="text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} className="text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && user && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  transition={{ duration: 0.2 }}
                  className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-xl py-2 text-sm z-50 overflow-hidden"
                >
                  <motion.div
                    variants={itemVariants}
                    className="px-4 py-2 text-gray-700 font-semibold"
                  >
                    {user.first_name}
                  </motion.div>
                  <div className="border-t border-gray-100 my-1"></div>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "#f3f4f6", x: 3 }}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                      navigate("/my-profile");
                    }}
                  >
                    <UserCircle className="w-4 h-4 mr-2 text-emerald-600" />
                    My Profile
                  </motion.div>

                  <div className="border-t border-gray-100 my-1"></div>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "#fee2e2", x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-all"
                    onClick={handleLogout} // Updated to use new logout handler
                  >
                    {isLoggingOut ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2"
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg"
            >
              <div className="container mx-auto px-6 py-6">
                <motion.div
                  className="flex flex-col space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  }}
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.name}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                            isActive
                              ? "text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md"
                              : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;