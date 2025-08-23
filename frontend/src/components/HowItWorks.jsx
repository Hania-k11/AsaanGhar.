import React, { useState, useEffect } from "react"
import { Search, Home, Key, DollarSign, Sparkles, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const HowItWorks = () => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

const handleClick = () => {
    navigate('/buy');
  }

  const handleClickLearnMore = () => {
    navigate('/about');
  }


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.dataset.index]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-white" />,
      title: "Search Properties",
      description: "Browse thousands of properties across Pakistan. Filter by location, price, and features to find your perfect match.",
      color: "from-emerald-500 via-emerald-400 to-teal-400",
      shadowColor: "shadow-emerald-500/25",
      number: "01"
    },
    {
      icon: <Home className="w-8 h-8 text-white" />,
      title: "Tour Homes",
      description: "Schedule viewings at your convenience. Take virtual tours or visit in person with our trusted agents.",
      color: "from-teal-500 via-teal-400 to-cyan-400",
      shadowColor: "shadow-teal-500/25",
      number: "02"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-white" />,
      title: "Make an Offer",
      description: "Found your dream home? Make an offer directly through our platform. Our experts will guide you through the process.",
      color: "from-cyan-500 via-cyan-400 to-blue-400",
      shadowColor: "shadow-cyan-500/25",
      number: "03"
    },
    {
      icon: <Key className="w-8 h-8 text-white" />,
      title: "Get Your Keys",
      description: "Complete the paperwork, finalize the deal, and get the keys to your new home. Start living in your dream house, Its that simple.",
      color: "from-blue-500 via-blue-400 to-indigo-400",
      shadowColor: "shadow-blue-500/25",
      number: "04"
    },
  ]


  
  return (
    <section className="relative py-24 bg-white overflow-hidden">


 {/* Top Wave */}
<div className="absolute -top-1 left-0 w-full leading-[0]">
  <svg
    className="relative block w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    viewBox="0 0 1200 120"
  >
    <path
      d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,
         70.36-5.37,136.33-33.31,206.8-37.5,
         C438.64,32.43,512.34,53.67,583,72.05,
         c69.27,18,138.3,24.88,209.4,13.08,
         36.15-6,69.85-17.84,104.45-29.34,
         C989.49,25,1113-14.29,1200,52.47V0Z"
      fill="#082733"
    ></path>
  </svg>
</div>




      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-emerald-300 opacity-20 animate-bounce`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div 
          data-animate 
          data-index="header" 
          className={`text-center mb-20 transition-all duration-1000 ${
            visibleItems.has('header') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center md:mt-5 gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full mb-6 border border-emerald-100">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600 font-medium text-sm">Simple Process</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            How <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Asaan Ghar</span> Works
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            We've revolutionized the property experience with a seamless, intelligent process that makes finding your dream home effortless and enjoyable.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              data-animate
              data-index={`step-${index}`}
              className={`group relative transition-all duration-700 delay-${index * 100} ${
                visibleItems.has(`step-${index}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0">
                  <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 group-hover:scale-105">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className={`relative mb-6 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-xl ${step.shadowColor} group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                  {step.icon}
                  
                  {/* Animated Ring */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-white/30 ${activeStep === index ? 'animate-ping' : ''}`}></div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div 
          data-animate 
          data-index="cta" 
          className={`transition-all duration-1000 delay-300 ${
            visibleItems.has('cta') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-3xl p-12 shadow-lg border border-emerald-100 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left lg:flex-1">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Ready to find your dream home?
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  Join thousands of satisfied customers who discovered their perfect properties with our intelligent platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button  onClick={handleClick} className="group relative bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Search
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button onClick={handleClickLearnMore} className="group bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse Follower */}
      {/* <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full pointer-events-none z-50 opacity-20 blur transition-opacity duration-300"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'translate3d(0, 0, 0)'
        }}
      ></div>


      -------------------------------------- */}

       {/* <div 
        className="fixed pointer-events-none z-50 opacity-30 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <Home className="w-6 h-6 text-emerald-500 drop-shadow-lg animate-pulse" />
      </div> */}
      
    </section>
  )
}

export default HowItWorks