import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent. We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="pt-28 pb-20 px-4 container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-600 mb-2">Get in Touch</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Whether you're a buyer, seller, or renter, we're here to answer all your questions.
          Fill out the form below or reach out using the contact details.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="6"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info + Map */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-2"><strong>📍 Address:</strong> Plot #123, Scheme 33, Karachi, Pakistan</p>
            <p className="text-gray-700 mb-2"><strong>📞 Phone:</strong> +92 090078601</p>
            <p className="text-gray-700 mb-2"><strong>📧 Email:</strong> support@asaanghar.pk</p>
            <p className="text-gray-700"><strong>🕐 Hours:</strong> Mon - Sat: 9:00am – 6:00pm</p>
          </div>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="Asaan Ghar Location"
              className="w-full h-64 md:h-72 lg:h-80"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.2334884090533!2d67.11777177522698!3d24.95816947786571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb3472ede1b72d7%3A0x91989db835f0dfd3!2sShahjee%20Collegiate%20Madras%20Chowk%20Campus!5e0!3m2!1sen!2s!4v1752527499240!5m2!1sen!2s"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
