"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Edit3, Save, X, User, Briefcase, Twitter, Linkedin, Github, Heart } from "lucide-react";

// Placeholder for profile image that generates an icon from initials
const generatePlaceholderImage = (firstName, lastName) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  // Updated colors to match the new theme
  const colors = ["#0D9488", "#14B8A6", "#047857", "#065F46", "#2dd4bf"];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-full">
      <rect x="0" y="0" width="120" height="120" fill={color} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#ffffff" fontFamily="Inter, sans-serif">
        {initials}
      </text>
    </svg>
  );
};

const MyProfileTab = () => {
  // State to control the visibility of the edit modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Initial profile data with added fields for job title, gender, and social links
  const [profileData, setProfileData] = useState({
    firstName: "Jane",
    lastName: "Doe",
    jobTitle: "Senior Product Designer",
    gender: "Female",
    email: "jane.doe@email.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    bio: "Passionate designer with a love for creating intuitive and beautiful user experiences. Specializing in UI/UX for SaaS platforms and mobile applications. Always learning new technologies and design trends.",
    interests: "Design systems, typography, photography, hiking",
    joinDate: "June 2022",
    socialLinks: {
      twitter: "https://twitter.com/janedoe",
      linkedin: "https://linkedin.com/in/janedoe",
      github: "https://github.com/janedoe",
    },
    profileImage: "", // Empty string to use the generated placeholder
  });

  // State to hold the data being edited in the modal, initialized with current profile data
  const [editData, setEditData] = useState(profileData);

  // Function to open the edit modal and set the edit data
  const handleEdit = () => {
    setEditData(profileData);
    setShowEditModal(true);
  };

  // Function to save the changes from the modal to the main profile data
  const handleSave = () => {
    setProfileData(editData);
    setShowEditModal(false);
  };

  // Function to cancel the edit and close the modal, reverting changes
  const handleCancel = () => {
    setEditData(profileData);
    setShowEditModal(false);
  };

  // Function to handle input changes for various fields, including nested objects like social links
  const handleInputChange = (field, value) => {
    if (field.includes("socialLinks")) {
      const socialField = field.split(".")[1];
      setEditData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center font-sans p-6 md:p-10">
      <div className="w-full max-w-6xl">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          {/* Background banner with gradient */}
          <div className="relative h-48 sm:h-56 bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          {/* Profile Image and Info */}
          <div className="relative z-10 -mt-24 sm:-mt-28 px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-8">
              {/* Profile Image with animated border and shadow */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-gray-800 transform transition-transform duration-300 hover:scale-105 shadow-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  generatePlaceholderImage(profileData.firstName, profileData.lastName)
                )}
              </div>

              {/* Name, Title, and Edit Button */}
              <div className="flex-1 mt-6 sm:mt-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">{profileData.jobTitle}</p>
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

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
              <User className="w-6 h-6 text-emerald-500" />
              <span>About Me</span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">{profileData.bio}</p>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interests</h3>
              <p className="text-gray-600 dark:text-gray-400">{profileData.interests}</p>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
                <Briefcase className="w-6 h-6 text-teal-500" />
                <span>Details</span>
              </h2>
              {/* Contact and Join Date */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Phone Number</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Location</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{profileData.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{profileData.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Gender</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{profileData.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Find me on</h3>
              <div className="flex flex-wrap gap-4">
                {profileData.socialLinks.twitter && (
                  <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 transform hover:-translate-y-1">
                    <Twitter className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </a>
                )}
                {profileData.socialLinks.linkedin && (
                  <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 transform hover:-translate-y-1">
                    <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </a>
                )}
                {profileData.socialLinks.github && (
                  <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 transform hover:-translate-y-1">
                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-down text-gray-900 dark:text-gray-100">
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
              {/* Profile Image Change - Placeholder for now */}
              <div className="flex items-center space-x-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {editData.profileImage ? (
                    <img
                      src={editData.profileImage}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Job Title and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={editData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="e.g. Senior Software Engineer"
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

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Location"
                />
              </div>

              {/* Bio and Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={editData.interests}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g. Hiking, Coding, Photography"
                />
              </div>

              {/* Social Links Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Social Links</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter/X</label>
                  <input
                    type="text"
                    value={editData.socialLinks.twitter}
                    onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                  <input
                    type="text"
                    value={editData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange("socialLinks.linkedin", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                  <input
                    type="text"
                    value={editData.socialLinks.github}
                    onChange={(e) => handleInputChange("socialLinks.github", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="https://github.com/username"
                  />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfileTab;
