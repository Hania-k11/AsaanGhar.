/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, Calendar, Edit3, Save, X, User, Hash, CreditCard, Shield, CheckCircle2, AlertCircle, Clock, AlertTriangle, Home, XCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { format } from "date-fns"
import CNICUpload from "./CNICUpload"
import PhoneVerificationModal from "./PhoneVerificationModal"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import EmailChangeModal from "./EmailChangeModal"

const generatePlaceholderImage = (firstName, lastName) => {
  const safeFirstName = firstName || "U"; 
  const safeLastName = lastName || "U"; 
  const initials = `${safeFirstName[0]}${safeLastName[0]}`.toUpperCase();
  const colors = ["#0D9488", "#14B8A6", "#047857", "#065F46", "#2dd4bf"];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full rounded-full"
    >
      <rect x="0" y="0" width="120" height="120" fill={color} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="48"
        fontWeight="bold"
        fill="#ffffff"
        fontFamily="Inter, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCNICModal, setShowCNICModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const { user, updateUser } = useAuth();

  // Fetch property status
  useEffect(() => {
    const fetchPropertyStatus = async () => {
      if (!user?.user_id) return;
      try {
        const { data } = await axios.get(`/api/property/property-status/${user.user_id}`);
        if (data.success) {
          setPropertyStatus(data.properties);
        }
      } catch (err) {
        console.error('Error fetching property status:', err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchPropertyStatus();
  }, [user?.user_id]); 

  // Initialize editData with only editable fields
  const [editData, setEditData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    gender: user?.gender || "",
    updated_at: user?.updated_at || new Date().toISOString(),
  });

  const handleEdit = () => {
    setEditData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      gender: user?.gender || "",
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    updateUser(editData); 
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setEditData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      gender: user?.gender || "",
    });
    setShowEditModal(false);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCNICUploadSuccess = (data) => {
    // Update user context with new CNIC data and set status to pending
    updateUser({
      cnic_front_url: data.cnicFrontUrl,
      cnic_back_url: data.cnicBackUrl,
      cnic: data.cnic,
      cnic_verified: data.cnic_verified || 2 // Set to pending
    });
    setShowCNICModal(false); // Close modal after success
  };

  const handlePhoneVerificationSuccess = (updatedUser) => {
    // Update user context with verified phone
    updateUser(updatedUser);
    setShowPhoneModal(false);
  };

  const handleEmailChangeSuccess = (updatedUser) => {
    // Update user context with new email
    updateUser(updatedUser);
    setShowEmailModal(false);
  };

  // Handle loading state if user is not yet available
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white  flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-4xl">
        {/* Profile Header Card */}
        <div className="bg-white  rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          {/* Background banner with gradient */}
          <div className="relative h-48 sm:h-50 bg-gradient-to-br from-emerald-400 to-teal-200/80">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          {/* Profile Image and Info */}
          <div className="relative z-10 -mt-24 sm:-mt-28 px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-8">
              {/* Profile Image */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-gray-800 transform transition-transform duration-300 hover:scale-105 shadow-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  generatePlaceholderImage(user.first_name, user.last_name)
                )}
              </div>

              {/* Name and Edit Button */}
              <div className="flex-1 mt-6 sm:mt-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                      {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      Member since {format(new Date(user?.created_at), " yyyy")}
                    </p>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center space-x-3">
            <User className="w-6 h-6 text-emerald-500" />
            <span>Profile Information</span>
          </h2>

          {user?.cnic_verified === 3 && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-200">Verification Rejected</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your CNIC verification was rejected. Please ensure you've uploaded clear images and entered the correct CNIC number.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div>
                    <p className="text-sm md:text-md text-gray-500 dark:text-gray-400 font-medium mb-1">Email Address</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline px-2 py-1 self-start sm:self-auto"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Phone */}
            {user.phone_number && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Phone Number</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{user.phone_number}</p>
                </div>
              </div>
            )}

            {/* Age */}
            {user.age && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Age</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{user.age} years old</p>
                </div>
              </div>
            )}

            {/* Gender */}
            {user.gender && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Gender</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{user.gender}</p>
                </div>
              </div>
            )}

            {/* Member Since - spans full width */}
            <div className="md:col-span-2 flex items-start space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Member Since</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{format(new Date(user?.created_at), "dd-MM-yyyy")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CNIC Verification Card */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-emerald-500" />
            <span>CNIC Verification</span>
          </h2>

          <div className="space-y-6">
            {/* CNIC Number */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Enter your CNIC number and upload front/back images together inside the modal below.
              </p>
              {user?.cnic ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Current CNIC: {user.cnic}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No CNIC stored yet.
                </p>
              )}
            </div>

            {/* CNIC Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                CNIC Images
              </label>
              {user?.cnic_front_url && user?.cnic_back_url ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <img
                        src={user.cnic_front_url}
                        alt="CNIC Front"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all rounded-xl flex items-center justify-center pointer-events-none">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Front</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <img
                        src={user.cnic_back_url}
                        alt="CNIC Back"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all rounded-xl flex items-center justify-center pointer-events-none">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Back</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status Messages */}
                  {user?.cnic_verified === 1 && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">Verified</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">Your CNIC has been verified. You cannot edit it now.</p>
                      </div>
                    </div>
                  )}

                  {user?.cnic_verified === 2 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">Pending Verification</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Your CNIC is under review. You cannot edit it while it is pending.</p>
                      </div>
                    </div>
                  )}

                  {user?.cnic_verified === 3 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">Verification Rejected</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Your CNIC has been rejected. Please make sure you have uploaded the correct image and CNIC number.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No CNIC images uploaded yet</p>
                </div>
              )}

              {/* Upload/Update Button Logic */}
              {(!user?.cnic_verified || user?.cnic_verified === 0 || user?.cnic_verified === 3) && (
                <button
                  onClick={() => setShowCNICModal(true)}
                  className="mt-4 w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                >
                  {user?.cnic_front_url ? 'Update CNIC Images' : 'Upload CNIC Images'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Phone Verification Card */}
        <div id="phone-verification" className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center space-x-3">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span>Phone Verification</span>
          </h2>

          <div className="space-y-4">
            {user?.phone_number ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verified Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.phone_number}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No phone number added yet</p>
              </div>
            )}
            <button
              onClick={() => setShowPhoneModal(true)}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              {user?.phone_number ? 'Change Phone Number' : 'Add Phone Number'}
            </button>
          </div>
        </div>

      
      
      </div>

      {/* CNIC Upload Modal */}
      <AnimatePresence>
        {showCNICModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowCNICModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.cnic_verified === 3 ? 'Update CNIC' : 'Verify Your CNIC'}
                </h2>
                <button
                  onClick={() => setShowCNICModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CNICUpload 
                onUploadSuccess={handleCNICUploadSuccess} 
                currentCnic={user?.cnic}
                verificationStatus={user?.cnic_verified}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneVerificationSuccess}
        currentPhone={user?.phone_number}
      />

      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSuccess={handleEmailChangeSuccess}
      />

       {/* Edit Profile Modal */}
            <AnimatePresence>
              {showEditModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] flex items-start justify-center pt-28 p-4 overflow-y-auto"
                  style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                  onClick={handleCancel}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl w-full shadow-2xl text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <Edit3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Edit Profile</h3>
                      </div>
                      <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:rotate-90"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Left Column: Avatar */}
                      <div className="md:col-span-4 flex flex-col items-center border-r border-gray-100 dark:border-gray-700/50 pr-4">
                        <div className="relative group mb-4">
                          <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 dark:border-emerald-400/20 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                            {generatePlaceholderImage(editData.first_name, editData.last_name)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                          Profile Picture
                        </p>
                      </div>

                      {/* Right Column: Fields */}
                      <div className="md:col-span-8 space-y-5">
                         {/* Name Fields - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={editData.first_name}
                              onChange={(e) => handleInputChange("first_name", e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={editData.last_name}
                              onChange={(e) => handleInputChange("last_name", e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>

                         {/* Email and Gender - Side by Side on large screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Gender Field */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Gender
                            </label>
                            <select
                              value={editData.gender}
                              onChange={(e) => handleInputChange("gender", e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 cursor-pointer"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Non-binary">Non-binary</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>
                             
                             {/* Email Field */}
                           <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={user.email}
                                readOnly
                                disabled
                                className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 focus:outline-none cursor-not-allowed"
                              />
                               <button
                                onClick={() => {
                                  setShowEditModal(false);
                                  setShowEmailModal(true);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Change Email"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                           </div>
                        </div>
                         
                         {/* Modal Actions - Aligned to bottom of inputs */}
                        <div className="flex space-x-4 pt-4 mt-2">
                          <button
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                          >
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
      </div>

          )
     
};

export default UserProfile;
