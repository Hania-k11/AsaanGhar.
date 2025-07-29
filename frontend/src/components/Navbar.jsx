import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from "./LoginModal"; // 👈 Make sure path is correct

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const { userDetails, logout } = useAuth();
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : " bg-white md:bg-white/30 shadow-sm py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
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

        <div className="hidden md:flex items-center space-x-4 relative" ref={desktopDropdownRef}>
          {userDetails ? (
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
                <span className="font-medium text-gray-800">{userDetails.name}</span>
                <ChevronDown size={18} className="text-gray-600" />
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                  >
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Account
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Change Password
                    </div>
                    <div
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-all"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setShowLoginModal(true)} // ✅ OPEN MODAL
    >
      Login / Register
            </motion.button>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-3 relative" ref={mobileDropdownRef}>
          {userDetails && (
            <div
              className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={20} />
            </div>
          )}
          {!userDetails && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm px-4 py-2 bg-emerald-600 text-white rounded-xl shadow"
              onClick={() => setShowLoginModal(true)} // ✅ OPEN MODAL
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
            {dropdownOpen && userDetails && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-xl py-2 text-sm z-50"
              >
                <div className="px-4 py-2 text-gray-700 font-semibold">{userDetails.name}</div>
                <div
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-all"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </div>
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
                initial="closed"
                animate="open"
                variants={{
                  closed: { opacity: 0 },
                  open: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      closed: { opacity: 0, x: -20 },
                      open: { opacity: 1, x: 0 },
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
  );
};

export default Navbar;