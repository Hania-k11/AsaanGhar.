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
  ArrowRight, // Added for a more dynamic look on list items
} from "lucide-react";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com",
    name: "Facebook",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    name: "Twitter",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    name: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    name: "LinkedIn",
  },
  {
    icon: Youtube,
    href: "https://youtube.com",
    name: "YouTube",
  },
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-950 to-gray-800 text-gray-200 pt-20 pb-10 shadow-lg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-7">
              <Home className="h-9 w-9 text-emerald-400 mr-3 animate-pulse" />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-wide">
                Asaan Ghar
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-7 text-sm">
              Making property buying, selling, and renting easier than ever before. Your trusted partner in real estate
              across Pakistan. We're here to help you find your dream home.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, name }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-110 tooltip tooltip-top"
                  data-tip={name}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={name}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-7 border-b-2 border-emerald-500 pb-3 text-emerald-300">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 8 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group text-base"
                  >
                    <ArrowRight className="h-4 w-4 mr-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Popular Locations */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-7 border-b-2 border-emerald-500 pb-3 text-emerald-300">
              Popular Locations
            </h3>
            <ul className="space-y-4">
              {popularLocations.map((location, index) => (
                <motion.li key={index} whileHover={{ x: 8 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <a
                    href={location.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group text-base"
                  >
                    <MapPin size={16} className="mr-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />{" "}
                    {location.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us & Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-7 border-b-2 border-emerald-500 pb-3 text-emerald-300">
              Contact Us
            </h3>
            <ul className="space-y-5 mb-8">
              <li className="flex items-start">
                <MapPin className="text-emerald-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <address className="text-gray-400 not-italic text-base">
                  123 Main Street, Scheme 33, Karachi, Pakistan
                </address>
              </li>
              <li className="flex items-center">
                <Phone className="text-emerald-400 mr-3 flex-shrink-0" size={20} />
                <a href="tel:+923001234567" className="text-gray-400 hover:text-emerald-400 transition-colors text-base">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-emerald-400 mr-3 flex-shrink-0" size={20} />
                <a href="mailto:info@asaanghar.com" className="text-gray-400 hover:text-emerald-400 transition-colors text-base">
                  info@asaanghar.com
                </a>
              </li>
            </ul>

            <div>
              <h4 className="text-base font-semibold mb-4 text-emerald-300">
                Subscribe to Our Newsletter
              </h4>
              <div className="flex rounded-lg shadow-md overflow-hidden">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow bg-gray-700 text-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-sm"
                  aria-label="Email for newsletter subscription"
                />
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#06D6A0" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 text-white px-6 py-3 font-semibold transition-all duration-300 flex items-center justify-center text-sm"
                  aria-label="Subscribe to newsletter"
                >
                  Send
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-10 mt-10 text-center text-gray-500 text-sm">
          <p className="mb-4">© {new Date().getFullYear()} AsaanGhar. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="hover:text-emerald-400 transition-colors text-base">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-emerald-400 transition-colors text-base">
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-emerald-400 transition-colors text-base">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;