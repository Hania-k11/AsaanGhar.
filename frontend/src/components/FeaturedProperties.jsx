
import { useInView } from "react-intersection-observer"
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const PropertyCard = ({ property, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative overflow-hidden group">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {property.type}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 hover:text-red-500 transition-colors"
        >
          <Heart size={20} />
        </motion.button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
          <p className="text-xl font-bold text-emerald-600">{property.price}</p>
        </div>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin size={16} className="mr-1" />
          <p className="text-sm">{property.location}</p>
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <Bed size={18} className="text-gray-400 mr-1" />
            <span className="text-gray-600">{property.beds}</span>
          </div>
          <div className="flex items-center">
            <Bath size={18} className="text-gray-400 mr-1" />
            <span className="text-gray-600">{property.baths}</span>
          </div>
          <div className="flex items-center">
            <Square size={18} className="text-gray-400 mr-1" />
            <span className="text-gray-600">{property.area}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}

const FeaturedProperties = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
      image: "/placeholder.svg?height=400&width=600",
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
      image: "/placeholder.svg?height=400&width=600",
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
      image: "/placeholder.svg?height=400&width=600",
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
      image: "/placeholder.svg?height=400&width=600",
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
      image: "/placeholder.svg?height=400&width=600",
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
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across Pakistan. Find your dream home among these
            exceptional listings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-colors"
          >
            View All Properties
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProperties