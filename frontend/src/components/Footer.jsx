

import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <Home className="h-8 w-8 text-emerald-400 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Asaan Ghar
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Making property buying, selling, and renting easier than ever before. Your trusted partner in real estate
              across Pakistan.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, color: "#10b981" }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Buy Property", "Sell Property", "Rent Property", "About Us", "Contact Us"].map(
                (item, index) => (
                  <li key={index}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2">›</span> {item}
                    </motion.a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Popular Locations</h3>
            <ul className="space-y-3">
              {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"].map((item, index) => (
                <li key={index}>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <MapPin size={16} className="mr-2" /> {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-emerald-400 mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Main Street, F-7, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-emerald-400 mr-3 flex-shrink-0" size={18} />
                <span className="text-gray-400">+92 300 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-emerald-400 mr-3 flex-shrink-0" size={18} />
                <span className="text-gray-400">info@asaanghar.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Asaan Ghar. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
