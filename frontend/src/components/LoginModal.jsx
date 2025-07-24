import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const LoginModal = ({ show, onClose, onLoginSuccess }) => {
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
    if (!show) {
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        phone: "",
        agree: false,
      });
      setIsSignup(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isSignup && !form.agree) {
      alert("Please agree to the terms");
      return;
    }

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    onLoginSuccess(form.name || "User");
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          <button className="w-full border rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:shadow">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button className="w-full border rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:shadow">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 bg-white rounded-full ring-1 ring-gray-300" />
            Continue with Facebook
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm font-bold uppercase mb-4">OR</div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {isSignup && (
            <>
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-4 py-2 text-gray-500" required>
                <option value="" disabled hidden>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex items-center border rounded px-4 py-2">
                <img src="https://flagcdn.com/w40/pk.png" alt="PK Flag" className="w-5 h-4 mr-2 rounded-sm ring-1 ring-gray-300 bg-white" />
                <span className="text-sm mr-2">+92</span>
                <input type="tel" name="phone" placeholder="3001234567" value={form.phone} onChange={handleChange} className="flex-1 outline-none" required />
              </div>
              <label className="flex items-start space-x-2 text-sm">
                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="mt-1" required />
                <span>
                  I agree to the{" "}
                  <span className="text-emerald-600 underline cursor-pointer font-medium">
                    AsaanGhar Terms and Conditions
                  </span>
                </span>
              </label>
            </>
          )}

          {!isSignup && (
            <>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
            </>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2 rounded-full font-semibold shadow hover:shadow-lg">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span className="text-emerald-600 font-medium cursor-pointer" onClick={() => setIsSignup(false)}>Login</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span className="text-emerald-600 font-medium cursor-pointer" onClick={() => setIsSignup(true)}>Sign Up</span>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
