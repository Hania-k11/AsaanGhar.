
import { Search, Mic, MapPin, HomeIcon, Home, DollarSign } from "lucide-react"
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
      
      <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center items-center text-center">

        <div className="max-w-3xl">

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="flex items-center justify-center mb-6 -mt-16 scale-200 md:scale-200"
>
  <motion.div
    animate={{
      y: [0, -5, 0], // up and down motion
      rotate: [0, 5, -5, 0], // slight wiggle
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
    }}
  >
    <Home className="h-10 w-10 text-emerald-700 mr-2" />
  </motion.div>
  {/* <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
    Asaan Ghar
  </span> */}
</motion.div>


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
  className="flex justify-center"
>
  <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-2xl">
  <div className="flex items-center space-x-2">
    {/* Search input with icon */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search for your desired property"
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>

    {/* Search button */}
    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition duration-300">
      Search
    </button>

    {/* Mic icon */}
    <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300">
      <Mic className="text-gray-600" size={20} />
    </button>
  </div>
</div>

</motion.div>


          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8 flex items-center space-x-4"
          >
            <p className="text-black font-medium">Trusted by:</p>
            <div className="flex space-x-6">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-black/20 backdrop-blur-sm p-2 rounded-lg">
                  <div className="w-20 h-8 bg-white/30 rounded"></div>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className=" w-full h-auto">
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
