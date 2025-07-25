import { useState, useEffect } from "react"
import { motion } from "framer-motion";
import { ArrowRight, Home, Search, Key, Heart, Sparkles, MapPin, Star, Users, CheckCircle } from "lucide-react"

const StartJourney = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const journeySteps = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse thousands of verified properties",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Shortlist",
      description: "Save your favorite homes instantly",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: MapPin,
      title: "Visit",
      description: "Schedule virtual or physical tours",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Key,
      title: "Own",
      description: "Complete your dream home purchase",
      color: "from-emerald-500 to-teal-500"
    }
  ]

  const stats = [
    { icon: Home, number: "50K+", label: "Properties Listed" },
    { icon: Users, number: "25K+", label: "Happy Families" },
    { icon: Star, number: "4.9", label: "Average Rating" },
    { icon: CheckCircle, number: "99%", label: "Success Rate" }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
       
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
     
 
        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '1000ms' }}>
          <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-3xl p-12 md:p-16 border border-gray-100 shadow-xl relative overflow-hidden group">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              Start Today With
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Asaan Ghar
              </span>
            </h3>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of happy families who trusted us with their property journey. Start exploring today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             
             <motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
  whileTap={{ scale: 0.98 }}
  className="group bg-gradient-to-r from-cyan-500/50 to-emerald-600 group relative  px-10 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300  justify-center overflow-hidden00 text-white px-10 py-5 rounded-2xl font-semibold text-lg flex items-center gap-3 hover:from-emerald-700/70 hover:to-emerald-800"
>
  <Home size={24} className="group-hover:animate-bounce" />
  Browse Properties
  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
</motion.button>

<motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
   whileTap={{ scale: 0.98 }}
  className="group bg-white text-gray-800 px-10 py-5 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-emerald-300 flex items-center gap-3 font-semibold backdrop-blur-md hover:border-white/50 transition-all duration-300"
>
  <Search size={24} className="group-hover:animate-pulse" />
  Advanced Search
</motion.button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>No hidden fees • Quick approval • 24/7 support</span>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100 shadow-lg">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full border-2 border-white shadow-sm"></div>
              ))}
            </div>
            <span className="text-gray-700 font-medium">Join 25,000+ satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StartJourney