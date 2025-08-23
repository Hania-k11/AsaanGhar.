/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react"
import LoginModal from "./LoginModal"
import { Home } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { motion } from "framer-motion"
import AddressAutocomplete from './AddressAutocomplete'
import MapPicker from './MapPicker'
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'



const SellPage = () => {
  const { isLoggedIn, showLoginModal, setShowLoginModal } = useAuth();
  const [userProperties, setUserProperties] = useState([]);
  const [lastToastTime, setLastToastTime] = useState(0);


  const onLoginClick = () => {
    const now = Date.now();
   
    if (now - lastToastTime > 3000) {
      toast.info('Please log in or sign up to post your property.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setLastToastTime(now);
    }
    setShowLoginModal(true);
  }

  const onLoginSuccess = () => {
    setShowLoginModal(false)
  }

  useEffect(() => {
    if (isLoggedIn) {
      setShowLoginModal(false);
    }
  }, [isLoggedIn, setShowLoginModal]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-x-hidden">
      <ToastContainer />
      <div className="pt-24 pb-16 px-2 sm:px-4 container mx-auto max-w-6xl">
        {/* Header Section */}
         <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
          */}
             <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center pt-8 md:pt-20 justify-center mb-6 md:-mt-20"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <Home className=" h-17 w-18 m:h-20 m:w-22 text-emerald-600" />
          </motion.div>
        </motion.div>
          <h1 className="text-5xl font-bold text-cyan-950 mb-4">
            List Your <span className="text-emerald-600">Property</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create a professional property listing in minutes. Reach thousands of potential buyers and tenants.
          </p>
        </div>

        <RentForm 
          userProperties={userProperties}
          setUserProperties={setUserProperties}
          onLoginClick={onLoginClick}
          onLoginSuccess={onLoginSuccess}
          isLoggedIn={isLoggedIn}
        />
        <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  )
}

const RentForm = ({ setUserProperties, isLoggedIn, onLoginClick }) => {
  const { userDetails } = useAuth();
  const [formData, setFormData] = useState({
    owner_id: '' , // from auth
    title: '',
    address: '',
    street_address: '',
    description: '',
     ownerName: "",
    ownerEmail: "",
    phoneNumber: "",
    whatsappNumber: "",
    contactPreferences: {
      email: false,
      phone: false,
      whatsapp: false,
    },
    furnishing: "",
    floor: "",
    leaseDuration: "",
    availableFrom: "",
    maintenance: "",
    deposit: "",
    images: [],
    yearBuilt: "",
   amenities: {
    Parking: false,
    Balcony: false,
    PetFriendly: false,
    LaundryInUnit: false,
    Dishwasher: false,
    AirConditioning: false,
    Heating: false,
    SwimmingPool: false,
    Gym: false,
    Security: false,
    GatedCommunity: false,
    publicTransportAccess: false,
  },
    nearby_places: "",
    nearbySchools: "",
    nearbyHospitals: "",
    nearbyShopping: "",
    publicTransportAccess: false,
    listing_type_id: '',
    price: '',
    city: 'Karachi',
    location_id: '',
    listingType: 'rent', // Default to rent
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    furnishing_status_id: '',
    lease_duration: '',
    available_from: '',
    maintenance_fee: '',
    year_built: '',
    status: 'active',
    // is_featured: false,
    created_by: '',
    latitude: null,
    longitude: null,
    display_name: ''
  });
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { id: 1, title: "Basic Details", icon: "🏠" },
    { id: 2, title: "Property Features", icon: "✨" },
    { id: 3, title: "Amenities", icon: "🏊‍♂️" },
    { id: 4, title: "Contact & Images", icon: "📸" },
  ]

  const refs = {
    title: useRef(),
    address: useRef(),
    street_address: useRef(),
    location: useRef(),
    rent: useRef(),
    propertyType: useRef(),
    area: useRef(),
    description: useRef(),
    furnishing: useRef(),
    ownerName: useRef(),
    ownerEmail: useRef(),
    phoneNumber: useRef(),
    whatsappNumber: useRef(),
    images: useRef(),
    contactPreferences: useRef(),
  }

 
  const scrollToFirstError = (errorObj) => {
    const errorOrder = [
      "title","address","street_address", "location", "rent", "propertyType", "area",
      "description", "furnishing",
      "ownerName", "ownerEmail", "phoneNumber", "whatsappNumber",
      "images", "contactPreferences"
    ];
    for (const key of errorOrder) {
      if (errorObj[key] && refs[key] && refs[key].current) {
        refs[key].current.scrollIntoView({ behavior: "smooth", block: "center" });
        if (refs[key].current.focus) refs[key].current.focus();
        break;
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (!isLoggedIn) {
      onLoginClick("input")
      return
    }

    if (name === "images") {
      const fileArray = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray].slice(0, 5), // Max 5 images
      }))
    } else if (name.startsWith("contactPreferences.")) {
      const preference = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        contactPreferences: {
          ...prev.contactPreferences,
          [preference]: checked,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateStep = (step) => {
      console.log(`validateStep called for step ${step}, 
  
    isSubmitting: ${ isSubmitting}` );
  console.trace(); // Keep for debugging
    const newErrors = {}

    if (step === 1) {
  if (!formData.title) newErrors.title = "Property title is required";

  if (!formData.latitude || !formData.longitude) {
    newErrors.address = "Please make sure you pin the right location on the map.";
  }

  if (!formData.location) newErrors.location = "Location is required";

  if (!formData.rent) newErrors.rent = "Price is required";

  if (!formData.propertyType) newErrors.propertyType = "Property type is required";

  if (!formData.area) newErrors.area = "Area is required";

    if (!formData.street_address) newErrors.street_address = "Street address is required";
    

  // Additional address (plot/flat) validation:
  // const prefix = "Plot/Flat No: ";
  // const additional = formData.additionalAddress || "";
  // Check if additionalAddress is empty or just equal to prefix + address (auto-filled)
  // if (
  //   additional.trim() === "" || // empty
  //   additional === prefix + (formData.address || "")
  // ) {
  //   newErrors.additionalAddress = "Please enter your plot or flat details.";
  // }

  // Optional: Check if the map address contains the selected location from dropdown
  // if (formData.location && formData.address) {
  //   const selectedLocationLower = formData.location.toLowerCase();
  //   const addressLower = formData.address.toLowerCase();

  //   if (!addressLower.includes(selectedLocationLower)) {
  //     newErrors.address = `Selected address does not match the chosen location area (${formData.location}).`;
  //   }
  // }
}

    if (step === 2) {
      if (!formData.description) newErrors.description = "Description is required"
      if (!formData.furnishing) newErrors.furnishing = "Furnishing status is required"
    }

    if (step === 4) {
      if (!formData.ownerName) newErrors.ownerName = "Owner name is required"
      if (!formData.ownerEmail) newErrors.ownerEmail = "Email is required"
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
      if (formData.images.length === 0) newErrors.images = "At least one image is required"

      // Check if at least one contact preference is selected
      const hasContactPreference = Object.values(formData.contactPreferences).some((pref) => pref)
      if (!hasContactPreference) {
        newErrors.contactPreferences = "Please select at least one contact method"
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (formData.ownerEmail && !emailRegex.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Please enter a valid email address"
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
      if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number"
      }

      // Validate WhatsApp number if provided
      if (formData.whatsappNumber && !phoneRegex.test(formData.whatsappNumber)) {
        newErrors.whatsappNumber = "Please enter a valid WhatsApp number"
      }
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors)
    }
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onLoginClick("submit");
      return;
    }

    if (!validateStep(4)) return;

    setIsSubmitting(true);


    //commENT hania
   try {
    // We are not uploading images for now, so we'll just set imageUrls to an empty array.
    // const imageUrls = [];

    // The code for uploading images is commented out for now.
    // const formDataForUpload = new FormData();
    // formData.images.forEach((image) => {
    //   formDataForUpload.append('images', image);
    // });
    // const imageUploadResponse = await axios.post('/api/upload/images', formDataForUpload);
    // const imageUrls = imageUploadResponse.data.urls;

    //---------------------------------

      // First upload images (commit hania)
      // const imageUploadResponse = await axios.post('/api/upload/images', formDataForUpload);
      // const imageUrls = imageUploadResponse.data.urls;



const amenitiesList = Object.keys(formData.amenities || {})
  .filter((key) => formData.amenities[key]) // only true ones
  .map((key) =>
    key
    
      
  )
  .join(","); 


  console.log("Amenities List:", amenitiesList);

      // Then create property listing
      const response = await axios.post('/api/property/insert', {
        owner_id: userDetails.user_id,
        title: formData.title,
        description: formData.description,
        listing_type_name: formData.listingType,
        price: formData.rent,
        address: formData.address,
        street_address: formData.street_address,
        location_area: formData.location,
        location_city: 'Karachi',
        property_type_name: formData.propertyType,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        area_sqft: formData.area,
        furnishing_status_name: formData.furnishing,
        floor: formData.floor || null,
        lease_duration: formData.leaseDuration || null,
        available_from: formData.availableFrom || null,
        maintenance_fee: formData.maintenance || null,
        deposit: formData.deposit || null,
        year_built: formData.yearBuilt || null,
        nearby_places: formData.nearby_places || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact_name: formData.ownerName,
        contact_email: formData.ownerEmail,
        contact_phone: formData.phoneNumber,
        contact_whatsapp: formData.whatsappNumber,
         pref_email: formData.contactPreferences.email ? 1 : 0,
        pref_phone: formData.contactPreferences.phone ? 1 : 0,
        pref_whatsapp: formData.contactPreferences.whatsapp ? 1 : 0,
        amenities: amenitiesList,
        
      
        
      });
        //  status: 'active',
//  is_featured: false,
//         created_by: userDetails.user_id,

//         images: imageUrls
console.log(amenitiesList)
      if (response.status === 201 || response.status === 200) {
        toast.success('Property listing created successfully!', {
          position: 'top-right',
          autoClose: 5000
        });
        
        // Update user properties list
        setUserProperties(prev => [...prev, response.data]);
        
        // Reset form and go back to step 1
        setFormData({
          title: "",
          address: "",
          location: "",
          rent: "",
          propertyType: "",
          bedrooms: "",
          bathrooms: "",
          area: "",
          description: "",
          ownerName: "",
          ownerEmail: "",
          phoneNumber: "",
          whatsappNumber: "",
          contactPreferences: {
            email: false,
            phone: false,
            whatsapp: false,
          },
          furnishing: "",
          floor: "",
          leaseDuration: "",
          availableFrom: "",
          maintenance: "",
          deposit: "",
          images: [],
          yearBuilt: "",
         amenities: {
    Parking: false,
    Balcony: false,
    PetFriendly: false,
    LaundryInUnit: false,
    Dishwasher: false,
    AirConditioning: false,
    Heating: false,
    SwimmingPool: false,
    Gym: false,
    Security: false,
    GatedCommunity: false,
    publicTransportAccess: false,
  },
          nearby_places: "",
          nearbySchools: "",
          nearbyHospitals: "",
          nearbyShopping: "",
          publicTransportAccess: false,
          listingType: "rent",
          latitude: null,
          longitude: null
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error creating property listing:', error);
  // Log the detailed error from the server response
  console.error('Server error details:', error.response?.data);



      toast.error(error.response?.data?.message || 'Error creating property listing. Please try again.', {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const amenityIcons = {
    Parking: "🚗",
    Balcony: "🌿",
    PetFriendly: "🐕",
    LaundryInUnit: "🧺",
    Dishwasher: "🍽️",
    AirConditioning: "❄️",
    Heating: "🔥",
    SwimmingPool: "🏊‍♂️",
    Gym: "💪",
    Security: "🔒",
    GatedCommunity: "🏘️",
    publicTransportAccess: "🚌",
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-200 -mx-2 px-2">
          <div className="flex items-center justify-between mb-8 min-w-[340px] sm:min-w-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0 min-w-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-base sm:text-lg font-bold transition-all duration-300 ${
                    currentStep >= step.id ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.icon}
                </div>
                <div className="ml-2 sm:ml-3 hidden sm:block min-w-0">
                  <p className={`text-xs sm:text-sm font-medium ${currentStep >= step.id ? "text-emerald-600" : "text-gray-500"}`}>
                    Step {step.id}
                  </p>
                  <p className={`text-[10px] sm:text-xs truncate ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"}`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
 <form
  onSubmit={handleSubmit}
  className="bg-white rounded-3xl shadow-2xl overflow-hidden 
             md:ring-emerald-400 md:ring-1 ring-offset-0 focus-within:ring-emerald-400/70 transition-all duration-300"
>




        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="p-8 sm:p-12">
            
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Basic Property Details</h2>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
                  <input
                    ref={refs.title}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Spacious 3-Bedroom Apartment in DHA"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                      errors.title ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
{/* Location Search with Map */}
<div className="lg:col-span-2">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Enter Address to Select from Map*
  </label>
  <div className="space-y-4">
    <AddressAutocomplete
      value={formData.address}
      onSelect={(loc) => {
        if (!loc) {
          setFormData((prev) => ({
            ...prev,
            address: "",
            latitude: null,
            longitude: null,
            
          }));
          return;
        }
        setFormData((prev) => ({
          ...prev,
          address: loc.displayName,
          latitude: loc.lat,
          longitude: loc.lon,
         
         
        }));
      }}
    />

    <p className="text-sm text-gray-500">
      If you can't find your exact location in the suggestions, drag the marker on the map to place it manually.
    </p>

    <MapPicker
      lat={formData.latitude}
      lon={formData.longitude}
      onPositionChange={({ lat, lng, address }) => {
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          ...(address !== undefined && { address }),
          display_name: address || prev.display_name,
        
         
        }));
      }}
    />

    {errors.address && (
      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
    )}
  </div>
</div>

{/* Additional Address Details */}
<div className="lg:col-span-2">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Add Your Street Address*
  </label>

  <textarea
    ref={refs.street_address}
    name="street_address"
    value={formData.street_address}
    
    onChange={(e) => {
      // On user input, update with prefix + value
      const inputVal = e.target.value;
      setFormData((prev) => ({
        ...prev,
        street_address: inputVal,
      }));
      handleChange(e); // Call your existing handleChange if needed
    }}
    placeholder="Add any additional details like plot number, flat number, nearest landmark, or specific directions"
    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
      errors.street_address
        ? "border-red-300 bg-red-50"
        : "border-gray-200 focus:border-emerald-500"
    }`}
    rows={2}
  />
  {errors.street_address && (
    <p className="text-red-500 text-sm mt-1">{errors.street_address}</p>
  )}

  <p className="text-sm text-gray-500 mt-1">
    You can add specific details, plot number, block number, sector number.
  </p>
</div>



                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type *</label>
                  <div className="relative">
                    <select
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                    >
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <div className="relative">
                    <select
                      ref={refs.location}
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl appearance-none bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                        errors.location ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    >
                      <option value="">Select Location</option>
                      <optgroup label="We only deal in following areas of Karachi">
                        <option value="DHA">DHA, Karachi</option>
                        <option value="Gulshan-e-Iqbal">Gulshan-e-Iqbal, Karachi</option>
                        
                        <option value="PECHS">PECHS, Karachi</option>
                        <option value="Scheme 33">Scheme 33, Karachi</option>
                        <option value="Gulistan-e-Johar">Gulistan-e-Johar, Karachi</option>
                      </optgroup>
                      
                     
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.listingType === "rent" ? "Monthly Rent" : "Sale Price"} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                      PKR
                    </span>
                    <input
                      ref={refs.rent}
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      placeholder={formData.listingType === "rent" ? "50,000" : "5,000,000"}
                      min="0"
                      className={`w-full pl-16 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                        errors.rent ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                  <div className="relative">
                    <select
                      ref={refs.propertyType}
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl appearance-none bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                        errors.propertyType ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    >
                      <option value="">Select Property Type</option>
                      <option value="HOUSE">House</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="ROOM">Room</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="OFFICE">Office Space</option>
                      <option value="SHOP">Shop</option>
                      <option value="WAREHOUSE">Warehouse</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="3"
                      min="0"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="2"
                      min="0"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year Built</label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      placeholder="2020"
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
                  <input
                    ref={refs.area}
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area in sqft, e.g., 1200"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                      errors.area ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>
              </div>
            </div>


           

          </div>
        )}

        {/* Step 2: Property Features */}
        {currentStep === 2 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Property Features</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Description *</label>
                <textarea
                  ref={refs.description}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property in detail. Include unique features, neighborhood highlights, and any special amenities..."
                  rows="6"
                  className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 resize-none ${
                    errors.description ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Furnishing Status *</label>
                  <div className="relative">
                    <select
                      ref={refs.furnishing}
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl appearance-none bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                        errors.furnishing ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    >
                      <option value="">Select Furnishing Status</option>
                      <option value="fully-furnished">Furnished</option>
                      <option value="semi-furnished">Semi-furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.furnishing && <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Level</label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g., Ground Floor, 2nd Floor, Penthouse"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>
<div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Available From</label>
                      <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>

                      <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Maintenance</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                          PKR
                        </span>
                        <input
                          type="number"
                          name="maintenance"
                          value={formData.maintenance}
                          onChange={handleChange}
                          placeholder="5,000"
                          min="0"
                          className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                {formData.listingType === "rent" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Lease Duration</label>
                      <input
                        type="text"
                        name="leaseDuration"
                        value={formData.leaseDuration}
                        onChange={handleChange}
                        placeholder="e.g., 12 Months"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>

                    

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                          PKR
                        </span>
                        <input
                          type="number"
                          name="deposit"
                          value={formData.deposit}
                          onChange={handleChange}
                          placeholder="100,000"
                          min="0"
                          className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Maintenance</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                          PKR
                        </span>
                        <input
                          type="number"
                          name="maintenance"
                          value={formData.maintenance}
                          onChange={handleChange}
                          placeholder="5,000"
                          min="0"
                          className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div> */}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Amenities */}
        {currentStep === 3 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Amenities & Features</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
             {Object.keys(formData.amenities).map((key) => (
                  <label
                    key={key}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.amenities[key]
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                   <input
        type="checkbox"
        name={key}
        checked={formData.amenities[key]}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            amenities: {
              ...prev.amenities,
              [key]: e.target.checked,
            },
          }))
        }
        className="sr-only"
      />
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                        formData.amenities[key] ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {formData.amenities[key] ? "✓" : amenityIcons[key] || "•"}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        formData.amenities[key] ? "text-emerald-700" : "text-gray-700"
                      }`}
                    >
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </label>
                ))}
            </div>

            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Nearby Facilities</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nearby Places</label>
                  <input
                    type="text"
                    name="nearby_places"
                    value={formData.nearby_places}
                    onChange={handleChange}
                    placeholder="e.g.. Beaconhouse School, Aladin Park, Fitness Gym etc"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                  />
                   <p className="text-sm mt-3 text-gray-500 mt-2">Please add each place separated by a comma.</p>
                </div>
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nearby Hospitals</label>
                  <input
                    type="text"
                    name="nearbyHospitals"
                    value={formData.nearbyHospitals}
                    onChange={handleChange}
                    placeholder="e.g., Aga Khan Hospital"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shopping Centers</label>
                  <input
                    type="text"
                    name="nearbyShopping"
                    value={formData.nearbyShopping}
                    onChange={handleChange}
                    placeholder="e.g., Dolmen Mall, Lucky One"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                  />
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Images */}
        {currentStep === 4 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Contact Information & Images</h2>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
<div>
  <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Owner/Agent Name */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Owner/Agent Name *
      </label>
      <input
        ref={refs.ownerName}
        type="text"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        placeholder="Your full name"
        className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
          errors.ownerName
            ? "border-red-300 bg-red-50"
            : "border-gray-200 focus:border-emerald-500"
        }`}
      />
      {errors.ownerName && (
        <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
      )}
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Email Address *
      </label>
      <input
        ref={refs.ownerEmail}
        type="email"
        name="ownerEmail"
        value={formData.ownerEmail}
        onChange={handleChange}
        placeholder="your.email@gmail.com"
        className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
          errors.ownerEmail
            ? "border-red-300 bg-red-50"
            : "border-gray-200 focus:border-emerald-500"
        }`}
      />
      {errors.ownerEmail && (
        <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
      )}
    </div>

    
      {/* Phone Number */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Phone Number *
  </label>
  <div className="flex items-center">
    <span className="px-3 py-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-700 font-medium">
      +92
    </span>
    <input
      ref={refs.phoneNumber}
      type="tel"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.startsWith("0")) value = value.slice(1);
        if (value.length > 10) value = value.slice(0, 10);
        setFormData({ ...formData, phoneNumber: value });
      }}
      placeholder="3001234567"
      className={`w-full px-4 py-4 border-2 rounded-r-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
        errors.phoneNumber
          ? "border-red-300 bg-red-50"
          : "border-gray-200 focus:border-emerald-500"
      }`}
    />
  </div>

  {/* Single Validation at a time */}
  {formData.phoneNumber && formData.phoneNumber[0] !== "3" ? (
    <p className="text-red-500 text-sm mt-1">
      Number must start with 3 (e.g., 3001234567)
    </p>
  ) : formData.phoneNumber &&
    formData.phoneNumber.length !== 10 ? (
    <p className="text-red-500 text-sm mt-1">
      Number must be exactly 10 digits
    </p>
  ) : null}

  {errors.phoneNumber && (
    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
  )}
</div>

{/* WhatsApp Number */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    WhatsApp Number
  </label>
  <div className="flex items-center">
    <span className="px-3 py-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-700 font-medium">
      +92
    </span>
    <input
      ref={refs.whatsappNumber}
      type="tel"
      name="whatsappNumber"
      value={formData.whatsappNumber}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.startsWith("0")) value = value.slice(1);
        if (value.length > 10) value = value.slice(0, 10);
        setFormData({ ...formData, whatsappNumber: value });
      }}
      placeholder="3001234567"
      className={`w-full px-4 py-4 border-2 rounded-r-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
        errors.whatsappNumber
          ? "border-red-300 bg-red-50"
          : "border-gray-200 focus:border-emerald-500"
      }`}
    />
  </div>

  {/* Single Validation at a time */}
  {formData.whatsappNumber && formData.whatsappNumber[0] !== "3" ? (
    <p className="text-red-500 text-sm mt-1">
      Number must start with 3 (e.g., 3001234567)
    </p>
  ) : formData.whatsappNumber &&
    formData.whatsappNumber.length !== 10 ? (
    <p className="text-red-500 text-sm mt-1">
      Number must be exactly 10 digits
    </p>
  ) : null}

  {errors.whatsappNumber && (
    <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>
  )}
</div>

  </div>
</div>


              {/* Contact Preferences */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How do you want buyers to contact you? *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label
                    ref={refs.contactPreferences}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.contactPreferences.email
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="contactPreferences.email"
                      checked={formData.contactPreferences.email}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200 ${
                        formData.contactPreferences.email ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {formData.contactPreferences.email ? "✓" : "📧"}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          formData.contactPreferences.email ? "text-emerald-700" : "text-gray-700"
                        }`}
                      >
                        Email
                      </span>
                      <p className="text-xs text-gray-500">Receive inquiries via email</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.contactPreferences.phone
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="contactPreferences.phone"
                      checked={formData.contactPreferences.phone}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200 ${
                        formData.contactPreferences.phone ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {formData.contactPreferences.phone ? "✓" : "📞"}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          formData.contactPreferences.phone ? "text-emerald-700" : "text-gray-700"
                        }`}
                      >
                        Phone Call
                      </span>
                      <p className="text-xs text-gray-500">Allow direct phone calls</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.contactPreferences.whatsapp
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="contactPreferences.whatsapp"
                      checked={formData.contactPreferences.whatsapp}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200 ${
                        formData.contactPreferences.whatsapp ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {formData.contactPreferences.whatsapp ? "✓" : "💬"}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          formData.contactPreferences.whatsapp ? "text-emerald-700" : "text-gray-700"
                        }`}
                      >
                        WhatsApp
                      </span>
                      <p className="text-xs text-gray-500">Chat via WhatsApp</p>
                    </div>
                  </label>
                </div>
                {errors.contactPreferences && <p className="text-red-500 text-sm mt-2">{errors.contactPreferences}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Property Images * (Max 5 images)
                </label>
                <div
                  ref={refs.images}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.images
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-8 h-8 text-emerald-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">Upload Property Images</p>
                      <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Selected Images ({formData.images.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="px-8 sm:px-12 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-3 md:px-6 md:py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentStep >= step.id ? "bg-emerald-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className=" px-3 py-3 md:px-6 md:py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
               onClick={handleSubmit}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Listing"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SellPage