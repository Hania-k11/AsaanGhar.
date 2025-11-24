/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Terms from "./Terms"; 
import { useToast } from "./ToastProvider";
import VerificationModal from "./VerificationModal";

import { GoogleLogin } from '@react-oauth/google'; 

const API_BASE_URL = "http://localhost:3001/api"; 

const LoginModal = () => {
   const { success, error, warning, info } = useToast();
   
  const {
    loginuser,
    showLoginModal: show,
    setShowLoginModal: setShow,
  } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [showTerms, setShowTerms] = useState(false); 
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState({ email: "", phone: "" });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    jobTitle: "",
    agree: false,
  });

  // Effect for managing scrollbar styles
  useEffect(() => {
    if (show) {
      const style = document.createElement("style");
      style.id = "login-modal-scrollbar-styles";
      style.innerHTML = `
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 100vh; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 100vh; border: 2px solid #f1f5f9; }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .modal-scroll-area { scrollbar-width: thin; scrollbar-color: #10b981 #f1f5f9; }
      `;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById("login-modal-scrollbar-styles");
        if (existing) document.head.removeChild(existing);
      };
    }
  }, [show]);

  // Effect for managing body overflow
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", show || showTerms || showVerification);
    return () => document.body.classList.remove("overflow-hidden");
  }, [show, showTerms, showVerification]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //  GOOGLE LOGIN SUCCESS HANDLER
  const handleGoogleSuccess = async (response) => {
    const idToken = response.credential;
    
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/google-login`, {
        token: idToken,
      }, {
        withCredentials: true 
      });
      
      success(`Welcome ${res.data.user.first_name || res.data.user.email}!`);
      setShow(false); 
      loginuser();

    } catch (err) {
      const msg = err.response?.data?.error || "Google login failed on server.";
      console.error("Google Login Server Error:", msg);
      error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignup) {
      // Signup validation
      if (!form.firstName || !form.lastName || !form.email || !form.password || !form.gender || !form.phone) {
        error("Please fill in all required fields");
        return;
      }
      
      if (form.password !== form.confirmPassword) {
        error("Passwords do not match.");
        return;
      }
      
      if (!form.agree) {
        error("You must agree to the Terms and Conditions to sign up.");
        return;
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          gender: form.gender,
          phone: form.phone,
          jobTitle: form.jobTitle,
        }, {
          withCredentials: true
        });

        success("Verification codes sent! Please check your email and phone.");
        setVerificationData({ email: form.email, phone: form.phone });
        setShowVerification(true);
        setShow(false);
      } catch (err) {
        const msg = err.response?.data?.error || "Signup failed. Please try again.";
        error(msg);
      }
      return;
    }

    // Login logic
    if (!form.email || !form.password) {
      error("Please enter email and password");
      return;
    }

    try {
      const res = await loginuser(form.email, form.password);
      if (res.success) {
        success(`Welcome ${res.user.first_name || res.user.email}!`);
        setShow(false);
      } else {
        error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      error("Something went wrong, please try again.");
    }
  };
  
  const inputBaseClass =
    "w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            onClick={() => setShow(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 p-1 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="modal-scroll-area overflow-y-auto max-h-[90vh] px-6 sm:px-8 py-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-emerald-600 mb-6">
                  {isSignup ? "Create an Account" : "Welcome Back"}
                </h2>

                {/* Social Logins */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => error("Google login failed. Please try again.")}
                      useOneTap
                      theme="outline"
                      text="continue_with"
                      shape="pill"
                      width="300"
                    />
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm font-bold uppercase my-4 flex items-center">
                  <span className="flex-grow h-px bg-gray-300 mr-2"></span>
                  OR
                  <span className="flex-grow h-px bg-gray-300 ml-2"></span>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  
                  {isSignup && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className={inputBaseClass} required />
                        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className={inputBaseClass} required />
                      </div>
                      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputBaseClass} required />
                      <input type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} className={inputBaseClass} required />
                      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className={inputBaseClass} required />
                      
                      {/* Gender Select */}
                      <div className="relative">
                        <select name="gender" value={form.gender} onChange={handleChange} className={`w-full border rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow ${form.gender === "" ? "text-gray-400" : "text-gray-900"}`} required>
                          <option value="" disabled>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.998l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
                        <img src="https://flagcdn.com/w40/pk.png" alt="PK Flag" className="w-5 h-auto mr-2 rounded-sm" />
                        <span className="text-sm mr-2 text-gray-700">+92</span>
                        <input type="tel" name="phone" placeholder="3001234567" value={form.phone} onChange={handleChange} className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-400" pattern="[0-9]{10}" required />
                      </div>

                      {/* Job Title (Optional) */}
                      <input type="text" name="jobTitle" placeholder="Job Title (Optional)" value={form.jobTitle} onChange={handleChange} className={inputBaseClass} />

                      {/* Terms and Conditions Checkbox */}
                      <label className="flex items-start space-x-3 text-sm">
                        <input
                          type="checkbox"
                          name="agree"
                          checked={form.agree}
                          onChange={handleChange}
                          className="mt-1 accent-emerald-600"
                          required
                        />
                        <span className="text-gray-600">
                          I agree to the AsaanGhar{" "}
                          <span
                            className="text-emerald-600 underline cursor-pointer font-medium hover:text-emerald-800 transition-colors"
                            onClick={(e) => {
                              e.preventDefault(); 
                              setShowTerms(true);
                            }}
                          >
                            Terms and Conditions
                          </span>
                        </span>
                      </label>
                    </>
                  )}

                  {!isSignup && (
                    <>
                      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputBaseClass} required />
                      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputBaseClass} required />
                    </>
                  )}

                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
                    {isSignup ? "Sign Up" : "Login"}
                  </button>
                </form>

                {/* Toggle between Login and Signup */}
                <div className="text-center text-sm mt-6 text-gray-600">
                  {isSignup ? "Already have an account? " : "Don't have an account? "}
                  <span
                    className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-800 transition-colors"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? "Login" : "Sign Up"}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the Terms modal */}
      <Terms show={showTerms} onClose={() => setShowTerms(false)} />
      
      {/* Render the Verification modal */}
      <VerificationModal 
        show={showVerification} 
        onClose={() => setShowVerification(false)}
        email={verificationData.email}
        phone={verificationData.phone}
      />
    </>
  );
};

export default LoginModal;