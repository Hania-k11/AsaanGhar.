import { motion } from "framer-motion";
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", name: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", name: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", name: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", name: "YouTube" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Property", href: "/buy" },
  { name: "Sell Property", href: "/sell" },
  { name: "Rent Property", href: "/rent" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const popularLocations = [
  { name: "Lahore", href: "#" },
  { name: "Karachi", href: "#" },
  { name: "Islamabad", href: "#" },
  { name: "Rawalpindi", href: "#" },
  { name: "Faisalabad", href: "#" },
  { name: "Multan", href: "#" },
];

const Footer = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-950 to-gray-800 text-gray-200 pt-14 pb-8 shadow-lg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-6">
              <Home className="h-8 w-8 text-emerald-400 mr-3 animate-pulse" />
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Asaan Ghar
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              Making property buying, selling, and renting easier than ever before. Your trusted partner in real estate across Pakistan.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, name }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-emerald-500 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-bold mb-6 border-b-2 border-emerald-500 pb-2 text-emerald-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li key={i} whileHover={{ x: 8 }}>
                  <a
                    href={link.href}
                    className="flex items-center text-gray-400 hover:text-emerald-400 text-sm sm:text-base"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Popular Locations */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-bold mb-6 border-b-2 border-emerald-500 pb-2 text-emerald-300">
              Popular Locations
            </h3>
            <ul className="space-y-3">
              {popularLocations.map((loc, i) => (
                <motion.li key={i} whileHover={{ x: 8 }}>
                  <a
                    href={loc.href}
                    className="flex items-center text-gray-400 hover:text-emerald-400 text-sm sm:text-base"
                  >
                    <MapPin size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                    {loc.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-bold mb-6 border-b-2 border-emerald-500 pb-2 text-emerald-300">
              Contact Us
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start text-sm sm:text-base">
                <MapPin className="text-emerald-400 mr-2 mt-1" size={18} />
                <address className="not-italic text-gray-400">
                  123 Main Street, Scheme 33, Karachi, Pakistan
                </address>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <Phone className="text-emerald-400 mr-2" size={18} />
                <a href="tel:+923001234567" className="hover:text-emerald-400">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <Mail className="text-emerald-400 mr-2" size={18} />
                <a href="mailto:info@asaanghar.com" className="hover:text-emerald-400">
                  info@asaanghar.com
                </a>
              </li>
            </ul>

            {/* Newsletter - Stacks on Mobile */}
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 text-emerald-300">
                Subscribe to Our Newsletter
              </h4>
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-md">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow bg-gray-700 text-white px-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 px-4 sm:px-6 py-2 sm:py-3 text-sm text-white font-semibold"
                >
                  Send <ArrowRight className="ml-1 inline-block h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-xs sm:text-sm">
          <p className="mb-3">© {new Date().getFullYear()} AsaanGhar. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400">Sitemap</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
