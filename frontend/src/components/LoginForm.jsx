// components/LoginForm.jsx
import { useState } from "react";

const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Email and Password are required");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2 rounded-full font-semibold shadow hover:shadow-lg">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
