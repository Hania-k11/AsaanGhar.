
import { useInView } from "react-intersection-observer"
import { Search, Home, Key, DollarSign } from "lucide-react"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      icon: <Search className="w-12 h-12 text-white" />,
      title: "Search Properties",
      description:
        "Browse thousands of properties across Pakistan. Filter by location, price, and features to find your perfect match.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: <Home className="w-12 h-12 text-white" />,
      title: "Tour Homes",
      description:
        "Schedule viewings at your convenience. Take virtual tours or visit in person with our trusted agents.",
      color: "from-teal-500 to-cyan-400",
    },
    {
      icon: <DollarSign className="w-12 h-12 text-white" />,
      title: "Make an Offer",
      description:
        "Found your dream home? Make an offer directly through our platform. Our experts will guide you through the process.",
      color: "from-cyan-500 to-blue-400",
    },
    {
      icon: <Key className="w-12 h-12 text-white" />,
      title: "Get Your Keys",
      description: "Complete the paperwork, finalize the deal, and get the keys to your new home. It's that simple!",
      color: "from-blue-500 to-indigo-400",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Asaan Ghar Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've simplified the process of buying, selling, and renting properties. Follow these easy steps to find
            your dream home or sell your property.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg`}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-gray-600">
                Join thousands of satisfied customers who found their dream homes with Asaan Ghar.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              Start Your Search
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
