// components/SignupForm.jsx
import { useState } from "react";

const SignupForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!form.agree) {
      alert("Please agree to the terms");
      return;
    }
    if (!form.email || !form.password) {
      alert("Email and Password are required");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
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
          <span className="text-emerald-600 underline cursor-pointer font-medium">AsaanGhar Terms and Conditions</span>
        </span>
      </label>

      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2 rounded-full font-semibold shadow hover:shadow-lg">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
