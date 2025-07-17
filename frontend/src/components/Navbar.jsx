import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home, Menu, X, User, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = ({ onLoginClick, isLoggedIn, userName, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Buy", path: "/buy" },
    ...(isLoggedIn ? [{ name: "Sell", path: "/sell" }] : []),
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
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
                  isActive ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4 relative" ref={dropdownRef}>
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-800">{userName}</span>
                <ChevronDown size={18} className="text-gray-600" />
              </div>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 text-sm z-50">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Account</div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</div>
                  <div
                    className="px-4 py-2 hover:bg-red-100 text-red-600 font-medium cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={onLoginClick}
            >
              Login / Register
            </motion.button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `py-2 font-medium transition-colors ${
                    isActive ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="text-gray-800 font-medium">{userName}</span>
                </div>
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  <div className="py-2 border-t">My Account</div>
                  <div className="py-2">Change Password</div>
                  <div className="py-2 text-red-600 font-semibold" onClick={onLogout}>
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Login / Register
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
