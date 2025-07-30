import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Motion variants
  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const headingIn = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const textIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.7, ease: "easeOut" },
    },
  };

  // Input Component
  const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    rows,
    icon: Icon,
  }) => (
    <motion.div variants={fadeInUp} className="relative">
      <label htmlFor={name} className="sr-only">{label}</label>
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      )}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={`w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400 text-gray-800 resize-y min-h-[120px] ${Icon ? "pl-12" : ""}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400 text-gray-800 ${Icon ? "pl-12" : ""}`}
        />
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center py-20 sm:py-28 font-inter overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={staggeredContainer}
    >
      {/* Decorative Background Circles */}
      <div className="absolute top-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div variants={fadeInUp} className="text-center mb-12 sm:mb-20">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-emerald-800 mb-4 sm:mb-6 drop-shadow-lg"
            variants={headingIn}
          >
            We'd Love to Hear From You
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={textIn}
          >
            Whether you're looking to buy, sell, or simply have a question about real estate, our team is ready to assist. Reach out and let's start a conversation!
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-emerald-100 relative overflow-hidden group"
            variants={fadeInUp}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6 sm:mb-10 border-b-2 border-emerald-100 pb-4">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <InputField label="Your Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              <InputField label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required icon={EnvelopeIcon} />
              <InputField label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Regarding property inquiry" />
              <InputField label="Your Message" name="message" type="textarea" value={formData.message} onChange={handleChange} placeholder="Tell us more about your needs..." rows="6" required />

              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-lg sm:text-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                }`}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-4 h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <PaperAirplaneIcon className="ml-3 h-5 w-5 -rotate-12" />
                  </>
                )}
              </motion.button>

              {submissionStatus === "success" && (
                <motion.div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-100 rounded-xl text-green-800 text-sm sm:text-base flex items-center justify-center space-x-2 border border-green-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  <span>Your message has been sent successfully!</span>
                </motion.div>
              )}
              {submissionStatus === "error" && (
                <motion.div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 rounded-xl text-red-800 text-sm sm:text-base flex items-center justify-center space-x-2 border border-red-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  <span>Failed to send message. Please try again later.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <div className="space-y-8 sm:space-y-12">
            {/* Info */}
            <motion.div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-14 border border-emerald-100" variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6 sm:mb-10 border-b-2 border-emerald-100 pb-4">Our Details</h2>
              <div className="space-y-5 sm:space-y-8 text-gray-700 text-sm sm:text-base md:text-lg">
                <div className="flex items-start"><MapPinIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 mr-4 sm:mr-5" /><p><strong>Address:</strong> Plot #123, Scheme 33, Karachi, Pakistan</p></div>
                <div className="flex items-center"><PhoneIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 mr-4 sm:mr-5" /><p><strong>Phone:</strong> <a href="tel:+92090078601" className="hover:text-emerald-700">+92 090078601</a></p></div>
                <div className="flex items-center"><EnvelopeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 mr-4 sm:mr-5" /><p><strong>Email:</strong> <a href="mailto:support@asaanghar.pk" className="hover:text-emerald-700">support@asaanghar.pk</a></p></div>
                <div className="flex items-center"><ClockIcon className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 mr-4 sm:mr-5" /><p><strong>Hours:</strong> Mon - Sat: 9:00am – 6:00pm</p></div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-emerald-100" variants={fadeInUp}>
              <iframe
                title="Asaan Ghar Location"
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]"
                src="https://www.google.com/maps/embed?pb=!1m18..."
                allowFullScreen
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
