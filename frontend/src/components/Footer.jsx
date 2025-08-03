import { motion } from "framer-motion";
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  ChevronRight,
  Loader2, // Import Loader2 icon from lucide-react
} from "lucide-react";
import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/AsaanGhar.pk/", name: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/asaanghar.pk/", name: "Instagram" },
  { icon: Mail, href: "mailto:asaanghar.pk@gmail.com", name: "Email" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Property", href: "/buy" },
  { name: "Sell Property", href: "/sell" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const popularKarachiLocalities = [
  { name: "Scheme 33", href: "#" },
  { name: "Gulshan-e-Iqbal", href: "#" },
  { name: "PECHS", href: "#" },
  { name: "Malir", href: "#" },
  { name: "DHA Karachi", href: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const form = useRef();

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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatusMessage('');

    const serviceId = 'service_bkczxgk';
    const templateId = 'template_4xm1d5a';
    const publicKey = 'D2fBmXS-nbsvb1U1L';

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, publicKey);

      setStatusMessage('Successfully subscribed! We will be in touch soon.');
      setEmail('');
    } catch (error) {
      console.error('FAILED...', error.text);
      setStatusMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setStatusMessage('');
      }, 5000);
    }
  };

  return (
    <motion.footer
      className="bg-gray-900 text-gray-200 py-16 shadow-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-6">
              <Home className="h-8 w-8 text-emerald-400 mr-3 animate-pulse" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Asaan Ghar
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              Your trusted partner for buying, selling, and renting properties in Karachi, making the process seamless and efficient.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ icon: Icon, href, name }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-emerald-500 text-gray-300 transition-colors duration-300 transform hover:scale-110"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={name}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 text-emerald-300">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <motion.li key={i} whileHover={{ x: 5 }} className="group">
                  <a
                    href={link.href}
                    className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors text-sm sm:text-base"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 text-emerald-300">Popular Localities</h3>
            <ul className="space-y-2.5">
              {popularKarachiLocalities.map((loc, i) => (
                <motion.li key={i} whileHover={{ x: 5 }} className="group">
                  <div className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors text-sm sm:text-base cursor-default">
                    <MapPin size={16} className="mr-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {loc.name}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 text-emerald-300">Contact Us</h3>
            <ul className="space-y-3 mb-6 text-gray-400 text-sm sm:text-base">
              <li className="flex items-start">
                <MapPin className="text-emerald-400 mr-3 mt-1 shrink-0" size={18} />
                <address className="not-italic">
                  plot #123, Scheme 33 Cooperative Housing Society, Karachi, Sindh, Pakistan
                </address>
              </li>
              <li className="flex items-center">
                <Phone className="text-emerald-400 mr-3 shrink-0" size={18} />
                <a href="tel:+923001234567" className="hover:text-emerald-400 transition-colors">
                  +92 332 7923489
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-emerald-400 mr-3 shrink-0" size={18} />
                <a href="mailto:contact@asaanghar.com" className="hover:text-emerald-400 transition-colors">
                  asaanghar.pk@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="w-full">
              <h4 className="font-semibold mb-4 text-emerald-300 text-sm sm:text-base text-center">
                Subscribe to Our Newsletter
              </h4>
              <form
                ref={form}
                onSubmit={handleNewsletterSubmit}
                className="flex items-center w-full bg-gray-800 rounded-full overflow-hidden shadow-lg ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 transition"
              >
                <input
                  type="email"
                  name="user_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-grow px-4 py-3 text-sm text-white bg-transparent placeholder-gray-400 focus:outline-none"
                />
                <input
                  type="hidden"
                  name="user_name"
                  value={email.split("@")[0] || ""}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                  className="py-3 pl-2.5 pr-6 w-32 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-0 active:bg-emerald-600 transition-all duration-200 ease-in-out text-left flex items-center justify-center"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <span className="block w-full text-left">Subscribe</span>
                  )}
                </motion.button>
              </form>

              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 text-center text-sm font-semibold p-3 rounded-lg ${
                    statusMessage.includes('Successfully') ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {statusMessage}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p className="mb-4">© {new Date().getFullYear()} Asaan Ghar. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;