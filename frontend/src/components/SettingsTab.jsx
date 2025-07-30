// src/components/SettingsTab.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Bell, Lock, Trash2, Upload, ShieldCheck, CheckCircle, XCircle, Info, KeyRound } from "lucide-react"; // Added more icons

// The `userData` prop is passed from MyProfile
const SettingsTab = ({ userData }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "", // Added for security when changing password
    newPassword: "",     // New password field
    twoFactorAuth: false,
    notifications: {
      emailAlerts: false,
      smsAlerts: false,
      newMessageAlerts: false,
      propertyPriceDropAlerts: false,
    },
  });

  const [profileImage, setProfileImage] = useState(userData.avatar);
  const [imageFile, setImageFile] = useState(null); // To hold the actual file for upload

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: null, message: null, section: null }); // 'success', 'error'
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form state when userData changes
  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        email: userData.contact?.email || "",
        phone: userData.contact?.phone || "",
        currentPassword: "",
        newPassword: "",
        twoFactorAuth: userData.settings?.twoFactorAuth || false,
        notifications: {
          emailAlerts: userData.settings?.notifications?.emailAlerts || false,
          smsAlerts: userData.settings?.notifications?.smsAlerts || false,
          newMessageAlerts: userData.settings?.notifications?.newMessageAlerts || false,
          propertyPriceDropAlerts: userData.settings?.notifications?.propertyPriceDropAlerts || false,
        },
      });
      setProfileImage(userData.avatar);
      setImageFile(null); // Clear any pending image file
    }
  }, [userData]);

  // Reset status messages after a delay
  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => {
        setSaveStatus({ type: null, message: null, section: null });
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("notifications.")) {
      const notificationKey = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked,
        },
      }));
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
    setSaveStatus({ type: null, message: null, section: null }); // Reset status on any change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file); // Store the actual file
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    switch (strength) {
      case 0: return { text: "Very Weak", color: "text-red-500" };
      case 1: return { text: "Weak", color: "text-orange-500" };
      case 2: return { text: "Medium", color: "text-yellow-500" };
      case 3: return { text: "Strong", color: "text-emerald-500" };
      case 4: return { text: "Very Strong", color: "text-green-600" };
      default: return { text: "", color: "" };
    }
  };

  const handleSubmit = async (actionType, formData, sectionName) => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: null, section: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (actionType === "personal") {
        // Handle image upload separately if imageFile exists
        if (imageFile) {
          console.log("Simulating image upload for:", imageFile.name);
          // In a real app: const imageUrl = await uploadImage(imageFile);
          // then update formData.avatarUrl = imageUrl;
        }
        console.log(`Saving ${sectionName} data:`, formData);
        // await axios.put('/api/users/me', formData);
      } else if (actionType === "security") {
        console.log(`Updating ${sectionName} data:`, formData);
        // await axios.put('/api/users/me/security', formData);
        setForm(prev => ({ ...prev, currentPassword: "", newPassword: "" })); // Clear password fields
      } else if (actionType === "notifications") {
        console.log(`Updating ${sectionName} data:`, formData);
        // await axios.put('/api/users/me/notifications', formData);
      }

      setSaveStatus({ type: "success", message: `${sectionName} updated successfully!`, section: sectionName });
    } catch (err) {
      console.error(`Error saving ${sectionName}:`, err);
      setSaveStatus({ type: "error", message: `Failed to save ${sectionName}. Please try again.`, section: sectionName });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: null, section: 'danger' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      // await axios.delete('/api/user/account');
      console.log("Account deleted! (Simulated)");
      setSaveStatus({ type: "success", message: "Your account has been deleted successfully.", section: 'danger' });
      // Redirect or log out user after a short delay
      setTimeout(() => { /* redirect logic */ alert("Redirecting to home..."); }, 1500);
    } catch (err) {
      console.error("Error deleting account:", err);
      setSaveStatus({ type: "error", message: "Failed to delete account. Please try again.", section: 'danger' });
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // UI for Save Status Message
  const SaveFeedback = ({ type, message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 ${
        type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400";
  const buttonClass = "bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const dangerButtonClass = "bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="relative space-y-8 max-w-3xl mx-auto py-4"> {/* Added mx-auto for centering */}
      <AnimatePresence>
        {saveStatus.message && (
          <SaveFeedback type={saveStatus.type} message={saveStatus.message} />
        )}
      </AnimatePresence>

      {/* Personal Information Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
      >
        <h3 className="font-extrabold text-2xl text-gray-800 flex items-center gap-2">
          <Info size={24} className="text-emerald-500" /> Personal Information
        </h3>
        <p className="text-gray-600 text-sm">Update your basic profile details and picture.</p>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-6 mt-5">
          <motion.img
            src={profileImage}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-4 border-emerald-500 object-cover shadow-md ring-2 ring-emerald-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
          <label className="cursor-pointer bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full flex items-center gap-2 font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm hover:shadow-md">
            <Upload size={18} /> Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className={inputClass} />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit("personal", { name: form.name, email: form.email, phone: form.phone, avatar: profileImage }, "Personal Information")}
          className={buttonClass}
          disabled={isSaving}
        >
          {isSaving && saveStatus.section === "Personal Information" ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Save size={20} />
          )}
          {isSaving && saveStatus.section === "Personal Information" ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.div>

      {/* Security Settings Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
      >
        <h3 className="font-extrabold text-2xl text-gray-800 flex items-center gap-2">
          <Lock size={24} className="text-emerald-500" /> Security Settings
        </h3>
        <p className="text-gray-600 text-sm">Manage your password and two-factor authentication.</p>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className={inputClass}
              autoComplete="current-password"
            />
            <p className="text-xs text-gray-500 mt-1">Required to change password.</p>
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className={inputClass}
              autoComplete="new-password"
            />
            <AnimatePresence>
              {form.newPassword && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-sm font-medium mt-1 ${getPasswordStrength(form.newPassword).color}`}
                >
                  Password Strength: {getPasswordStrength(form.newPassword).text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <input
            type="checkbox"
            name="twoFactorAuth"
            checked={form.twoFactorAuth}
            onChange={handleChange}
            className="w-5 h-5 accent-emerald-600 rounded-md focus:ring-emerald-500"
          />
          <div className="flex flex-col">
            <span className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <ShieldCheck size={18} className="text-emerald-500" /> Enable Two-Factor Authentication
            </span>
            <span className="text-xs text-gray-500">Add an extra layer of security to your account.</span>
          </div>
        </label>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit("security", { currentPassword: form.currentPassword, newPassword: form.newPassword, twoFactorAuth: form.twoFactorAuth }, "Security Settings")}
          className={buttonClass}
          disabled={isSaving}
        >
          {isSaving && saveStatus.section === "Security Settings" ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <KeyRound size={20} />
          )}
          {isSaving && saveStatus.section === "Security Settings" ? "Updating..." : "Update Security"}
        </motion.button>
      </motion.div>

      {/* Notification Preferences Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
      >
        <h3 className="font-extrabold text-2xl text-gray-800 flex items-center gap-2">
          <Bell size={24} className="text-emerald-500" /> Notification Preferences
        </h3>
        <p className="text-gray-600 text-sm">Control how you receive updates and alerts.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "emailAlerts", label: "Email Alerts" },
            { name: "smsAlerts", label: "SMS Alerts" },
            { name: "newMessageAlerts", label: "New Message Alerts" },
            { name: "propertyPriceDropAlerts", label: "Property Price Drop Alerts" },
          ].map((item) => (
            <label key={item.name} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <input
                type="checkbox"
                name={`notifications.${item.name}`}
                checked={form.notifications[item.name]}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-600 rounded-md focus:ring-emerald-500"
              />
              <span className="text-base font-medium text-gray-800">{item.label}</span>
            </label>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit("notifications", form.notifications, "Notification Preferences")}
          className={buttonClass}
          disabled={isSaving}
        >
          {isSaving && saveStatus.section === "Notification Preferences" ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Bell size={20} />
          )}
          {isSaving && saveStatus.section === "Notification Preferences" ? "Saving..." : "Save Preferences"}
        </motion.button>
      </motion.div>

      {/* Danger Zone Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-red-50 rounded-2xl shadow-xl p-8 space-y-6 border border-red-200 text-red-800"
      >
        <h3 className="font-extrabold text-2xl flex items-center gap-2">
          <Trash2 size={24} className="text-red-600" /> Danger Zone
        </h3>
        <p className="text-red-700 text-sm">
          Proceed with caution. These actions are irreversible and will permanently affect your account.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={dangerButtonClass}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isSaving}
        >
          <Trash2 size={20} /> Delete Account
        </motion.button>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-6 bg-white rounded-xl border border-red-300 shadow-md space-y-4"
            >
              <h4 className="font-semibold text-lg text-red-700 flex items-center gap-2">
                <Info size={20} /> Confirm Account Deletion
              </h4>
              <p className="text-base text-gray-700">
                This action is irreversible. All your data, listings, and favorites will be permanently removed.
                Please type "DELETE" below to confirm.
              </p>
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                className={`${inputClass} border-red-400 focus:ring-red-400`}
                onChange={(e) => setShowDeleteConfirm(e.target.value === "DELETE")} // Only show button if typed correctly
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={dangerButtonClass}
                  onClick={handleDeleteAccount}
                  disabled={isSaving || !showDeleteConfirm} // Disable until "DELETE" is typed
                >
                  {isSaving && saveStatus.section === "danger" ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Trash2 size={20} />
                  )}
                  {isSaving && saveStatus.section === "danger" ? "Deleting..." : "Yes, Delete My Account"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-300 transition-all duration-300"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SettingsTab;