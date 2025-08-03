import React, { useState } from "react";
import {
  Shield,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Home,
  DollarSign,
  MapPin,
  Save,
  Check,
  Trash2,
  Key,
  Link,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable components for better UI/UX and code organization
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

const SettingToggle = ({ label, description, checked, onChange }) => (
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </motion.div>
);

const SettingSelect = ({ label, description, value, options, onChange }) => (
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
    <select
      value={value}
      onChange={onChange}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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

const ActionButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </motion.button>
);

const SettingsTab = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    propertyAlerts: true,
    priceDropAlerts: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    showListings: true,
    allowMessages: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    linkedAccounts: ["Google"],
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    setPasswordError("");
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    // Simulate password update
    console.log("Updating password...");
    setSavedMessage("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSaveNotification = () => {
    console.log("Saving notification settings...", notificationSettings);
    setSavedMessage("Notification settings saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSavePrivacy = () => {
    console.log("Saving privacy settings...", privacySettings);
    setSavedMessage("Privacy settings saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSaveSecurity = () => {
    console.log("Saving security settings...", securitySettings);
    setSavedMessage("Security settings saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleAccountDeletion = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      console.log("User confirmed account deletion.");
      // Trigger account deletion process
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>

        <AnimatePresence>
          {savedMessage && <SuccessMessage message={savedMessage} key="success" />}
        </AnimatePresence>

        {/* --- Security Settings --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader icon={Shield} title="Security" description="Manage your account security and password." />
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            {passwordError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>{passwordError}</span>
              </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            <ActionButton
              icon={Lock}
              label="Update Password"
              onClick={handlePasswordSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Advanced Security</h3>
            <SettingToggle
              label="Two-Factor Authentication (2FA)"
              description="Add an extra layer of security to your account with a second verification step."
              checked={securitySettings.twoFactorAuth}
              onChange={() => setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
            />
            {securitySettings.twoFactorAuth && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center justify-between">
                <p>2FA is enabled. <span className="font-semibold text-emerald-600">Manage settings</span></p>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        </motion.div>

        {/* --- Notification Settings --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader icon={Bell} title="Notifications" description="Choose how and when you receive alerts." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive notifications via email for important updates."
              checked={notificationSettings.emailNotifications}
              onChange={() => setNotificationSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
            />
            <SettingToggle
              label="Push Notifications"
              description="Get instant alerts on your mobile device."
              checked={notificationSettings.pushNotifications}
              onChange={() => setNotificationSettings((prev) => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
            />
            <SettingToggle
              label="New Listing Alerts"
              description="Notify me when new properties match my saved searches."
              checked={notificationSettings.propertyAlerts}
              onChange={() => setNotificationSettings((prev) => ({ ...prev, propertyAlerts: !prev.propertyAlerts }))}
            />
            <SettingToggle
              label="Price Drop Alerts"
              description="Alert me when the price changes on my favorited properties."
              checked={notificationSettings.priceDropAlerts}
              onChange={() => setNotificationSettings((prev) => ({ ...prev, priceDropAlerts: !prev.priceDropAlerts }))}
            />
          </div>
          <ActionButton
            icon={Save}
            label="Save Notification Settings"
            onClick={handleSaveNotification}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          />
        </motion.div>

        {/* --- Privacy Settings --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader icon={Eye} title="Privacy" description="Control who can see your profile and activity." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingSelect
              label="Profile Visibility"
              description="Choose who can see your profile details."
              value={privacySettings.profileVisibility}
              options={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
                { value: "contacts", label: "Contacts Only" },
              ]}
              onChange={(e) => setPrivacySettings((prev) => ({ ...prev, profileVisibility: e.target.value }))}
            />
            <SettingToggle
              label="Show Contact Information"
              description="Display your contact details on your profile."
              checked={privacySettings.showContactInfo}
              onChange={() => setPrivacySettings((prev) => ({ ...prev, showContactInfo: !prev.showContactInfo }))}
            />
            <SettingToggle
              label="Show My Listings"
              description="Display your property listings publicly."
              checked={privacySettings.showListings}
              onChange={() => setPrivacySettings((prev) => ({ ...prev, showListings: !prev.showListings }))}
            />
            <SettingToggle
              label="Allow Messages"
              description="Let other users send you direct messages."
              checked={privacySettings.allowMessages}
              onChange={() => setPrivacySettings((prev) => ({ ...prev, allowMessages: !prev.allowMessages }))}
            />
          </div>
          <ActionButton
            icon={Save}
            label="Save Privacy Settings"
            onClick={handleSavePrivacy}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          />
        </motion.div>

        {/* --- Account Management --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6"
        >
          <SectionHeader
            icon={Key}
            title="Account Management"
            description="Manage linked accounts and delete your profile."
          />
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Linked Accounts</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="font-semibold text-gray-800">Google</span>
                <p className="text-sm text-gray-500">
                  <span className="text-emerald-600 font-medium">Connected</span> as "user@gmail.com"
                </p>
              </div>
              <button className="text-sm text-red-500 hover:text-red-700 font-medium">Disconnect</button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
            <div className="p-4 mt-4 bg-red-50 rounded-xl flex items-center justify-between">
              <div className="flex-1">
                <span className="font-semibold text-red-700">Delete Account</span>
                <p className="text-sm text-red-500 mt-1">Permanently delete your account and all associated data.</p>
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