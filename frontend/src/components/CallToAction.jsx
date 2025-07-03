
import { useInView } from "react-intersection-observer"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
          }}
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white opacity-10"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 7,
            delay: 1,
          }}
          className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-white opacity-10"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 9,
            delay: 2,
          }}
          className="absolute top-40 right-40 w-40 h-40 rounded-full bg-white opacity-5"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers who found their perfect property with Asaan Ghar. Start your journey
            today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              Browse Properties
              <ArrowRight className="ml-2" size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-all"
            >
              List Your Property
            </motion.button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">10K+</div>
              <div className="text-white/80">Properties</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">15K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">200+</div>
              <div className="text-white/80">Cities</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-white/80">Awards</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
