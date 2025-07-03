
import { Search, MapPin, HomeIcon, DollarSign } from "lucide-react"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import FloatingElements from "./FloatingElements"

const Hero = () => {
  return (
    <div className="relative pt-20 overflow-hidden">
    
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/90 to-teal-800/60 z-10"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{
            scale: 1.05,
            y: [0, -10, 0],
          }}
          transition={{
            scale: { duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            y: { duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
          }}
          className="w-full h-full"
        >
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Modern homes"
            className="w-full h-screen object-cover"
          />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
    
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Find Your <span className="text-emerald-700">Dream Home</span> With Ease
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-green-950 mb-8"
          >
            Asaan Ghar makes buying, selling, and renting properties simpler than ever before. Your journey to the
            perfect home starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-2xl"
          >
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex-1 relative">
                <HomeIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white">
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white">
                  <option value="">Price Range</option>
                  <option value="0-5000000">Under 50 Lac</option>
                  <option value="5000000-10000000">50 Lac - 1 Crore</option>
                  <option value="10000000-20000000">1 - 2 Crore</option>
                  <option value="20000000+">Above 2 Crore</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                <Search className="mr-2" size={20} />
                Search
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 flex items-center space-x-4"
          >
            <p className="text-white font-medium">Trusted by:</p>
            <div className="flex space-x-6">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <div className="w-20 h-8 bg-white/30 rounded"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero
