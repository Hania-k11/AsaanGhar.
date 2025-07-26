import React from "react";
import { motion } from "framer-motion";
import { Home, MapPin, Globe2, KeyRound, Building2 } from "lucide-react";

const AboutPage = () => {
  return (
    <motion.div
      className="bg-white text-gray-800 min-h-screen overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.section
        className="relative bg-gradient-to-b from-white via-emerald-50 to-teal-100 pt-32 pb-44 text-center"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-10">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f0fdfa" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
          </svg>
        </div>

        {[{ icon: <Home className="w-6 h-6 opacity-20" />, pos: "top-10 left-12", delay: 0 }, { icon: <MapPin className="w-6 h-6 opacity-20" />, pos: "top-28 right-16", delay: 0.5 }, { icon: <Globe2 className="w-6 h-6 opacity-20" />, pos: "top-1/2 left-6", delay: 1 }, { icon: <KeyRound className="w-6 h-6 opacity-20" />, pos: "bottom-16 right-8", delay: 1.5 }, { icon: <Building2 className="w-6 h-6 opacity-20" />, pos: "bottom-10 left-10", delay: 2 }].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.pos} text-gray-400`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
          >
            {item.icon}
          </motion.div>
        ))}

        <motion.div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl z-0" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-40 -right-32 w-[400px] h-[400px] bg-teal-100/40 rounded-full blur-3xl z-0" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative z-20 px-6 md:px-20 lg:px-32">
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Your Next Home. Zero Agents.<br />100% Verified Properties.
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            Asaan Ghar redefines how Pakistan finds homes — with direct access to listings, smart AI tools, and no middlemen. Just ease, trust & transparency.
          </motion.p>

          <motion.div className="inline-block px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200 shadow text-emerald-800 font-medium text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            🔍 NLP Smart Search · 📍 Maps & Filters · 💬 Urdu & English
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f0fdfa" d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </motion.section>

      <motion.div className="mb-24 overflow-hidden rounded-3xl shadow-xl mx-6 md:mx-20 lg:mx-32" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Asaan Ghar Property" className="w-full h-[500px] object-cover" />
      </motion.div>

      <motion.div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 md:p-16 mb-24 shadow-xl mx-6 md:mx-20 lg:mx-32" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-emerald-700 mb-4 tracking-tight">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-5">At <span className="text-emerald-600 font-semibold">Asaan Ghar</span>, we believe that finding a home should be as seamless as scrolling your phone. That’s why we built a platform that empowers people across Pakistan to buy, rent, and sell property — without agents or hidden barriers.</p>
            <p className="text-gray-600 text-base mb-5">We’re not just listing homes; we’re transforming how property works — smarter, faster, and 100% transparent.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
              {"Direct user-to-owner messaging,Zero commission listings,Verified property uploads,Mobile-first experience".split(',').map((point, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-600 text-lg">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-full overflow-hidden rounded-2xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Mission" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      <motion.div className="text-center mb-20 px-6 md:px-20 lg:px-32" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-emerald-600 mb-6">Why Choose Asaan Ghar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {["No Middlemen|Talk directly with owners or buyers. 100% verified users.|🏠","Modern UI|Fast, mobile-first experience inspired by Airbnb & Zameen.|⚡","Smart Filters|NLP-powered search, smart location and budget matching.|🤖"].map((item, idx) => {
            const [title, desc, icon] = item.split('|');
            return (
              <motion.div key={idx} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all" whileHover={{ y: -5 }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-emerald-600 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 mt-20 mx-6 md:mx-20 lg:mx-32 mb-28 shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-emerald-700 mb-4">Vision 2025 & Beyond</h2>
        <p className="text-lg text-gray-700 mb-4">Asaan Ghar aims to become the most trusted real estate platform in Pakistan. We are integrating:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Smart AI-based property recommendations</li>
          <li>Voice search for users of all literacy levels</li>
          <li>Bilingual support (English, Urdu, Roman Urdu)</li>
          <li>Location-based filters with Google Maps</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
