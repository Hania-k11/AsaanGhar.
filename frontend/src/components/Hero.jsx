import { Search, Mic, MapPin, HomeIcon, Home, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react";
import axios from "axios";

import FloatingElements from "./FloatingElements"


const Hero = () => {
  const [query, setQuery] = useState("");

const handleSearch = async () => {
  try {
    const response = await axios.post("/api/search", { query });
    console.log("Parsed NLP Response:", response.data);

    // Example:
    // const { intent, location, propertyType } = response.data;
    // You can use this for filtering listings
  } catch (error) {
    console.error("NLP search error:", error);
  }
};

  return (
    <div className="relative pt-10 overflow-hidden font-sans ">
      
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">

 

   <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-200/50 via-emerald-200/80 to-teal-800/60 backdrop-blur-sm shadow-[inset_0_-15px_30px_-10px_rgba(0,0,0,0.3)]"></div>
        
        
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{
            scale: 1.05,
            y: [0, -10, 0],
          }}
          transition={{
            scale: { duration: 12, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 24, repeat: Infinity, repeatType: "reverse" },
          }}
          className="w-full h-full"
        >
          
        </motion.div>
      </div>

{/* Background with subtle gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-emerald-200/10 to-gray-100/40 backdrop-blur-sm"></div>
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="w-full h-full bg-[url('/homebg.avif')] bg-cover bg-center opacity-30 md:opacity-40"
        />
      </div>

      

      {/* Main content container */}
      <div className="container  mx-auto px-6 z-20 relative flex flex-col items-center justify-center h-screen text-center">
        {/* Icon with animation */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-6 md:-mt-20"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <Home className=" h-17 w-18 m:h-20 m:w-22 text-emerald-600" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold drop-shadow-[4px_4px_2px_white] text-cyan-950/90 mb-4   leading-tight"
        >
          Find Your <span className="text-emerald-700 drop-shadow-[2px_2px_2px_white] ">Dream Place</span> With Ease
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto"
        >
          Asaan Ghar simplifies buying, selling, and renting properties. Your journey to the perfect home starts here.
        </motion.p>
{/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          className="w-full max-w-4xl px-4 relative"
        >
          {/* Outer magical glow - continuously looping */}
          {/* <motion.div
           
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 bg-gradient-to-r from-stone-400 via-teal-400/40 to-stone-400 rounded-3xl blur-xl "
          /> */}

          {/* Secondary rotating glow */}
          <motion.div
           
          
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -inset-1 bg-gradient-to-r from-teal-300/20 via-emerald-500/30 to-teal-300/20 rounded-3xl blur-xl"
          />

          {/* Pulsing inner glow */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -inset-4 bg-gradient-to-r from-emerald-200/40 via-white/20 to-teal-200/40 rounded-2xl blur-lg"
          />

          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ duration: 0.3 }}
            className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-white/20"
          >
            {/* Animated rainbow border */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(45deg, #10b981, #14b8a6, #06b6d4, #10b981)",
                  "linear-gradient(45deg, #14b8a6, #06b6d4, #10b981, #14b8a6)",
                  "linear-gradient(45deg, #06b6d4, #10b981, #14b8a6, #06b6d4)",
                  "linear-gradient(45deg, #10b981, #14b8a6, #06b6d4, #10b981)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-2xl p-[2px] opacity-60"
            >
              <div className="w-full h-full bg-white/95 rounded-2xl"></div>
            </motion.div>

            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                repeatDelay: 1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            />

            {/* Floating particles */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-4 right-8 w-2 h-2 bg-emerald-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-12 right-16 w-1.5 h-1.5 bg-teal-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -25, 0],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-8 left-12 w-1 h-1 bg-emerald-300 rounded-full"
            />

            <div className="relative z-20 flex flex-col md:flex-row items-center gap-4">
              {/* Ultra Enhanced search input */}
              <div className="relative flex-1 w-full group">
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  {/* Input glow effect */}
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-teal-400/30 to-emerald-400/20 rounded-xl blur-sm group-focus-within:opacity-100 opacity-0 transition-opacity duration-300"
                  />

                  <motion.div
                    animate={{
                      x: [0, 2, 0],
                    }}
                    transition={{
                      duration: 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors duration-300"
                  >
                    <Search className="text-gray-400 w-5 h-5" />
                  </motion.div>

                  <input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search for your desired property location..."
  className="relative z-10 w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400 font-medium shadow-sm"
/>

                </motion.div>
              </div>
            

              {/* Enhanced search button */}
              <motion.button
  onClick={handleSearch}
  whileHover={{
    scale: 1.05,
    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
  }}
  whileTap={{ scale: 0.95 }}
  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
>

                <span className="relative z-10">Search</span>
                <Search className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </motion.button>
              
              {/* Enhanced mic button */}
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(16, 185, 129, 0.1)"
                }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-gray-50 hover:bg-black rounded-xl transition-all duration-300 shadow-md border border-gray-200 hover:border-emerald-200 group relative"
              >
                <Mic className="text-gray-600 group-hover:text-black w-5 h-5 transition-colors duration-300" />
                {/* Pulse animation for mic */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute inset-0 rounded-xl bg-emerald-400/30 pointer-events-none"
                />
              </motion.button>
            </div>
            
            {/* Bottom accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-b-2xl z-10"
            />
          </motion.div>
        </motion.div>

        {/* Optional Trusted by (commented out) */}
        {/* <div className="mt-10 flex items-center justify-center space-x-8">
          <p className="text-white font-medium">Trusted by:</p>
          {/* Logos or client icons can go here */}
        {/* </div> */}

      </div>

      {/* Wave separator */}
      <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
        <motion.svg
         
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <motion.path
            animate={{
              d: [
                "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,122C96,148,192,180,288,180C384,180,480,148,576,142.7C672,137,768,159,864,169.3C960,180,1056,180,1152,158.7C1248,137,1344,95,1392,73.3L1440,52L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            fill="#ffffffff
"
            fillOpacity="1"
          />
        </motion.svg>
      </div>
    </div>

   
  )
}

export default Hero
