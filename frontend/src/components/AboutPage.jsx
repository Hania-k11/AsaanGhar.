import React from "react";

import { motion } from "framer-motion";
import { Fade, Zoom, Slide } from "react-awesome-reveal";
import { Home, MapPin, Globe2, KeyRound, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  
  return (
    <>
      <style>{`
        @keyframes oceanMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ocean-wave {
          animation: oceanMove 5s linear infinite;
          display: flex;
        }

        .wave {
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path fill="%23f0fdfa" d="M0,30 C360,90 1080,10 1440,70 L1440,100 L0,100 Z"/></svg>');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

       @keyframes greenShine {
  0% {
    transform: translateX(-100%) rotate(15deg);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateX(200%) rotate(15deg);
    opacity: 0;
  }
}



        @keyframes waveMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
          100% { transform: translateX(0); }
        }

        .animated-wave {
          animation: waveMove 8s ease-in-out infinite;
        }

        .floating-icon {
          position: fixed;
          bottom: 20px;
          z-index: 50;
          background-color: #10b981;
          color: white;
          padding: 10px;
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }

        .floating-icon:hover {
          transform: scale(1.1);
        }

        .chat-icon {
          right: 20px;
        }

        .call-icon {
          right: 80px;
        }

        .lang-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 50;
          background: #f0fdfa;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 14px;
          color: #047857;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white text-gray-800 overflow-x-hidden"
      >
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-white via-emerald-50 to-teal-100 pt-32 pb-44 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-[100px] z-10 rotate-180">
            <div className="ocean-wave w-[200%] h-full relative">
              <div className="wave absolute top-0 left-0 w-full h-full"></div>
              <div className="wave absolute top-0 left-full w-full h-full"></div>
            </div>
          </div>

          {[Home, MapPin, Globe2, KeyRound, Building2].map((Icon, i) => {
            const pos = [
              "top-10 left-12",
              "top-28 right-16",
              "top-1/2 left-6",
              "bottom-16 right-8",
              "bottom-10 left-10",
            ][i];
            return (
              <motion.div
                key={i}
                className={`absolute ${pos} text-gray-400`}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="w-6 h-6 opacity-20" />
              </motion.div>
          

            );
          })}

          <motion.div
            className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -right-32 w-[400px] h-[400px] bg-teal-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity }}
          />

          <div className="relative z-20 px-6 md:px-20 lg:px-32">
            <Zoom cascade damping={0.1} triggerOnce>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600 mb-6">
                Verified Homes. No Agents. 100% Asaan.
              </h1>
            </Zoom>
            <Slide direction="up" delay={200} triggerOnce>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Asaan Ghar redefines how Pakistan finds homes — direct access, smart AI tools, no middlemen.
              </p>
<div className="relative group mt-6">
  <motion.div
    initial={{ scale: 1 }}
    animate={{
      backgroundPosition: ["0% center", "100% center", "0% center"],
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 8px rgba(16,185,129,0.2)",
        "0 0 18px rgba(16,185,129,0.4)",
        "0 0 8px rgba(16,185,129,0.2)"
      ]
    }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    whileHover={{
      scale: 1.07,
      boxShadow: "0 0 30px rgba(16,185,129,0.6)"
    }}
    className="inline-flex flex-wrap justify-center items-center gap-3 px-7 py-4 bg-[length:200%_auto] bg-gradient-to-r from-teal-400 via-white to-emerald-400 bg-left border border-emerald-400 rounded-full text-emerald-900 font-medium text-base cursor-pointer backdrop-blur-lg transition-all overflow-hidden relative z-10"
  >
    <span className="flex items-center gap-1">🔍 Smart Search</span>
    <span className="text-gray-400">•</span>
    <span className="flex items-center gap-1">📍 Maps & Filters</span>
    <span className="text-gray-400">•</span>
    <span className="flex items-center gap-1">💬 Urdu & English</span>

    {/* SHINE EFFECT */}
    <span className="absolute top-0 left-[-75%] w-[200%] h-full bg-white/20 transform rotate-12 group-hover:animate-shine z-0" />
  </motion.div>

  <style>{`
    @keyframes shine {
      0% { left: -75%; }
      100% { left: 100%; }
    }
    .group-hover\\:animate-shine {
      animation: shine 1.6s linear infinite;
    }
  `}</style>
</div>

            </Slide>
          </div>

          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg viewBox="0 0 1440 100" fill="none">
              <path fill="#f0fdfa" d="M0,100 C480,0 960,100 1440,0 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </section>

        {/* HERO IMAGE with animation */}
        <Slide direction="up" triggerOnce>
  <motion.div
    whileInView={{ opacity: 1, scale: 1 }}
    initial={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-24 overflow-hidden rounded-3xl shadow-xl mx-6 md:mx-20 lg:mx-32"
  >
    <motion.img
      src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
      alt="Modern House"
      className="w-full h-[500px] object-cover"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  </motion.div>
</Slide>


        {/* OUR MISSION */}
        <Fade cascade direction="up" damping={0.15} triggerOnce>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 md:p-16 mb-24 shadow-xl mx-6 md:mx-20 lg:mx-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-emerald-700 mb-4 tracking-tight">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-5">
                  At <span className="text-emerald-600 font-semibold">Asaan Ghar</span>, we’re transforming property in Pakistan — smarter, faster, and transparent.
                </p>
                <p className="text-gray-600 mb-5">Not just listings — full control, verified owners, zero hidden fees.</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  {[
                    "Direct user-to-owner messaging",
                    "Zero commission listings",
                    "Verified property uploads",
                    "Mobile-first experience",
                  ].map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-600 text-lg">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.9 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Mission"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9 }}
                />
              </motion.div>
            </div>
          </div>
        </Fade>

        {/* WHY CHOOSE US */}
        <Fade triggerOnce>
          <section className="bg-white text-center py-20 px-6 md:px-20 lg:px-32">
            <Zoom triggerOnce>
              <h2 className="text-4xl font-bold text-emerald-700 mb-12">Why Choose Asaan Ghar?</h2>
            </Zoom>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
  ["🏠", "No Middlemen", "Direct chats with property owners."],
  ["⚡", "Modern UI", "Fast, mobile-first, sleek experience."],
  ["🤖", "Smart Filters", "NLP AI-powered property search."],
].map(([icon, title, desc], idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 + idx * 0.2 }}
    whileHover={{ scale: 1.06 }}
    className="group relative rounded-3xl p-8 border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-transparent hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-400 overflow-hidden"
  >
    {/* SHINE LAYER */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-[-150%] w-[300%] h-full bg-white/10 opacity-0 rotate-12 group-hover:opacity-100 group-hover:animate-greenShine" />
    </div>

    {/* ICON */}
    <motion.div
      className="text-5xl mb-4 relative z-10 text-emerald-800 group-hover:text-white"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut" }}
    >
      {icon}
    </motion.div>

    {/* TITLE */}
    <h3 className="text-xl font-semibold mb-2 relative z-10 group-hover:text-white">
      {title}
    </h3>

    {/* DESCRIPTION */}
    <p className="text-sm text-gray-600 relative z-10 group-hover:text-white">
      {desc}
    </p>
  </motion.div>
))}



            </div>
          </section>
        </Fade>

        <Slide direction="up" triggerOnce>
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    whileHover={{ scale: 1.01 }}
    className="relative rounded-3xl mx-6 md:mx-20 lg:mx-32 mb-28 p-12 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-xl border border-emerald-200 hover:shadow-emerald-300 transition-all duration-700"
  >
    {/* TITLE */}
    <motion.h2
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold text-emerald-800 mb-6 text-center tracking-tight"
    >
      Vision 2025 & Beyond
    </motion.h2>

    {/* DESCRIPTION */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-lg text-emerald-700 text-center mb-10 max-w-2xl mx-auto leading-relaxed"
    >
      Our goal: Pakistan’s most trusted real estate platform powered by AI + voice + localization.
    </motion.p>

    {/* FEATURES LIST */}
    <motion.ul
      initial="hidden"
      whileInView="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
    >
      {[
        ["🤖", "Smart AI-based property recommendations"],
        ["🎤", "Voice search for all literacy levels"],
        ["🌐", "Bilingual support (English and Urdu)"],
        ["🗺️", "Built-in Google Maps filters"]
      ].map(([icon, text], idx) => (
        <motion.li
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 25px rgba(5,150,105,0.3)",
            backgroundColor: "#d1fae5"
          }}
          className="group relative flex items-start gap-4 p-5 bg-white border border-emerald-100 rounded-2xl shadow hover:shadow-lg transition-all duration-500 overflow-hidden"
        >
          {/* Green Shine On Hover */}
          <div className="absolute top-0 left-[-150%] w-[300%] h-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-greenShine rotate-12 z-0 pointer-events-none" />

          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 + idx * 0.3, ease: "easeInOut" }}
            className="text-2xl text-emerald-600 relative z-10"
          >
            {icon}
          </motion.span>
          <span className="text-md text-emerald-800 font-medium relative z-10 leading-snug">{text}</span>
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
</Slide>


        {/* FINAL CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-white text-gray-900 pt-40 pb-24 px-6 md:px-20 lg:px-32 overflow-hidden rounded-t-3xl shadow-inner"
        >
          {/* Floating Full-Width Top Wave */}
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full z-0"
          >
            <svg viewBox="0 0 1440 200" className="w-full h-48" preserveAspectRatio="none">
              <path fill="#d1fae5" d="M0,0 C360,160 1080,20 1440,100 L1440,0 L0,0 Z" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-16 left-24 w-72 h-72 bg-emerald-100 rounded-full blur-3xl z-0"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute bottom-12 right-16 w-72 h-72 bg-teal-100 rounded-full blur-3xl z-0"
          />

          <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-800"
            >
              Ready to Find Your Dream Home?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-gray-700"
            >
              Browse verified listings, chat with owners, and choose your new home — commission-free.
            </motion.p>

            {/* Use React Router Link to avoid flicker & scroll */}
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                to="/buy"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                Explore Listings
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default AboutPage;
