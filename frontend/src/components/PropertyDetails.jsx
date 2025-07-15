import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  User2,
  Bath,
  BedDouble,
  Home,
  Move,
  ListChecks,
  ParkingSquare,
  Thermometer,
  Waves,
  Plug,
  Ruler,
  LayoutGrid,
  X
} from "lucide-react";

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  if (!property) {
    return (
      <div className="text-center pt-40 text-xl text-gray-600">
        Property not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-12 px-4 md:px-20 lg:px-32 bg-gray-50 min-h-screen"
    >
      <AnimatePresence>
        {isImagePreviewOpen && (
          <motion.div
            className="fixed inset-0 bg-white/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute top-5 right-5 text-gray-700 hover:text-red-500 bg-white p-2 rounded-full shadow"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={property.image}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white shadow-2xl rounded-xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative group cursor-pointer">
          <motion.img
            src={property.image}
            alt={property.title}
            className="w-full h-[500px] object-cover transition-all duration-500 ease-in-out rounded-t-xl group-hover:scale-105"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsImagePreviewOpen(true)}
          />
        </div>

        <div className="p-6 md:p-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {property.title}
          </motion.h2>

          <motion.div
            className="flex items-center text-gray-600 mb-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
            {property.location}
          </motion.div>

          <motion.p
            className="text-2xl font-semibold text-emerald-600 mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {property.price}
          </motion.p>

          <motion.p
            className="text-base text-gray-500 mb-4 leading-relaxed"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {property.description ||
              "This property offers spacious living with modern amenities. It's perfect for families or investors looking for a premium location and design."}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-700 text-sm">
              <Home className="w-5 h-5 mr-2 text-emerald-500" /> Type: House
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <Move className="w-5 h-5 mr-2 text-emerald-500" /> Area: 10 Marla
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <ListChecks className="w-5 h-5 mr-2 text-emerald-500" /> Purpose: For Sale
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <BedDouble className="w-5 h-5 mr-2 text-emerald-500" /> Bedrooms: 6
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <Bath className="w-5 h-5 mr-2 text-emerald-500" /> Bathrooms: 6
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <User2 className="w-5 h-5 mr-2 text-emerald-500" /> Added: 1 week ago
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center"><ParkingSquare className="w-4 h-4 mr-2 text-emerald-500" /> Parking Spaces: 2</div>
              <div className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2 text-emerald-500" /> Double Glazed Windows</div>
              <div className="flex items-center"><Thermometer className="w-4 h-4 mr-2 text-emerald-500" /> Central Air Conditioning</div>
              <div className="flex items-center"><Thermometer className="w-4 h-4 mr-2 text-emerald-500" /> Central Heating</div>
              <div className="flex items-center"><Plug className="w-4 h-4 mr-2 text-emerald-500" /> Electricity Backup</div>
              <div className="flex items-center"><Waves className="w-4 h-4 mr-2 text-emerald-500" /> Waste Disposal</div>
              <div className="flex items-center"><Ruler className="w-4 h-4 mr-2 text-emerald-500" /> Flooring: Tiles</div>
              <div className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2 text-emerald-500" /> Dining Room</div>
              <div className="flex items-center"><User2 className="w-4 h-4 mr-2 text-emerald-500" /> Servant Quarters: 1</div>
              <div className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2 text-emerald-500" /> Kitchens: 2</div>
              <div className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2 text-emerald-500" /> Study Room</div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Location</h3>
            <iframe
              title="Property Location"
              src={`https://maps.google.com/maps?q=Karachi&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-80 rounded-lg border"
              loading="lazy"
            ></iframe>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Similar Properties</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-xl transition duration-300 ease-in-out"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="h-40 bg-gray-200 rounded mb-2 overflow-hidden">
                    <img
                      src={property.image}
                      alt="similar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-gray-600 font-semibold">Modern Family Home</p>
                  <p className="text-sm text-gray-500">DHA Phase 6, Karachi</p>
                  <p className="text-emerald-600 font-bold">PKR 3.2 Crore</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => navigate(-1)}
            className="mt-10 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Listings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyDetails;
