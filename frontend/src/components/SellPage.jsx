/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react";
import LoginModal from "./LoginModal";
import { Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";
import AddressAutocomplete from "./AddressAutocomplete";
import MapPicker from "./MapPicker";
import "leaflet/dist/leaflet.css";

const SellPage = () => {
  const { isLoggedIn, showLoginModal, setShowLoginModal, user } = useAuth();

  const [userProperties, setUserProperties] = useState([]);
  const [lastToastTime, setLastToastTime] = useState(0);
console.log("user from sell page:", user)
  const onLoginClick = () => {
    const now = Date.now();
    if (now - lastToastTime > 3000) {
      toast.info("Please log in or sign up to post your property.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLastToastTime(now);
    }
    setShowLoginModal(true);
  };

  const onLoginSuccess = () => {
    setShowLoginModal(false);
  };

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
  );
};

const RentForm = ({ setUserProperties, isLoggedIn, onLoginClick }) => {
 const {  user } = useAuth();
 console.log("user in renteeeeeee form:", user)

  const initialFormData = {
    owner_id: "",
    title: "",
    address: "",
    street_address: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    phoneNumber: "",
    contactPreferences: {
      email: false,
      phone: false,
    },
    furnishing: "",
    floor: "",
    leaseDuration: "",
    availableFrom: "",
    maintenance: "",
    deposit: "",
    images: [], // kept for UI previews only
    documents: [], // kept for UI previews only
    propertyPapers: [], // kept for UI previews only
    utilityBill: [], // kept for UI previews only
    otherDocs: [], // kept for UI previews only
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
    listing_type_id: "",
    price: "",
    city: "Karachi",
    location_id: "",
    listingType: "rent",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    furnishing_status_id: "",
    lease_duration: "",
    available_from: "",
    maintenance_fee: "",
    year_built: "",
    status: "active",
    created_by: "",
    latitude: null,
    longitude: null,
    display_name: "",
  };

  const [formData, setFormData] = useState(() => {
    if (user?.user_id) {
      const savedData = localStorage.getItem(`rentFormData_${user.user_id}`);
      return savedData ? JSON.parse(savedData) : initialFormData;
    }
    return initialFormData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    if (user?.user_id) {
      const savedStep = localStorage.getItem(`rentFormStep_${user.user_id}`);
      return savedStep ? Number(savedStep) : 1;
    }
    return 1;
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate email, phone, and name from user data
  // This runs whenever user changes to handle async loading
  useEffect(() => {
    if (user) {
      setFormData((prev) => {
        const updates = { ...prev };
        
        // Always update from user data if available (handles async loading)
        if (user.email) {
          updates.ownerEmail = user.email;
        }
        
        if (user.phone_number) {
          updates.phoneNumber = user.phone_number;
        }
        
        // Auto-populate owner name from first_name and last_name
        if (user.first_name || user.last_name) {
          const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
          if (fullName) {
            updates.ownerName = fullName;
          }
        }
        
        return updates;
      });
    }
  }, [user]);

  // Persist form data and current step per-user
  useEffect(() => {
    if (!user?.user_id) return;
    localStorage.setItem(`rentFormData_${user.user_id}`, JSON.stringify(formData));
    localStorage.setItem(`rentFormStep_${user.user_id}`, currentStep.toString());
  }, [formData, currentStep, user]);

  const steps = [
    { id: 1, title: "Basic Details", icon: "🏠" },
    { id: 2, title: "Property Features", icon: "✨" },
    { id: 3, title: "Amenities", icon: "🏊‍♂️" },
    { id: 4, title: "Contact & Images", icon: "📸" },
    { id: 5, title: "Document Verification", icon: "📄" },
  ];

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
    images: useRef(),
    documents: useRef(),
    contactPreferences: useRef(),
    // Step 5 refs
    cnicVerification: useRef(),
    propertyPapers: useRef(),
    utilityBill: useRef(),
  };

  const scrollToFirstError = (errorObj) => {
    const errorOrder = [
      "title",
      "address",
      "street_address",
      "location",
      "rent",
      "propertyType",
      "area",
      "yearBuilt",
      "description",
      "furnishing",
      "ownerName",
      "ownerEmail",
      "phoneNumber",
      "images",
      "documents",
      "contactPreferences",
      // Step 5 error keys
      "cnicVerification",
      "propertyPapers",
      "utilityBill",
    ];
    for (const key of errorOrder) {
      if (errorObj[key] && refs[key] && refs[key].current) {
        refs[key].current.scrollIntoView({ behavior: "smooth", block: "center" });
        if (refs[key].current.focus) refs[key].current.focus();
        break;
      }
    }
  };

  // Handler to prevent non-numeric characters in number inputs
  const handleNumericKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (allowedKeys.includes(e.key)) {
      return;
    }
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    // Block non-numeric characters (e, E, +, -, ., comma)
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
      return;
    }
    // Allow only numbers 0-9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Allowed types for UI filtering
  const ALLOW_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png"];
  const ALLOW_IMG_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 10MB

// Helper function to validate file size
const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit`, {
      position: "top-right",
      autoClose: 3000,
    });
    return false;
  }
  return true;
};

const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (!isLoggedIn) {
      onLoginClick("input");
      return;
    }

    // FILE INPUTS (for UI only)
    if (type === "file") {
      const toArray = (fl) => Array.from(fl || []);

      if (name === "images") {
        const validTypeFiles = toArray(files).filter((f) => ALLOW_IMG_TYPES.includes(f.type));
        const validSizeFiles = validTypeFiles.filter(validateFileSize);
        
        const currentCount = (formData.images || []).length;
        const remainingSlots = 5 - currentCount;
        
        if (validSizeFiles.length > remainingSlots) {
          toast.warning(`Only ${remainingSlots} more image(s) can be added (max 5 total)`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...validSizeFiles].slice(0, 5),
        }));
      } else if (name === "documents") {
        const validTypeFiles = toArray(files).filter((f) => ALLOW_DOC_TYPES.includes(f.type));
        const validSizeFiles = validTypeFiles.filter(validateFileSize);
        
        setFormData((prev) => ({
          ...prev,
          documents: [...(prev.documents || []), ...validSizeFiles].slice(0, 10),
        }));
        setFormData((prev) => ({
          ...prev,
          otherDocs: [...(prev.otherDocs || []), ...validSizeFiles].slice(0, 10),
        }));
      } else if (name === "propertyPapers" || name === "utilityBill") {
        const validTypeFiles = toArray(files).filter((f) => ALLOW_DOC_TYPES.includes(f.type));
        const validSizeFiles = validTypeFiles.filter(validateFileSize);
        
        setFormData((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), ...validSizeFiles].slice(0, 10),
        }));
      }

      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // NON-FILE INPUTS
    if (name.startsWith("contactPreferences.")) {
      const preference = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactPreferences: { ...prev.contactPreferences, [preference]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Helper functions defined OUTSIDE handleChange
  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Small helpers for Step-5 previews/removals
  const isImg = (file) => file && file.type && file.type.startsWith("image/");
  const fileURL = (file) => (file instanceof File ? URL.createObjectURL(file) : null);
  const clearSingleFile = (field) => {
    // For array fields, clear the array; for single file fields, set to null
    if (field === "propertyPapers" || field === "utilityBill") {
      setFormData((prev) => ({ ...prev, [field]: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: null }));
    }
  };
  const removeOtherDoc = (index) =>
    setFormData((prev) => ({
      ...prev,
      otherDocs: (prev.otherDocs || []).filter((_, i) => i !== index),
    }));
  const removePropertyPaper = (index) =>
    setFormData((prev) => ({
      ...prev,
      propertyPapers: (prev.propertyPapers || []).filter((_, i) => i !== index),
    }));
  const removeUtilityBill = (index) =>
    setFormData((prev) => ({
      ...prev,
      utilityBill: (prev.utilityBill || []).filter((_, i) => i !== index),
    }));

  const validateStep = (step) => {
    const newErrors = {};

    // Helper function for checking numbers
    const validateNumber = (value, fieldName, min, max, allowZero = true) => {
      const num = Number(value);
      if (value === undefined || value === null || value === "") return; // Allow empty/optional fields

      if (isNaN(num) || (!allowZero && num <= 0) || (allowZero && num < 0)) {
        newErrors[fieldName] = `${fieldName} must be a valid number.`;
      } else if (num < min) {
        newErrors[fieldName] = `${fieldName} must be at least ${min}.`;
      } else if (num > max) {
        newErrors[fieldName] = `${fieldName} must be no more than ${max}.`;
      }
    };

    if (step === 1) {
      //  Title
      if (!formData.title) {
        newErrors.title = "Property title is required";
      } else if (formData.title.length < 15) {
        newErrors.title = "Title must be at least 15 characters long";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title must be 100 characters or less";
      }

      // Location 
      if (!formData.latitude || !formData.longitude) {
        newErrors.address = "Please pin the location on the map.";
      } else {
        const lat = Number(formData.latitude);
        const lon = Number(formData.longitude);
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          newErrors.address = "Invalid latitude or longitude coordinates.";
        }
      }

      if (!formData.location) newErrors.location = "Location is required";

      // 3. Price (Refined to include max check and format check)
      if (!formData.rent) {
        newErrors.rent = "Price is required";
      } else {
        const priceValue = Number(formData.rent);
        if (isNaN(priceValue) || priceValue <= 0) { // Enforce positive number
          newErrors.rent = "Price must be a valid number greater than 0.";
        } else if (priceValue < 1000) {
          newErrors.rent = "Price must be at least PKR 1,000";
        } else if (priceValue > 500000000) { // Added Max Price check (e.g., 500 Million PKR) (25 crore)
          newErrors.rent = "Price seems too high. Please check the value (Max PKR 500,000,000)";
        }
      }

      if (!formData.propertyType) newErrors.propertyType = "Property type is required";

      // Area 
      if (!formData.area) {
        newErrors.area = "Area is required";
      } else {
        const areaValue = Number(formData.area);
        if (isNaN(areaValue) || areaValue <= 0) { // Enforce positive number
          newErrors.area = "Area must be a valid number greater than 0.";
        } else if (areaValue <= 80) {
          newErrors.area = "Area must be at least 80 sqft";
        } else if (areaValue > 100000) {
          newErrors.area = "Area seems too large. Please enter a reasonable value (Max 100,000 sqft)";
        }
      }
      if (!formData.street_address) newErrors.street_address = "Street address is required";

      // Year Built validation (validate proper 4-digit year)
      if (formData.yearBuilt) {
        const currentYear = new Date().getFullYear();
        const yearStr = String(formData.yearBuilt).trim();
        const yearValue = Number(formData.yearBuilt);
        
        // Check if it's a valid 4-digit year
        if (!/^\d{4}$/.test(yearStr)) {
          newErrors.yearBuilt = `Please enter a valid 4-digit year (e.g., 2020).`;
        } else if (isNaN(yearValue) || yearValue < 1800 || yearValue > currentYear) {
          newErrors.yearBuilt = `Year built must be between 1800 and ${currentYear}.`;
        }
      }
    }

    if (step === 2) {
      console.log("Validating Step 2 with formData:", {
        description: formData.description,
        furnishing: formData.furnishing,
        maintenance: formData.maintenance,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        yearBuilt: formData.yearBuilt,
        availableFrom: formData.availableFrom
      });

      //  Description
      if (!formData.description) {
          newErrors.description = "Description is required";
          console.log("❌ Description is missing");
        } else if (formData.description.length > 2000) {
          newErrors.description = "Description cannot exceed 2000 characters.";
          console.log("❌ Description too long");
        }

      if (!formData.furnishing) {
        newErrors.furnishing = "Furnishing status is required";
        console.log("❌ Furnishing is missing");
      }

      //  Maintenance (Optional - but if entered, min 500)
      if (formData.maintenance) {
        const maintenanceValue = Number(formData.maintenance);
        if (isNaN(maintenanceValue) || maintenanceValue < 500) {
          newErrors.maintenance = "Monthly maintenance must be at least PKR 500.";
        } else if (maintenanceValue > 500000) {
          newErrors.maintenance = "Monthly maintenance seems too high (Max PKR 500,000).";
        }
      }

      // Bedrooms (numerical validation - must be positive)
      if (formData.bedrooms) {
        validateNumber(formData.bedrooms, 'bedrooms', 1, 50, false); // Min 1, Max 50, no zero allowed
      }

      //  Bathrooms (numerical validation - must be positive)
      if (formData.bathrooms) {
        validateNumber(formData.bathrooms, 'bathrooms', 1, 50, false); // Min 1, Max 50, no zero allowed
      }

      // Year Built validation is now in Step 1 since the field is in Step 1

      //  Available From (New date validation: must not be in the past)
      if (formData.availableFrom) {
        const availableDate = new Date(formData.availableFrom).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        if (availableDate < today) {
          newErrors.availableFrom = "Availability date cannot be in the past.";
          console.log("❌ Available from date is in the past");
        }
      }

      // Security Deposit validation (range 1000-100000 if entered)
      if (formData.deposit) {
        const depositValue = Number(formData.deposit);
        if (isNaN(depositValue) || depositValue < 1000) {
          newErrors.deposit = "Security deposit must be at least PKR 1,000.";
        } else if (depositValue > 100000) {
          newErrors.deposit = "Security deposit cannot exceed PKR 100,000.";
        }
      }

      console.log("Step 2 validation errors:", newErrors);
    }
    if (step === 4) {
      console.log("🔍 Validating Step 4 with data:", {
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        phoneNumber: formData.phoneNumber,
        images: formData.images?.length,
        contactPreferences: formData.contactPreferences,
        user_phone_verified: user?.phone_verified
      });

      // Owner Name validation
      if (!formData.ownerName || !formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
        console.log("❌ Owner name validation failed");
      } else {
        console.log("✅ Owner name validation passed");
      }
      
      // Email validation
      if (!formData.ownerEmail) {
        newErrors.ownerEmail = "Email is required";
        console.log("❌ Email validation failed: missing");
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.ownerEmail)) {
          newErrors.ownerEmail = "Enter a valid email";
          console.log("❌ Email validation failed: invalid format");
        } else {
          console.log("✅ Email validation passed");
        }
      }
      
      // Phone number validation
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required. Please add it in your profile.";
        console.log("❌ Phone validation failed: missing");
      } else {
        // Check if phone is verified
        console.log("📞 Checking phone verification. user.phone_verified:", user?.phone_verified);
        if (!user?.phone_verified || user.phone_verified !== 1) {
          newErrors.phoneNumber = "Phone number must be verified. Please go to your profile to verify.";
          console.log("❌ Phone validation failed: not verified");
        } else {
          console.log("✅ Phone validation passed");
        }
      }
      
      // Images validation
      if (!formData.images || formData.images.length === 0) {
        newErrors.images = "At least one image is required";
        console.log("❌ Images validation failed");
      } else {
        console.log("✅ Images validation passed:", formData.images.length, "images");
      }

      // Contact preferences validation
      const hasContactPreference = Object.values(formData.contactPreferences).some((pref) => pref);
      if (!hasContactPreference) {
        newErrors.contactPreferences = "Select at least one contact method";
        console.log("❌ Contact preferences validation failed");
      } else {
        console.log("✅ Contact preferences validation passed:", formData.contactPreferences);
      }

      console.log("📋 Step 4 validation errors:", newErrors);
    }
    if (step === 5) {
      console.log("🔍 Validating Step 5 - CNIC Status:", user?.cnic_verified);
      
      // Check CNIC verification status from user table
      if (user?.cnic_verified === 1) {
        // CNIC is verified - no need to upload CNIC images
        console.log("✅ CNIC already verified, skipping CNIC upload validation");
      } else if (user?.cnic_verified === 0 || !user?.cnic_verified) {
        // CNIC not verified - direct to profile
        newErrors.cnicVerification = "CNIC verification required. Please verify your CNIC in your profile.";
        console.log("❌ CNIC not verified");
      } else if (user?.cnic_verified === 3) {
        // CNIC rejected - direct to profile to update
        newErrors.cnicVerification = "Your CNIC was rejected. Please update your CNIC in your profile.";
        console.log("❌ CNIC rejected");
      }

      // Property Papers (required)
      if (
        (!formData.propertyPapers || formData.propertyPapers.length === 0) &&
        (!formData.propertyPapersUrl || formData.propertyPapersUrl.length === 0)
      ) {
        newErrors.propertyPapers = "Property papers are required";
      }

      // Utility Bill (required)
      if (
        (!formData.utilityBill || formData.utilityBill.length === 0) &&
        (!formData.utilityBillUrl || formData.utilityBillUrl.length === 0)
      ) {
        newErrors.utilityBill = "Latest utility bill is required";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Use setTimeout to let React update the DOM before scrolling
      setTimeout(() => scrollToFirstError(newErrors), 100);
    }
    return Object.keys(newErrors).length === 0;
  };


  const nextStep = () => {
    console.log("Attempting to move to next step from step:", currentStep);
    const isValid = validateStep(currentStep);
    console.log("Validation result:", isValid);
    if (!isValid) {
      console.log("Validation errors:", errors);
      toast.error("Please fill in all required fields correctly before proceeding.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));




  
const handleSubmit = async (e) => {
  console.log("🚀 Starting form submission...");
  console.log("Submitting form with data:", formData);
  e.preventDefault();
  
  if (!isLoggedIn) {
    console.log("❌ User not logged in");
    return onLoginClick("submit");
  }
  
  console.log("✅ User is logged in, validating step 5...");
  if (!validateStep(5)) {
    console.log("❌ Step 5 validation failed");
    return;
  }

  console.log("✅ Step 5 validation passed, starting submission...");
  setIsSubmitting(true);

  try {
    // 1️⃣ Build amenities CSV
    const amenitiesList = Object.keys(formData.amenities || {})
      .filter((key) => formData.amenities[key])
      .join(",");

    console.log("📋 Amenities list:", amenitiesList);

    // 2️⃣ Build payload for insert-all (JSON only)
    console.log("User ID for owner_id:", user?.user_id);
    const payload = {
      owner_id: user?.user_id,
      title: formData.title,
      description: formData.description,
      listing_type_name: formData.listingType,
      price: formData.rent,
      address: formData.address,
      street_address: formData.street_address,
      location_area: formData.location,
      location_city: "Karachi",
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
      pref_email: formData.contactPreferences.email ? 1 : 0,
      pref_phone: formData.contactPreferences.phone ? 1 : 0,
      amenities: amenitiesList,
      // No file URLs here; files will be uploaded in step 3
      images: [],
      propertyPapers: [],
      utilityBill: [],
      otherDocs: [],
    };

    console.log("📦 Payload being sent to /insert-all:", payload);

    // 3️⃣ Insert property + upload files together (multipart)
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => form.append(k, val));
      } else if (v !== undefined && v !== null) {
        form.append(k, v);
      }
    });

    // Add files
    console.log("📎 Adding files to FormData:");
    console.log("  - Images:", (formData.images || []).length);
    console.log("  - Property Papers:", (formData.propertyPapers || []).length);
    console.log("  - Utility Bills:", (formData.utilityBill || []).length);
    console.log("  - Other Docs:", (formData.otherDocs || []).length);
    console.log("  - CNIC: Verified through user profile (not uploaded here)");

    (formData.images || []).forEach((img) => form.append("images", img));
    // CNIC files are no longer uploaded here - CNIC verification is handled in user profile
    (formData.propertyPapers || []).forEach((doc) => form.append("propertyPapers", doc));
    (formData.utilityBill || []).forEach((doc) => form.append("utilityBill", doc));
    (formData.otherDocs || []).forEach((doc) => form.append("otherDocs", doc));

    console.log("🌐 Sending POST request to /api/property/insert-all...");
    const response = await axios.post("/api/property/insert-all", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Server response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("Property listing created successfully!", {
        position: "top-right",
        autoClose: 5000,
      });

      setUserProperties((prev) => [...prev, response.data]);

      // Reset form and clear local storage
      setFormData(initialFormData);
      setCurrentStep(1);
      if (user?.user_id) {
        localStorage.removeItem(`rentFormData_${user.user_id}`);
        localStorage.removeItem(`rentFormStep_${user.user_id}`);
      }
      
      console.log("✅ Form reset and localStorage cleared");
    }
  } catch (error) {
    console.error("❌ Error creating property listing:", error);
    console.error("❌ Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    
    let errorMessage = "Error creating property listing. Please try again.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
    });
  } finally {
    setIsSubmitting(false);
    console.log("🏁 Submission process completed");
  }
};


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
    PublicTransportAccess: "🚌",
  };

  return (
    <div className="max-w-4xl mx-auto">
     {/* Progress Steps */}
<div className="mb-12">
  {/* ✅ Mobile View (no scroll, even gap, connectors only between steps, now with spacing) */}
  <div className="block sm:hidden">
    <div className="relative px-3 mb-6">
      {/* evenly spaced 5 steps */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          const showConnectorLeft = index > 0;
          const showConnectorRight = index < steps.length - 1;

          return (
            <div key={`m-${step.id}`} className="relative flex flex-col items-center flex-1">
              {/* left connector */}
              {showConnectorLeft && (
                <div
                  className={`absolute left-[-70%] top-[20px] h-1 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                  style={{
                    width: "40%",
                    marginRight: "8px",                   }}
                />
              )}

              {/* right connector */}
              {showConnectorRight && (
                <div
                  className={`absolute right-[-20%] top-[17px] h-1 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                  style={{
                    width: "40%",
                    marginLeft: "8px", 
                  }}
                />
              )}

              {/* circle */}
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                  done || active
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {done ? "✓" : step.icon}
              </div>

              {/* label */}
              <div className="mt-2 text-center leading-tight">
                <p
                  className={`text-[11px] font-medium ${
                    done || active ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  Step {step.id}
                </p>
                <p
                  className={`text-[11px] font-semibold ${
                    done || active ? "text-gray-900" : "text-gray-400"
                  }`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    maxWidth: "90px",
                  }}
                >
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>

  {/*Desktop View — unchanged */}
  <div className="hidden sm:block">
    <div className="flex items-center justify-center mb-8 min-w-[340px] sm:min-w-0 space-x-4 sm:space-x-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-shrink-0 min-w-0">
          <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-base sm:text-lg font-bold transition-all duration-300 ${
              currentStep >= step.id
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > step.id ? "✓" : step.icon}
          </div>

          <div className="ml-2 sm:ml-3 hidden sm:block min-w-0">
            <p
              className={`text-xs sm:text-sm font-medium ${
                currentStep >= step.id ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              Step {step.id}
            </p>
            <p
              className={`text-[10px] sm:text-xs truncate ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                currentStep > step.id
                  ? "bg-emerald-600"
                  : "bg-gray-200"
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
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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

                {/* Address + Map */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Address to Select from Map*</label>
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

                    <p className="text-sm text-gray-500">If you can't find your exact location in the suggestions, drag the marker on the map to place it manually.</p>

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

                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                </div>

                {/* Street address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add Your Street Address*</label>
                  <textarea
                    ref={refs.street_address}
                    name="street_address"
                    value={formData.street_address}
                    onChange={(e) => {
                      const inputVal = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        street_address: inputVal,
                      }));
                      handleChange(e);
                    }}
                    placeholder="Add any additional details like plot number, flat number, nearest landmark, or specific directions"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                      errors.street_address ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                    }`}
                    rows={2}
                  />
                  {errors.street_address && <p className="text-red-500 text-sm mt-1">{errors.street_address}</p>}
                  <p className="text-sm text-gray-500 mt-1">You can add specific details, plot number, block number, sector number.</p>
                </div>

                {/* Listing type */}
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

                {/* Location area select */}
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

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.listingType === "rent" ? "Monthly Rent" : "Sale Price"} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">PKR</span>
                    <input
                      ref={refs.rent}
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      onKeyDown={handleNumericKeyDown}
                      placeholder={formData.listingType === "rent" ? "50,000" : "5,000,000"}
                      min="0"
                      className={`w-full pl-16 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                        errors.rent ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent}</p>}
                </div>

                {/* Property Type */}
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

                {/* Beds/Baths/Year */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      onKeyDown={handleNumericKeyDown}
                      placeholder="3"
                      min="1"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 ${
                        errors.bedrooms ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                    {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      onKeyDown={handleNumericKeyDown}
                      placeholder="2"
                      min="1"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 ${
                        errors.bathrooms ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                    {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year Built</label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      onKeyDown={handleNumericKeyDown}
                      placeholder="2020"
                      min="1800"
                      max={new Date().getFullYear()}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 ${
                        errors.yearBuilt ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                    {errors.yearBuilt && <p className="text-red-500 text-sm mt-1">{errors.yearBuilt}</p>}
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
                  <input
                    ref={refs.area}
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    onKeyDown={handleNumericKeyDown}
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

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
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
    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">PKR</span>
    <input
      type="number"
      name="maintenance"
      value={formData.maintenance}
      onChange={handleChange}
      onKeyDown={handleNumericKeyDown}
      placeholder="5,000"
      min="0"
      className={`w-full pl-16 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200
        ${errors.maintenance ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"}
      `}
    />
  </div>
  {errors.maintenance && (
    <p className="text-red-500 text-sm mt-1">{errors.maintenance}</p>
  )}
</div>

                {formData.listingType === "rent" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Lease Duration (Months)</label>
                      <input
                        type="number"
                        name="leaseDuration"
                        value={formData.leaseDuration}
                        onChange={handleChange}
                        onKeyDown={handleNumericKeyDown}
                        placeholder="e.g., 12"
                        min="1"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">PKR</span>
                        <input
                          type="number"
                          name="deposit"
                          value={formData.deposit}
                          onChange={handleChange}
                          onKeyDown={handleNumericKeyDown}
                          placeholder="100,000"
                          min="0"
                          className={`w-full pl-16 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 ${
                            errors.deposit ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-500"
                          }`}
                        />
                      </div>
                      {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Amenities & Features</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.keys(formData.amenities).map((key) => (
                <label
                  key={key}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.amenities[key] ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-200 hover:border-emerald-300"
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
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 017.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Contact Information & Images</h2>
            </div>

            <div className="space-y-8">
              {/* Contact Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Owner/Agent Name *
                      <span className="ml-2 text-xs text-gray-500 font-normal">(From your account)</span>
                    </label>
                    <input
                      ref={refs.ownerName}
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      readOnly
                      disabled
                      className={`w-full px-4 py-4 border-2 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed transition-all duration-200 ${
                        errors.ownerName ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      To change your name, please update it in{" "}
                      <a href="/my-profile" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                        My Profile
                      </a>
                    </p>
                    {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                      <span className="ml-2 text-xs text-gray-500 font-normal">(From your account)</span>
                    </label>
                    <input
                      ref={refs.ownerEmail}
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      readOnly
                      disabled
                      className="w-full px-4 py-4 border-2 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                      <span className="ml-2 text-xs text-gray-500 font-normal">(From your account)</span>
                    </label>
                    
                    {user?.phone_number ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center flex-1">
                            <span className="px-3 py-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-700 font-medium">+92</span>
                            <input
                              ref={refs.phoneNumber}
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              readOnly
                              disabled
                              className="w-full px-4 py-4 border-2 rounded-r-xl bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200"
                            />
                          </div>
                          
                          {user?.phone_verified === 1 ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-semibold text-emerald-700">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-500 rounded-xl">
                              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="text-sm font-semibold text-amber-700">Not Verified</span>
                            </div>
                          )}
                        </div>
                        
                        {user?.phone_verified !== 1 && (
                          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800 mb-2">
                              <strong>⚠️ Phone verification required:</strong> Please verify your phone number to publish this listing.
                            </p>
                            <a
                              href="/my-profile?tab=profile#phone-verification"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Go to Profile to Verify
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 mb-3">
                          <strong>❌ Phone number required:</strong> You need to add and verify your phone number before publishing a listing.
                        </p>
                        <a
                          href="/my-profile?tab=profile#phone-verification"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Go to Profile to Add Phone Number
                        </a>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">Phone number cannot be changed here. Go to your profile to update.</p>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How do you want buyers to contact you? *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    ref={refs.contactPreferences}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.contactPreferences.email ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-200 hover:border-emerald-300"
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
                      formData.contactPreferences.phone ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-200 hover:border-emerald-300"
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
                </div>
                {errors.contactPreferences && <p className="text-red-500 text-sm mt-2">{errors.contactPreferences}</p>}
              </div>

              {/* Image Upload (UI only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Property Images * (Max 5 images)</label>

                <div
                  ref={refs.images}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.images ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
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
                    accept="image/*"
                    multiple
                    className="hidden"
                    name="images"
                    onChange={handleChange}
                    onClick={(e) => {
                      e.currentTarget.value = null;
                    }}
                  />
                </div>

                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                {formData.images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Images ({formData.images.length}/5)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={file instanceof File ? URL.createObjectURL(file) : file}
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

        {/* Step 5 (UI previews only; not submitted) */}
        {currentStep === 5 && (
          <div className="p-8 sm:p-12">
            <div className="flex items-center space-x-3 text-emerald-600 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Document Verification</h2>
            </div>

            <div className="space-y-10">
              <p className="text-gray-700 text-sm mb-4">Upload your property documents for verification. Accepted formats: PDF, PNG, JPG. Max size 10MB per file.</p>

              {/* CNIC Verification Status */}
              <div ref={refs.cnicVerification}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">CNIC Verification</h3>
                
                {user?.cnic_verified === 1 ? (
                  // CNIC Verified
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-lg font-semibold text-emerald-700">CNIC Verified ✓</p>
                        <p className="text-sm text-emerald-600">Your CNIC has been verified successfully.</p>
                      </div>
                    </div>
                  </div>
                ) : user?.cnic_verified === 3 ? (
                  // CNIC Rejected
                  <div className="p-6 bg-red-50 border-2 border-red-500 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-red-700 mb-1">CNIC Rejected ✗</p>
                        <p className="text-sm text-red-600 mb-3">
                          Your CNIC verification was rejected. Please update your CNIC information in your profile to continue.
                        </p>
                        <a
                          href="http://localhost:5173/my-profile?tab=profile"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Go to Profile to Update CNIC
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  // CNIC Not Verified (status 0 or null)
                  <div className="p-6 bg-amber-50 border-2 border-amber-500 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                      <svg className="w-8 h-8 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-amber-700 mb-1">CNIC Verification Required ⚠️</p>
                        <p className="text-sm text-amber-600 mb-3">
                          You need to verify your CNIC before publishing a property listing. Please go to your profile to upload and verify your CNIC.
                        </p>
                        <a
                          href="http://localhost:5173/my-profile?tab=profile"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Go to Profile to Verify CNIC
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {errors.cnicVerification && <p className="text-red-500 text-sm mt-2">{errors.cnicVerification}</p>}
              </div>

              {/* Property Papers */}
              <div ref={refs.propertyPapers}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Property Papers</h3>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.propertyPapers ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <label htmlFor="property-papers" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Upload property ownership papers</p>
                    </div>
                  </label>
                  <input
                    id="property-papers"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    name="propertyPapers"
                    onChange={handleChange}
                    onClick={(e) => {
                      e.currentTarget.value = null;
                    }}
                    className="hidden"
                  />
                </div>

                {(formData.propertyPapers || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected ({formData.propertyPapers.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {formData.propertyPapers.map((f, i) => (
                        <div key={i} className="relative group">
                          {isImg(f) ? (
                            <img src={fileURL(f)} alt={f.name} className="w-full h-24 object-cover rounded border" />
                          ) : (
                            <div className="w-full h-24 rounded border flex items-center justify-center text-xs px-2 text-center">
                              {f.name}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removePropertyPaper(i)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.propertyPapers && <p className="text-red-500 text-sm mt-1">{errors.propertyPapers}</p>}
              </div>

              {/* Utility Bill */}
              <div ref={refs.utilityBill}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Utility Bill</h3>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.utilityBill ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <label htmlFor="utility-bill" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Upload recent utility bill</p>
                    </div>
                  </label>
                  <input
                    id="utility-bill"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    name="utilityBill"
                    onChange={handleChange}
                    onClick={(e) => {
                      e.currentTarget.value = null;
                    }}
                    className="hidden"
                  />
                </div>

                {(formData.utilityBill || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected ({formData.utilityBill.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {formData.utilityBill.map((f, i) => (
                        <div key={i} className="relative group">
                          {isImg(f) ? (
                            <img src={fileURL(f)} alt={f.name} className="w-full h-24 object-cover rounded border" />
                          ) : (
                            <div className="w-full h-24 rounded border flex items-center justify-center text-xs px-2 text-center">
                              {f.name}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeUtilityBill(i)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.utilityBill && <p className="text-red-500 text-sm mt-1">{errors.utilityBill}</p>}
              </div>

              {/* Other Docs (multiple) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Other Supporting Documents</h3>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.otherDocs ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <label htmlFor="other-docs" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Upload any other documents</p>
                    </div>
                  </label>
                  <input
                    id="other-docs"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    name="otherDocs"
                    onChange={handleChange}
                    onClick={(e) => {
                      e.currentTarget.value = null;
                    }}
                    className="hidden"
                  />
                </div>

                {(formData.otherDocs || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected ({formData.otherDocs.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {formData.otherDocs.map((f, i) => (
                        <div key={i} className="relative group">
                          {isImg(f) ? (
                            <img src={fileURL(f)} alt={f.name} className="w-full h-24 object-cover rounded border" />
                          ) : (
                            <div className="w-full h-24 rounded border flex items-center justify-center text-xs px-2 text-center">
                              {f.name}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeOtherDoc(i)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.otherDocs && <p className="text-red-500 text-sm mt-1">{errors.otherDocs}</p>}
              </div>

              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-gray-700">
                <p>
                  Ensure your documents are clear and legible. Verification may take 24–48 hours. The property would not be approved without the verified
                  documents. Required documents include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>CNIC verification (completed in your profile)</li>
                  <li>Property ownership documents</li>
                  <li>Utility bills</li>
                  <li>Other supporting papers if required</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer Nav */}
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
              <div key={step.id} className={`w-3 h-3 rounded-full transition-all duration-200 ${currentStep >= step.id ? "bg-emerald-600" : "bg-gray-300"}`} />
            ))}
          </div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-3 py-3 md:px-6 md:py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"
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
  );
};
//s

export default SellPage;
