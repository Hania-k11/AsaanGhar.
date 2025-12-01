import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3001/api";

const VerificationModal = ({ show, onClose, email }) => {
  const { success, error } = useToast();
  const { loginuser } = useAuth();
  
  const [emailCode, setEmailCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailInputRefs = useRef([]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index, value, codeArray, setCodeArray, inputRefs) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);

    // Auto-focus next input with smooth transition
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.select();
      }, 0);
    }
  };

  const handleKeyDown = (index, e, codeArray, setCodeArray, inputRefs) => {
    if (e.key === "Backspace" && !codeArray[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
      }, 0);
    }
  };

  const handlePaste = (e, setCodeArray, inputRefs) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
      setCodeArray(newCode);
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailCodeString = emailCode.join("");

    if (emailCodeString.length !== 6) {
      error("Please enter the email verification code");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/verify-signup`,
        {
          email,
          emailCode: emailCodeString,
        },
        { withCredentials: true }
      );

      success("Account created successfully! Welcome to AsaanGhar!");
      
      // Refresh auth state
      await loginuser();
      
      // Close modal
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Verification failed. Please try again.";
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      await axios.post(`${API_BASE_URL}/auth/resend-code`, {
        email,
      });

      success("Verification code resent successfully!");
      setResendCooldown(60); // 60 second cooldown
      
      // Clear existing code
      setEmailCode(["", "", "", "", "", ""]);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to resend code. Please try again.";
      error(msg);
    }
  };

  const CodeInput = ({ label, codeArray, setCodeArray, inputRefs, icon }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="flex gap-2 justify-center">
        {codeArray.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value, codeArray, setCodeArray, inputRefs)}
            onKeyDown={(e) => handleKeyDown(index, e, codeArray, setCodeArray, inputRefs)}
            onPaste={(e) => handlePaste(e, setCodeArray, inputRefs)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
          />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 p-1 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="px-6 sm:px-8 py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-emerald-600 mb-2">Verify Your Account</h2>
                <p className="text-sm text-gray-600">
                  We've sent a verification code to:
                </p>
                <p className="text-sm font-medium text-gray-800 mt-1">{email}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <CodeInput
                  label="Email Verification Code"
                  codeArray={emailCode}
                  setCodeArray={setEmailCode}
                  inputRefs={emailInputRefs}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Verify Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-emerald-600 font-medium text-sm hover:text-emerald-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 text-center">
                  ⏱️ Code expires in 10 minutes
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationModal;