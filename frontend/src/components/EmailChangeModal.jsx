import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./ToastProvider";

const EmailChangeModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Verify Code
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setNewEmail("");
      setVerificationCode("");
      setLoading(false);
      setTimer(0);
    }
  }, [isOpen]);

  // Timer for resend code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      toastError("Please enter a new email address");
      return;
    }

    if (!validateEmail(newEmail)) {
      toastError("Please enter a valid email address");
      return;
    }

    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      toastError("New email must be different from current email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/request-email-change", {
        userId: user.user_id,
        newEmail: newEmail.trim()
      });

      toastSuccess(response.data.message);
      setStep(2);
      setTimer(60); // 60 seconds cooldown for resend
    } catch (err) {
      console.error("Request code error:", err);
      toastError(err.response?.data?.error || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toastError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/verify-email-change", {
        userId: user.user_id,
        code: verificationCode
      });

      toastSuccess("Email updated successfully!");
      updateUser(response.data.user); // Update context with new user data
      onSuccess && onSuccess(response.data.user);
      onClose();
    } catch (err) {
      console.error("Verification error:", err);
      toastError(err.response?.data?.error || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Change Email Address</h3>
            <p className="opacity-90 text-sm">
              {step === 1 
                ? "Enter your new email address to receive a verification code" 
                : "Enter the code sent to your new email address"}
            </p>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-800 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                 <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-gray-600">
                    We've sent a 6-digit code to <br/>
                    <span className="font-semibold text-gray-900">{newEmail}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      // Only allow numbers and max 6 chars
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setVerificationCode(val);
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center text-2xl tracking-[0.5em] py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-800 placeholder:text-gray-300 font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Update Email"
                    )}
                  </button>
                  
                  <div className="flex justify-between items-center text-sm mt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Change email address
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      disabled={timer > 0 || loading}
                      className={`font-medium ${
                        timer > 0 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-emerald-600 hover:text-emerald-700"
                      }`}
                    >
                      {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailChangeModal;
