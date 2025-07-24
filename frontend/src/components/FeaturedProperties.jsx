import { useState } from "react"
import { MapPin, Bed, Bath, Square, Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom";


const PropertyCard = ({ property, index }) => {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-200"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="relative overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-emerald-50 to-teal-50">
          <img
            src={property.image || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center`}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
            property.type === 'For Sale' 
              ? 'bg-green-800 text-white' 
              : 'bg-sky-800 text-white'
          }`}>
            {property.type}
          </span>
        </div>
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-300 group/heart"
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${
              isLiked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 group-hover/heart:text-red-500'
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{property.title}</h3>
          <p className="text-xl font-bold text-emerald-600 whitespace-nowrap ml-2">{property.price}</p>
        </div>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <p className="text-sm line-clamp-1">{property.location}</p>
        </div>

        <div className="flex justify-between mb-6 text-sm">
          <div className="flex items-center">
            <Bed size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-700 font-medium">{property.beds}</span>
          </div>
          <div className="flex items-center">
            <Bath size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-700 font-medium">{property.baths}</span>
          </div>
          <div className="flex items-center">
            <Square size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-700 font-medium">{property.area}</span>
          </div>
        </div>

        <button className="w-full py-3 bg-emerald-100 border-2 border-emerald-500 text-white rounded-xl font-semibold hover:from-emerald-800 hover:to-green-700 transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-lg group/btn">
          <span className="flex items-center text-green-950 justify-center">
            View Details
            <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  )
}

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      title: "Modern Family Home",
      price: "PKR 1.2 Crore",
      location: "DHA Phase 5, Lahore",
      type: "For Sale",
      beds: "4 Beds",
      baths: "3 Baths",
      area: "2400 sq ft",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Luxury Apartment",
      price: "PKR 85 Lac",
      location: "Bahria Town, Islamabad",
      type: "For Rent",
      beds: "3 Beds",
      baths: "2 Baths",
      area: "1800 sq ft",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Penthouse Suite",
      price: "PKR 2.5 Crore",
      location: "Clifton, Karachi",
      type: "For Sale",
      beds: "5 Beds",
      baths: "4 Baths",
      area: "3200 sq ft",
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Cozy Studio Apartment",
      price: "PKR 45 Lac",
      location: "Gulberg, Lahore",
      type: "For Rent",
      beds: "1 Bed",
      baths: "1 Bath",
      area: "850 sq ft",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      title: "Countryside Villa",
      price: "PKR 3.8 Crore",
      location: "Murree Hills",
      type: "For Sale",
      beds: "6 Beds",
      baths: "5 Baths",
      area: "4500 sq ft",
      image: "https://images.unsplash.com/photo-1600607688960-e095effe7b22?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 6,
      title: "Commercial Space",
      price: "PKR 1.5 Crore",
      location: "Blue Area, Islamabad",
      type: "For Sale",
      beds: "N/A",
      baths: "2 Baths",
      area: "2000 sq ft",
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&h=400&fit=crop&crop=center",
    },
  ]

  return (
    <>
   
      
      <section className="relative py-24 bg-emerald-800/70

 overflow-hidden">
        {/* Professional Top Wave */}

        {/* <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="white"
              opacity=" "
            ></path>
          </svg>
        </div> */}



 {/* bot\\\TOMMMMMMMMMMMMMMMM top con */}
<div className="absolute -top-8 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
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

 {/* botTOMMMMMMMMMMMMMMMM */}
    <div className="absolute -bottom-2 left-0 w-full overflow-hidden leading-none rotate-180">
  <svg
    className="relative block w-full h-20"
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

        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>

        {/* Main Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 border-1 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-sky-800 rounded-full mr-2"></span>
              Premium Properties
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-white">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed text-white/70">
              Discover our handpicked selection of premium properties across Pakistan. Each listing represents 
              exceptional value, prime locations, and outstanding architectural design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>

         <div className="text-center">
      <Link to="/buy">
        <button className="inline-flex items-center px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group">
          View All Properties
          <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </Link>
    </div>
        </div>
      </section>
    </>
  )
}

export default FeaturedProperties