import React from "react";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { Home, MapPin, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const AboutPage = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggeredContainer}
      className="bg-white text-gray-800 overflow-x-hidden"
    >
      {/* HERO SECTION */}
      <motion.section
        variants={slideInUp}
        className="bg-gradient-to-b from-white to-emerald-50 pt-28 pb-16 text-center"
      >
        <div className="px-6 md:px-20 lg:px-32">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-4"
          >
            Verified Homes. No Agents. 100% Asaan.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
          >
            Revolutionizing property in Pakistan — smarter, transparent, and direct-to-owner.
          </motion.p>
        </div>{/* TAGS */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mt-10 px-6"
>
  <div className="inline-flex flex-wrap items-center gap-6 px-6 py-3 bg-white border border-emerald-200 text-emerald-800 rounded-full text-sm font-medium shadow hover:shadow-lg transition duration-300 hover:bg-emerald-50 hover:border-emerald-300">
    <span className="flex items-center gap-2">
      <Home size={16} /> Smart Homes
    </span>
    <span className="flex items-center gap-2">
      <MapPin size={16} /> Google Maps
    </span>
    <span className="flex items-center gap-2">
      <Mic size={16} /> Voice Search
    </span>
  </div>
</motion.div>

</motion.section>

      {/* WHAT WE OFFER */}
      <motion.section
        variants={fadeInUp}
        className="bg-white py-20 px-6 md:px-20 lg:px-32"
      >
        <Fade cascade damping={0.1} triggerOnce>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-left">
            {[
              ["🏘️", "Verified Listings", "Every property is double-checked and uploaded by real owners."],
              ["📞", "Owner Contact", "Talk directly with owners — no middlemen, no commissions."],
              ["📱", "Mobile First", "Use on any device, anywhere. 100% mobile optimized."],
              ["🧠", "Smart Search", "Find your dream place with AI-powered and filter-based discovery."],
              ["🌍", "Bilingual", "Urdu and English support for true accessibility."],
              ["🗺️", "Map View", "Visualize properties using Google Maps for smarter location picking."],
            ].map(([icon, title, desc], i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-all duration-300 hover:bg-emerald-100"
              >
                <div className="text-4xl mb-4 text-emerald-600 transition">{icon}</div>
                <h3 className="font-semibold text-xl mb-2 text-emerald-800">{title}</h3>
                <p className="text-gray-700">{desc}</p>
              </motion.div>
            ))}
          </div>
        </Fade>
      </motion.section>

      {/* OUR MISSION */}
      <motion.section
        variants={fadeInUp}
        className="bg-emerald-50 py-20 px-6 md:px-20 lg:px-32 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            We aim to build Pakistan’s most trusted property platform — smart, secure and super easy.
            Whether you're a first-time buyer, a busy family, or someone looking to invest, we’re making
            real estate simpler, fairer, and more accessible. Our mission is rooted in innovation and
            inclusivity, with cutting-edge technology that respects your time and choices.
          </p>
          <motion.img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            alt="A family in front of their new home"
            className="mx-auto rounded-2xl shadow-lg max-w-4xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      </motion.section>

      {/* VISION 2025 */}
      <motion.section
        variants={fadeInUp}
        className="bg-white py-20 px-6 md:px-20 lg:px-32 text-center border-t border-gray-200"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">Vision 2025 & Beyond</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            Our vision: Pakistan’s most intelligent and inclusive real estate platform — with AI, voice, and Urdu NLP at the core.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {[
              ["🤖", "AI-based Recommendations"],
              ["🎤", "Voice Search Support"],
              ["🌐", "English + Urdu NLP"],
              ["🗺️", "Built-in Google Maps"],
            ].map(([icon, text], i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-4 p-5 bg-white border border-emerald-100 rounded-2xl shadow hover:shadow-md transition duration-300 hover:bg-emerald-100 hover:border-emerald-200"
              >
                <div className="text-2xl text-emerald-600 transition">{icon}</div>
                <p className="text-emerald-800 font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        variants={fadeInUp}
        className="py-20 bg-emerald-50 text-center px-6 md:px-20 lg:px-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">Start Your Journey Today</h2>
          <p className="text-lg text-gray-700 mb-8">
            Find verified listings, chat directly with owners, and move commission-free.
          </p>
          <Link
            to="/buy"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full shadow hover:shadow-xl transition duration-300"
          >
            View Properties →
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;
