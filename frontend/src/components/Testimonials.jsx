
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { useState, useEffect } from "react"
import {  AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import FloatingElements from "./FloatingElements"

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      id: 1,
      name: "Ahmed Khan",
      location: "Lahore",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "Asaan Ghar made finding my dream home truly asaan (easy)! The platform is intuitive, and the team was incredibly helpful throughout the entire process. I found my perfect home in DHA Phase 5 within just two weeks!",
    },
    {
      id: 2,
      name: "Fatima Zaidi",
      location: "Karachi",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "As a first-time homebuyer, I was nervous about the process. Asaan Ghar guided me every step of the way. Their property listings are detailed and accurate, and their agents are knowledgeable and patient. Highly recommended!",
    },
    {
      id: 3,
      name: "Usman Ali",
      location: "Islamabad",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "I sold my apartment through Asaan Ghar and was impressed by how quickly they found qualified buyers. The process was smooth, and I got a fair price. Their commission rates are reasonable compared to traditional agents.",
    },
    {
      id: 4,
      name: "Ayesha Malik",
      location: "Faisalabad",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The virtual tours feature saved me so much time! I was relocating from abroad and could view properties remotely. The 3D tours were detailed enough for me to make a confident decision. Thank you, Asaan Ghar!",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const handlePrev = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
       
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers who found their dream homes through Asaan
            Ghar.
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="absolute -top-6 left-10 text-emerald-500 opacity-20">
                <Quote size={80} />
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-100"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < testimonials[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg italic mb-6">"{testimonials[currentIndex].text}"</p>

                  <div>
                    <h4 className="text-xl font-bold">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-500">{testimonials[currentIndex].location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="bg-white p-3 rounded-full shadow-md text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="bg-white p-3 rounded-full shadow-md text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false)
                  setCurrentIndex(index)
                }}
                className={`w-3 h-3 mx-1 rounded-full ${index === currentIndex ? "bg-emerald-500" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
