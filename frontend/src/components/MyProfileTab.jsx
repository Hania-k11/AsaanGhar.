"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Calendar, Camera, Edit3, Trash2, Save, X, User } from "lucide-react"

const MyProfileTab = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Experienced real estate investor with over 10 years in the market. Specializing in residential and commercial properties with a focus on sustainable development and community growth.",
    joinDate: "January 2020",
    profileImage: "/placeholder.svg?height=120&width=120",
  })

  const [editData, setEditData] = useState(profileData)

  const handleEdit = () => {
    setEditData(profileData)
    setShowEditModal(true)
  }

  const handleSave = () => {
    setProfileData(editData)
    setShowEditModal(false)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setShowEditModal(false)
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 h-40 relative">
          <div className="absolute inset-0 bg-emerald-200 bg-opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <div className="relative px-8 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8 -mt-20">
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl bg-gray-100 overflow-hidden">
                <img
                  src={profileData.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white p-3 rounded-xl shadow-lg">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 mt-6 lg:mt-0">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Member since {profileData.joinDate}
                  </p>
                </div>
                <button
                  onClick={handleEdit}
                  className="mt-4 lg:mt-0 bg-emerald-700 hover:bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
              <Mail className="w-4 h-4 text-slate-600" />
            </div>
            Contact Information
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-900 font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                <p className="text-gray-900 font-medium">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Location</p>
                <p className="text-gray-900 font-medium">{profileData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{profileData.bio}</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          Danger Zone
        </h2>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 bg-red-50 rounded-xl border border-red-200">
          <div className="space-y-2">
            <h3 className="font-bold text-red-800 text-lg">Delete Account</h3>
            <p className="text-red-600">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 lg:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-xl border-2 border-gray-200 bg-gray-100 overflow-hidden">
                  <img
                    src={editData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle account deletion
                  setShowDeleteModal(false)
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfileTab