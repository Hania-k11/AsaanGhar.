import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Khan",
      location: "Lahore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Asaan Ghar made finding my dream home truly asaan (easy)! The platform is intuitive, and the team was incredibly helpful throughout the entire process. I found my perfect home in DHA Phase 5 within just two weeks!",
      title: "Software Engineer"
    },
    {
      id: 2,
      name: "Fatima Zaidi",
      location: "Karachi",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "As a first-time homebuyer, I was nervous about the process. Asaan Ghar guided me every step of the way. Their property listings are detailed and accurate, and their agents are knowledgeable and patient. Highly recommended!",
      title: "Marketing Manager"
    },
    {
      id: 3,
      name: "Usman Ali",
      location: "Islamabad",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      text: "I sold my apartment through Asaan Ghar and was impressed by how quickly they found qualified buyers. The process was smooth, and I got a fair price. Their commission rates are reasonable compared to traditional agents.",
      title: "Business Owner"
    },
    {
      id: 4,
      name: "Ayesha Malik",
      location: "Faisalabad",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The virtual tours feature saved me so much time! I was relocating from abroad and could view properties remotely. The 3D tours were detailed enough for me to make a confident decision. Thank you, Asaan Ghar!",
      title: "Architect"
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        handleNext(true)
      }, 6000)
    }
    return () => clearInterval(interval)
  }, [autoplay, currentIndex])

  const handlePrev = (auto = false) => {
    if (isAnimating) return
    if (!auto) setAutoplay(false)
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
      setIsAnimating(false)
    }, 300)
  }

  const handleNext = (auto = false) => {
    if (isAnimating) return
    if (!auto) setAutoplay(false)
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      setIsAnimating(false)
    }, 300)
  }

  const handleDotClick = (index) => {
    if (isAnimating || index === currentIndex) return
    setAutoplay(false)
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/40 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 transform transition-all duration-1000 hover:scale-105">
          <div className="inline-block p-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl mb-6 group hover:shadow-lg transition-all duration-300">
            <Quote className="w-8 h-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-emerald-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from our satisfied customers who found their dream homes through 
            <span className="text-emerald-600 font-semibold"> Asaan Ghar</span>.
          </p>
        </div>
        
        {/* Main Testimonial Card */}
        <div className="relative max-w-5xl mx-auto">
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-16 border border-gray-100 relative overflow-hidden group transition-all duration-700 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            
            {/* Quote Icon */}
            <div className="absolute -top-4 left-12 text-emerald-500/30 group-hover:text-emerald-500/50 transition-all duration-300 group-hover:scale-110">
              <Quote size={100} className="transform rotate-12" />
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
              {/* Profile Image */}
              <div className="flex-shrink-0 relative group/avatar">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full blur-lg opacity-30 group-hover/avatar:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10 group-hover/avatar:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full p-2 shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Rating Stars */}
                <div className="flex items-center justify-center lg:justify-start mb-6 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={`transition-all duration-300 hover:scale-125 ${
                        i < testimonials[currentIndex].rating 
                          ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" 
                          : "text-gray-300"
                      }`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                  <span className="ml-3 text-gray-600 font-medium">
                    {testimonials[currentIndex].rating}.0
                  </span>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-xl lg:text-2xl leading-relaxed mb-8 italic font-light">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Customer Info */}
                <div className="border-l-4 border-gradient-to-b from-emerald-500 to-blue-500 pl-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-1">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-emerald-600 font-semibold mb-1">
                    {testimonials[currentIndex].title}
                  </p>
                  <p className="text-gray-500 flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-12 gap-6">
            <button
              onClick={() => handlePrev()}
              disabled={isAnimating}
              className="group bg-white p-4 rounded-full shadow-xl border border-gray-100 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={28} className="group-hover:animate-pulse" />
            </button>

            <button
              onClick={() => handleNext()}
              disabled={isAnimating}
              className="group bg-white p-4 rounded-full shadow-xl border border-gray-100 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={28} className="group-hover:animate-pulse" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 hover:scale-125 ${
                  index === currentIndex 
                    ? "w-12 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-lg" 
                    : "w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom decorative element */}
       
      </div>
    </section>
  )
}

export default Testimonials