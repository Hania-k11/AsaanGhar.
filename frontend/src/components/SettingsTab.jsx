/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Save,
  Check,
  Key,
  Info,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3001/api";

/* --- Reusable Components --- */
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100">
    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const SettingToggle = ({ label, description, checked, onChange, disabled }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
  >
    <div className="flex-1 mr-4">
      <span className="text-gray-800 font-medium">{label}</span>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </motion.div>
);

const SuccessMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center space-x-2 font-medium"
  >
    <Check className="w-5 h-5" />
    <span>{message}</span>
  </motion.div>
);

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
  >
    <Info className="w-4 h-4" />
    <span>{message}</span>
  </motion.div>
);

const ActionButton = ({ icon: Icon, label, onClick, className = "", disabled = false, loading = false }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled || loading}
    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${className} ${
      disabled || loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {loading ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
      <Icon className="w-5 h-5" />
    )}
    <span>{label}</span>
  </motion.button>
);

  /* --- Password Input Component --- */
  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    toggleShow,
    placeholder = "••••••••",
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

/* --- Main Component --- */
const SettingsTab = () => {
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    propertyAlerts: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    showListings: true,
    allowMessages: true,
  });

  // Fetch user settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setNotificationSettings({
            emailNotifications: data.settings.email_notifications,
            propertyAlerts: data.settings.property_alerts,
          });
          setPrivacySettings({
            profileVisibility: data.settings.profile_visibility,
            showContactInfo: data.settings.show_contact_info,
            showListings: data.settings.show_listings,
            allowMessages: data.settings.allow_messages,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await fetch(`${API_BASE_URL}/settings/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSavedMessage("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setTimeout(() => setSavedMessage(""), 3000);
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveNotification = async () => {
    try {
      setSavingNotifications(true);
      const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email_notifications: notificationSettings.emailNotifications,
          property_alerts: notificationSettings.propertyAlerts,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSavedMessage("Notification settings saved!");
        setTimeout(() => setSavedMessage(""), 3000);
      } else {
        setPasswordError("Failed to save notification settings");
        setTimeout(() => setPasswordError(""), 3000);
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setPasswordError("Failed to save notification settings");
      setTimeout(() => setPasswordError(""), 3000);
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSavingPrivacy(true);
      const response = await fetch(`${API_BASE_URL}/settings/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          profile_visibility: privacySettings.profileVisibility,
          show_contact_info: privacySettings.showContactInfo,
          show_listings: privacySettings.showListings,
          allow_messages: privacySettings.allowMessages,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSavedMessage("Privacy settings saved!");
        setTimeout(() => setSavedMessage(""), 3000);
      } else {
        setPasswordError("Failed to save privacy settings");
        setTimeout(() => setPasswordError(""), 3000);
      }
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      setPasswordError("Failed to save privacy settings");
      setTimeout(() => setPasswordError(""), 3000);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleAccountDeletion = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    
    if (!password) return;

    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/account`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert("Account deleted successfully");
          await logout();
          window.location.href = "/";
        } else {
          alert(data.error || "Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>

        <AnimatePresence>
          {savedMessage && <SuccessMessage message={savedMessage} key="success" />}
        </AnimatePresence>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader
            icon={Shield}
            title="Security"
            description="Manage your account security and password."
          />
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>

          {passwordError && <ErrorMessage message={passwordError} />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PasswordInput
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(val) => handlePasswordChange("currentPassword", val)}
              show={showCurrentPassword}
              toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
            />
            <PasswordInput
              label="New Password"
              value={passwordData.newPassword}
              onChange={(val) => handlePasswordChange("newPassword", val)}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword(!showNewPassword)}
            />
            <PasswordInput
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(val) => handlePasswordChange("confirmPassword", val)}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <ActionButton
            icon={Lock}
            label="Update Password"
            onClick={handlePasswordSubmit}
            loading={changingPassword}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
          />
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader
            icon={Bell}
            title="Notifications"
            description="Choose how and when you receive alerts."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive notifications via email."
              checked={notificationSettings.emailNotifications}
              disabled={savingNotifications}
              onChange={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  emailNotifications: !prev.emailNotifications,
                }))
              }
            />
            <SettingToggle
              label="New Listing Alerts"
              description="Notify me about new matching properties."
              checked={notificationSettings.propertyAlerts}
              disabled={savingNotifications}
              onChange={() =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  propertyAlerts: !prev.propertyAlerts,
                }))
              }
            />
          </div>
          <ActionButton
            icon={Save}
            label="Save Notification Settings"
            onClick={handleSaveNotification}
            loading={savingNotifications}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          />
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader
            icon={Eye}
            title="Privacy"
            description="Control who can see your profile."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingToggle
              label="Show Contact Information"
              description="Display your contact details."
              checked={privacySettings.showContactInfo}
              disabled={savingPrivacy}
              onChange={() =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  showContactInfo: !prev.showContactInfo,
                }))
              }
            />
            <SettingToggle
              label="Show My Listings"
              description="Display your property listings."
              checked={privacySettings.showListings}
              disabled={savingPrivacy}
              onChange={() =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  showListings: !prev.showListings,
                }))
              }
            />
          </div>
          <ActionButton
            icon={Save}
            label="Save Privacy Settings"
            onClick={handleSavePrivacy}
            loading={savingPrivacy}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          />
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader
            icon={Key}
            title="Account Management"
            description="Manage your account."
          />

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
            <div className="p-4 mt-4 bg-red-50 rounded-xl flex items-center justify-between">
              <div className="flex-1">
                <span className="font-semibold text-red-700">Delete Account</span>
                <p className="text-sm text-red-500 mt-1">
                  Permanently delete your account.
                </p>
              </div>
              <button
                onClick={handleAccountDeletion}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsTab;