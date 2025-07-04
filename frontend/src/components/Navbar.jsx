import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Buy", path: "/buy" },
    { name: "Sell", path: "/sell" },
    { name: "Rent", path: "#rent" },
    { name: "About", path: "#about" },
    { name: "Contact", path: "#contact" },
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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <motion.div key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {item.path.startsWith("#") ? (
                <a
                  href={item.path}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              )}
            </motion.div>
          ))}
        </div>

        {/* Desktop Login/Register Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
          onClick={onLoginClick}
        >
          Login / Register
        </motion.button>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              item.path.startsWith("#") ? (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
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
              )
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Login / Register
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
