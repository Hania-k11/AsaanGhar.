

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, Calendar, Edit3, Save, X, User, Hash } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { format } from "date-fns"

// Placeholder for profile image that generates an icon from initials
const generatePlaceholderImage = (firstName, lastName) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
  const colors = ["#0D9488", "#14B8A6", "#047857", "#065F46", "#2dd4bf"]
  const color = colors[initials.charCodeAt(0) % colors.length]

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
  )
}

const UserProfile = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const { userDetails } = useAuth()

  

  const [editData, setEditData] = useState(userDetails)

  const handleEdit = () => {
    setEditData(userDetails)
    setShowEditModal(true)
  }

  const handleSave = () => {
    // setProfileData(editData)
    setShowEditModal(false)
  }

  const handleCancel = () => {
    setEditData(userDetails)
    setShowEditModal(false)
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center font-sans p-6 md:p-10">
      <div className="w-full max-w-4xl">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          {/* Background banner with gradient */}
          <div className="relative h-48 sm:h-56 bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          {/* Profile Image and Info */}
          <div className="relative z-10 -mt-24 sm:-mt-28 px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-8">
              {/* Profile Image */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-gray-800 transform transition-transform duration-300 hover:scale-105 shadow-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {userDetails.profileImage ? (
                  <img
                    src={userDetails.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  generatePlaceholderImage(userDetails.first_name, userDetails.last_name)
                )}
              </div>

              {/* Name and Edit Button */}
              <div className="flex-1 mt-6 sm:mt-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                      {userDetails.first_name} {userDetails.last_name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      Member since{format(new Date(userDetails?.created_at), " yyyy")}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Email Address</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{userDetails.email}</p>
              </div>
            </div>

            {/* Phone */}
                {userDetails.phone_number &&(
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

            
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Phone Number</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{userDetails.phone_number}</p>
              </div>
             
            </div> )}

            {/* Age */}
            {userDetails.age && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Age</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{userDetails.age} years old</p>
              </div>
            </div>)}

            {/* Gender */}
             {userDetails.gender && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Gender</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{userDetails.gender}</p>
              </div>
            </div>)}

            {/* Member Since - spans full width */}
            <div className="md:col-span-2 flex items-start space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Member Since</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{format(new Date(userDetails?.created_at), "dd-MM-yyyy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center p-4 pt-20 sm:pt-24 md:pt-18 overflow-y-auto"
            style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-gray-900 dark:text-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {editData.profileImage ? (
                      <img
                        src={editData.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      generatePlaceholderImage(editData.firstName, editData.lastName)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo URL</p>
                    <input
                      type="text"
                      value={editData.profileImage}
                      onChange={(e) => handleInputChange("profileImage", e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editData.first_name}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editData.last_name}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editData.phone_number}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
                    <input
                      type="number"
                      value={editData.age}
                      onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select
                      value={editData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-full font-medium transition-colors transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full flex items-center justify-center space-x-2 font-medium transition-colors transform hover:-translate-y-0.5"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserProfile
