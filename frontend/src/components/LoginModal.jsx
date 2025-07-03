import { useState } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

const LoginModal = ({ show, onClose }) => {
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSignup && form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (isSignup && !form.agree) {
      alert("You must agree to the terms and conditions")
      return
    }

    // Simulate form submission
    console.log("Form submitted:", form)
    alert(`${isSignup ? "Signup" : "Login"} Successful`)
    onClose()
  }

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <motion.div
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {isSignup && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                required
              />

              <label className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <span>
                  I have read and agree to{" "}
                  <span className="text-emerald-600 underline cursor-pointer">
                    AsaanGhar Terms and Conditions
                  </span>
                </span>
              </label>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2 rounded-full font-medium shadow hover:shadow-xl"
          >
            {isSignup ? "Continue" : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-emerald-600 font-medium cursor-pointer"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-emerald-600 font-medium cursor-pointer"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginModal
