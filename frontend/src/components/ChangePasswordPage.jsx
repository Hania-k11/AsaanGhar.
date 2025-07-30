import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({ old: false, new: false, confirm: false });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = (field) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = () => {
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSymbol = /[\W_]/.test(newPassword);
    const length = newPassword.length;

    if (length >= 8 && hasUpper && hasNumber && hasSymbol) return "Strong";
    if (length >= 6 && (hasUpper || hasNumber)) return "Medium";
    return "Weak";
  };

  const getStrengthColor = () => {
    const level = passwordStrength();
    return level === "Strong"
      ? "bg-green-400"
      : level === "Medium"
      ? "bg-yellow-400"
      : "bg-red-500";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setSuccessMsg("");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      setSuccessMsg("");
      return;
    }

    setError("");
    setSuccessMsg("Password updated successfully!");
    setShowPopup(true);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      setShowPopup(false);
      navigate("/my-profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-white to-emerald-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        whileHover={{ rotateX: 3, rotateY: 3 }}
        className="w-full max-w-xl bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 sm:p-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-500 mb-6">
          🔐 Change Your Password
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              label: "Old Password",
              value: oldPassword,
              setValue: setOldPassword,
              field: "old",
              visible: visible.old,
            },
            {
              label: "New Password",
              value: newPassword,
              setValue: setNewPassword,
              field: "new",
              visible: visible.new,
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              field: "confirm",
              visible: visible.confirm,
            },
          ].map(({ label, value, setValue, field, visible }) => (
            <div key={field} className="relative">
              <label className="block text-gray-700 font-medium mb-1">{label}</label>
              <input
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
              />
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => handleToggle(field)}
              >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.div>

              {field === "new" && value && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <motion.div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{
                        width:
                          passwordStrength() === "Strong"
                            ? "100%"
                            : passwordStrength() === "Medium"
                            ? "66%"
                            : "33%",
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength() === "Strong"
                            ? "100%"
                            : passwordStrength() === "Medium"
                            ? "66%"
                            : "33%",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-gray-600 font-medium">
                    Strength: {passwordStrength()}
                  </p>
                </div>
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Update Password
          </motion.button>
        </form>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-100 border border-emerald-200 text-emerald-700 font-medium px-6 py-3 rounded-xl shadow-lg z-50"
          >
            ✅ Password updated successfully!!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChangePasswordPage;
