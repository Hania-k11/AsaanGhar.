/* eslint-disable no-unused-vars */

import React, { useEffect } from "react";
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

const AboutPage = () => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = originalOverflow;
    };
  }, []);

  return (
    <div
      className="overflow-x-hidden w-full max-w-screen"
      style={{ overflowX: "hidden" }}
    >
      {/* HERO SECTION */}
      <motion.section
        variants={slideInUp}
        className="bg-gradient-to-b from-white to-emerald-50 pt-28 pb-16 text-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-inter font-bold  mb-4 text-emerald-700 text-center"
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

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 14,
              duration: 0.9,
              delay: 0.1,
            }}
            className="mt-10"
          >
            <motion.div
              className="flex flex-wrap justify-center items-center gap-4 px-6 py-3 bg-white border border-emerald-200 text-emerald-800 rounded-full text-sm font-medium shadow hover:shadow-lg transition duration-300 hover:bg-emerald-50 hover:border-emerald-300 max-w-fit mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {[
                [<Home size={16} />, "Smart Homes"],
                [<MapPin size={16} />, "Maps"],
                [<Mic size={16} />, "Voice Search"],
              ].map(([icon, text], i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  {icon} {text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* WHAT WE OFFER */}
      <motion.section
        variants={fadeInUp}
        className="bg-white py-24 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32"
      >
        <div className="max-w-7xl mx-auto">
          <Fade cascade damping={0.1} triggerOnce>
            <h2 className="text-4xl font-bold text-center text-emerald-700 mb-16">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[
                ["🏘️", "Easy Listings", "First ever natural language processing site in real estate."],
                ["📞", "Owner Contact", "Talk directly with owners — no middlemen, no commissions."],
                ["📱", "Mobile First", "Use on any device, anywhere. 100% mobile optimized."],
                ["🧠", "Smart Search", "Find your dream place with AI-powered and filter-based discovery."],
                ["🌍", "Bilingual Support", "Search your property in your comfortable language."],
                ["🗺️", "Map View", "Visualize properties using Maps for smarter location picking."],
              ].map(([icon, title, desc], i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group p-8 bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:bg-emerald-50"
                >
                  <div className="text-5xl mb-5 text-emerald-600 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-transform duration-300">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-emerald-700 group-hover:underline">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </Fade>
        </div>
      </motion.section>

      {/* OUR MISSION */}
      <motion.section
        variants={fadeInUp}
        className="bg-emerald-50 py-20 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              We aim to build Pakistan’s most trusted property platform — smart, secure and super easy. Whether you're a first-time buyer, a busy family, or someone looking to invest, we’re making real estate simpler, fairer, and more accessible.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              At Asaan Ghar, we believe homeownership shouldn't be complicated. We’re eliminating outdated broker practices by connecting users directly with property owners—no commissions, no surprises.
            </p>
            <p className="text-lg text-gray-700">
              We're also working to bridge digital literacy gaps by supporting Urdu language, voice search, and mobile-first design—so everyone can buy and sell with ease.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ACHIEVEMENTS */}
      <motion.section
        variants={fadeInUp}
        className="bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-10">
              Why Thousands Trust Asaan Ghar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: "🏘️", number: "10K+", label: "Listings" },
                { icon: "👥", number: "5K+", label: "Buyers" },
                { icon: "🔒", number: "100%", label: "Results" },
              ].map(({ icon, number, label }, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-emerald-300 hover:scale-105 border hover:border-emerald-400"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-2xl font-bold text-emerald-800">{number}</h3>
                  <p className="text-gray-700 mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* VISION 2025 */}
      <motion.section
        variants={fadeInUp}
        className="bg-emerald-50 py-20 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 text-center border-t border-gray-200"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">Vision 2025 & Beyond</h2>
            <p className="text-lg text-gray-700 mb-10">
              Our vision: Pakistan’s most intelligent and inclusive real estate platform — with AI, voice, and Urdu NLP at the core.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {[
                ["🤖", "AI-based Searching"],
                ["🎤", "Voice Search Support"],
                ["🌐", "English and Urdu Searching Support"],
                ["🗺️", "Built-in Maps"],
              ].map(([icon, text], i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-4 p-5 bg-white border border-emerald-100 rounded-2xl shadow hover:shadow-md transition duration-300 hover:bg-emerald-100 hover:border-emerald-200"
                >
                  <div className="text-2xl text-emerald-600">{icon}</div>
                  <p className="text-emerald-800 font-medium">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={fadeInUp}
        className="py-20 bg-white text-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">Start Your Journey Today</h2>
            <p className="text-lg text-gray-700 mb-8">
              Find your dream properties with no hurdles of complex filters and move Commission-Free. Making real estate easy for everyone.
            </p>
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full shadow hover:shadow-xl transition duration-300"
            >
              View Properties →
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
