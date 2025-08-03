import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginModal = () => {
  const {
    userDetails,
    setUserDetails,
    showLoginModal: show,
    setShowLoginModal: setShow,
  } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    agree: false,
  });

  useEffect(() => {
    if (show) {
      const style = document.createElement("style");
      style.id = "login-modal-scrollbar-styles";
      style.innerHTML = `
        .modal-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll-area::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 100vh;
        }
        .modal-scroll-area::-webkit-scrollbar-thumb {
          background-color: #10b981;
          border-radius: 100vh;
          border: 2px solid #f1f5f9;
        }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover {
          background-color: #059669;
        }
        .modal-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById("login-modal-scrollbar-styles");
        if (existing) document.head.removeChild(existing);
      };
    }
  }, [show]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", show);
    return () => document.body.classList.remove("overflow-hidden");
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    if (isSignup) {
      alert("Signup logic not implemented yet");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/users/login", {
        email: form.email,
        password: form.password,
      });

      const user = res.data.user;
      setUserDetails(user);
      alert(`Welcome, ${user.name}`);
      setShow(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  if (!show) return null;

  const inputBaseClass =
    "w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 md:p-8 overflow-hidden"
    >
    <motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="relative bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-xl max-h-[90vh] overflow-hidden"
  onClick={(e) => e.stopPropagation()}
>
  <button
    onClick={() => setShow(false)}
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
  >
    <X size={24} />
  </button>

  {/* This is the scrollable area */}
<div className="modal-scroll-area overflow-y-auto max-h-[80vh] px-6 sm:px-8 py-6">
    <h2 className="text-xl sm:text-2xl font-bold text-center text-emerald-600 mb-6">
      {isSignup ? "Create an Account" : "Welcome Back"}
    </h2>

    <div className="flex flex-col gap-3 mb-4">
      <button className="w-full border border-gray-500 rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:shadow transition-shadow duration-200">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
          <button className="w-full border rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:shadow transition-shadow duration-200">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5 bg-white rounded-full ring-1 ring-gray-300"
            />
            Continue with Facebook
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm font-bold uppercase mb-4 flex items-center">
          <span className="flex-grow h-px bg-gray-300 mr-2"></span>
          OR
          <span className="flex-grow h-px bg-gray-300 ml-2"></span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
   <div className="relative">
  <select
    name="gender"
    value={form.gender}
    onChange={handleChange}
    className={`w-full border border-gray-700 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow ${form.gender === "" ? "text-gray-400" : "text-gray-900"}`}
    required
  >
    <option value="" disabled hidden>
      Select Gender
    </option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
    <svg 
      className="h-4 w-4 text-gray-700" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.998l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>
</div>
              <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
                <img
                  src="https://flagcdn.com/w40/pk.png"
                  alt="PK Flag"
                  className="w-5 h-4 mr-2 rounded-sm ring-1 ring-gray-300 bg-white"
                />
                <span className="text-sm mr-2">+92</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="3001234567"
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
              <label className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 accent-emerald-600"
                  required
                />
                <span>
                  I agree to the AsaanGhar {" "}
                  <span className="text-emerald-600 underline cursor-pointer font-medium hover:text-emerald-800 transition-colors">
                   Terms and Conditions
                  </span>
                </span>
              </label>
            </>
          )}

          {!isSignup && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputBaseClass}
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2 rounded-full font-semibold shadow hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-800 transition-colors"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-800 transition-colors"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
