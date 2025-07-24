import { useState, useEffect, useRef } from "react"
import { ArrowRight, Sparkles, Award, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const CallToAction = () => {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { icon: Sparkles, value: "10K+", label: "Premium Properties", delay: 0 },
    { icon: Users, value: "15K+", label: "Satisfied Clients", delay: 0.1 },
    { icon: MapPin, value: "200+", label: "Prime Locations", delay: 0.2 },
    { icon: Award, value: "50+", label: "Industry Awards", delay: 0.3 },
  ]

  return (
    <section className="relative py-10 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      
      {/* Top SVG */}



 
 {/* <div className="absolute -top-8 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
  <svg
    className="block w-full h-28 md:h-32"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
  >
    <path
      fill="#ffffff"
      d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z"
    />
  </svg>
</div>
 */}









      {/* Sophisticated background pattern */}

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-32 h-32 border border-emerald-400/20 rounded-xl backdrop-blur-sm"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-24 h-24 border border-teal-400/20 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{
            rotate: [0, -360],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/4 w-16 h-16 border border-cyan-400/20 backdrop-blur-sm"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-medium tracking-wide">PREMIUM REAL ESTATE</span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
          >
            Discover Your
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Dream Home
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experience luxury living with Asaan Ghar's curated collection of premium properties. 
            Your perfect home awaits in the most sought-after locations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center">
                Explore Properties
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(221, 11, 11, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-semibold backdrop-blur-md hover:border-white/50 transition-all duration-300"
            >
              <span className="relative z-10">List Your Property</span>
            </motion.button>
          </motion.div>

         
        </motion.div>
      </div>

      <div className="absolute -bottom-6 left-0 w-full -translate-y-px overflow-hidden leading-none z-10">
  <svg
    className="block w-full h-28 md:h-32"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
  >
    <path
      fill="#ffffff"
      d="M0,0 C360,100 1080,100 1440,0 L1440,120 L0,120 Z"
    />
  </svg>
</div>

     
    </section>
  )
}

export default CallToAction