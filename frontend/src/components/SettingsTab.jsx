

import { useState } from "react"
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
} from "lucide-react"

const SettingsTab = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    propertyAlerts: true,
    priceDropAlerts: true,
    marketUpdates: true,
    newListings: false,
    messageNotifications: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    showListings: true,
    allowMessages: true,
    showActivity: false,
  })

 

  const handlePasswordChange = (field, value) => {
  setPasswordData((prev) => ({ ...prev, [field]: value }));
};

const handleNotificationToggle = (setting) => {
  setNotificationSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
};

const handlePrivacyToggle = (setting) => {
  setPrivacySettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
};


  const handleSaveSettings = () => {
    setSavedMessage("Settings saved successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    // Handle password change logic here
    setSavedMessage("Password updated successfully!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setSavedMessage(""), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success Message */}
      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>

     

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700 font-medium">Profile Visibility</span>
              <p className="text-sm text-gray-500">Control who can see your profile</p>
            </div>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => handlePrivacyToggle("profileVisibility")}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>

          {[
            {
              key: "showContactInfo",
              label: "Show Contact Information",
              desc: "Display your contact details on your profile",
            },
            { key: "showListings", label: "Show My Listings", desc: "Display your property listings publicly" },
            { key: "allowMessages", label: "Allow Messages", desc: "Let other users send you messages" },
            { key: "showActivity", label: "Show Activity Status", desc: "Show when you were last active" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-gray-700 font-medium">{label}</span>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
             <button
  onClick={() => handlePrivacyToggle(key)}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
    privacySettings[key] ? "bg-emerald-500" : "bg-gray-300"
  }`}
>
  <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      privacySettings[key] ? "translate-x-6" : "translate-x-1"
    }`}
  />
</button>

            </div>
          ))}
        </div>
      </div>

  

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  )
}

export default SettingsTab
