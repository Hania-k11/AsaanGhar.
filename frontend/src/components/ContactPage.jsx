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
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null); // Clear previous status

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // In a real application, you'd send formData to your backend here:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error('Something went wrong sending your message.');
      // }

      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form on success
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Framer Motion Variants ---
  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const headingIn = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  // Improved Input Component for reusability and consistent styling
  const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    rows,
    icon: Icon, // New prop for icon
  }) => (
    <motion.div variants={fadeInUp} className="relative"> {/* Added relative for icon positioning */}
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
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
          className={`w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 focus:placeholder-transparent resize-y min-h-[120px] ${Icon ? 'pl-12' : ''}`} // Added pl-12 for icon
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
          className={`w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 focus:placeholder-transparent ${Icon ? 'pl-12' : ''}`} // Added pl-12 for icon
        />
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center py-28 px-4 sm:px-6 lg:px-8 font-inter overflow-hidden" // Added overflow-hidden for subtle background animation
      initial="hidden"
      animate="visible"
      variants={staggeredContainer}
    >
      {/* Subtle background circles for visual interest */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob origin-bottom-left"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 origin-top-right"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 origin-bottom-right"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10"> {/* Added relative z-10 to keep content above background */}
        {/* Hero Section */}
        <motion.div variants={fadeInUp} className="text-center mb-20 px-4">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-emerald-800 mb-6 drop-shadow-lg"
            variants={headingIn}
          >
            We'd Love to Hear From You
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={textIn}
          >
            Whether you're looking to buy, sell, or simply have a question about
            real estate, our team is ready to assist. Reach out and let's start
            a conversation!
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-transform duration-500 ease-out-back hover:scale-[1.01] border border-emerald-100 relative overflow-hidden group" // Added group for hover effects on pseudo-elements
            variants={fadeInUp}
          >
            {/* Subtle radial gradient background effect - Adjusted for more depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white/50 rounded-3xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Overlay for subtle shimmer effect on hover */}
            <div className="absolute inset-0 rounded-3xl z-0 pointer-events-none transform scale-150 opacity-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"></div>


            <h2 className="text-3xl font-bold text-emerald-700 mb-10 border-b-2 border-emerald-100 pb-5">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <InputField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                icon={null} // Removed icon from name field for cleaner look
              />
              <InputField
                label="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                icon={EnvelopeIcon} // Added email icon
              />
              <InputField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Regarding property inquiry"
                icon={null} // Removed icon from subject for cleaner look
              />
              <InputField
                label="Your Message"
                name="message"
                type="textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your needs..."
                rows="6"
                required
                icon={null} // Removed icon from message for cleaner look
              />
              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold text-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-emerald-300
                  ${
                    isSubmitting
                      ? "bg-emerald-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  }`}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
                variants={fadeInUp}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-4 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <PaperAirplaneIcon className="ml-3 h-5 w-5 -rotate-12 transition-transform duration-300 group-hover:rotate-0" /> {/* Added slight rotation and group hover */}
                  </>
                )}
              </motion.button>

              {submissionStatus === "success" && (
                <motion.div
                  className="mt-6 p-4 bg-green-100 rounded-xl text-green-800 font-medium text-center shadow-inner flex items-center justify-center space-x-2 border border-green-200"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <span>Your message has been sent successfully!</span>
                </motion.div>
              )}
              {submissionStatus === "error" && (
                <motion.div
                  className="mt-6 p-4 bg-red-100 rounded-xl text-red-800 font-medium text-center shadow-inner flex items-center justify-center space-x-2 border border-red-200"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                  <span>Failed to send message. Please try again later.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info + Map */}
          <div className="space-y-12">
            {/* Contact Information Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 transform transition-transform duration-500 ease-out-back hover:scale-[1.01] border border-emerald-100 relative overflow-hidden group" // Added group
              variants={fadeInUp}
            >
              {/* Subtle radial gradient background effect - Adjusted */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/50 rounded-3xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Overlay for subtle shimmer effect on hover */}
              <div className="absolute inset-0 rounded-3xl z-0 pointer-events-none transform scale-150 opacity-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"></div>


              <h2 className="text-3xl font-bold text-emerald-700 mb-10 border-b-2 border-emerald-100 pb-5">
                Our Details
              </h2>
              <div className="space-y-8 text-gray-700 text-lg">
                <motion.div variants={fadeInUp} className="flex items-start group relative">
                  <MapPinIcon className="h-7 w-7 text-emerald-600 mr-5 mt-1 flex-shrink-0 group-hover:text-emerald-800 transition-colors duration-300" />
                  <p className="flex-grow">
                    <strong>Address:</strong> Plot #123, Scheme 33, Karachi,
                    Pakistan
                  </p>
                  {/* Subtle underline on hover */}
                  <span className="absolute bottom-0 left-12 h-0.5 bg-emerald-300 w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center group relative">
                  <PhoneIcon className="h-7 w-7 text-emerald-600 mr-5 group-hover:text-emerald-800 transition-colors duration-300" />
                  <p>
                    <strong>Phone:</strong> <a href="tel:+92090078601" className="hover:text-emerald-700 transition-colors duration-300">+92 090078601</a>
                  </p>
                  <span className="absolute bottom-0 left-12 h-0.5 bg-emerald-300 w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center group relative">
                  <EnvelopeIcon className="h-7 w-7 text-emerald-600 mr-5 group-hover:text-emerald-800 transition-colors duration-300" />
                  <p>
                    <strong>Email:</strong> <a href="mailto:support@asaanghar.pk" className="hover:text-emerald-700 transition-colors duration-300">support@asaanghar.pk</a>
                  </p>
                  <span className="absolute bottom-0 left-12 h-0.5 bg-emerald-300 w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center group relative">
                  <ClockIcon className="h-7 w-7 text-emerald-600 mr-5 group-hover:text-emerald-800 transition-colors duration-300" />
                  <p>
                    <strong>Hours:</strong> Mon - Sat: 9:00am – 6:00pm
                  </p>
                  <span className="absolute bottom-0 left-12 h-0.5 bg-emerald-300 w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
                </motion.div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 transform transition-transform duration-500 ease-out-back hover:scale-[1.01] relative"
              variants={fadeInUp}
            >
              {/* Added a subtle overlay for map on hover */}
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center text-white text-lg font-bold">
                <p>Click to view larger map</p>
              </div>
              <iframe
                title="Asaan Ghar Location"
                className="w-full h-[400px] md:h-[450px] lg:h-[500px]"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.915729227581!2d67.12651167510793!3d24.931818377884175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33887c3a0b4d1%3A0x6a1c5d9e5b8a924a!2sScheme%2033%2C%20Karachi%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1678280000000!5m2!1sen!2sus" // Replaced placeholder with a real Karachi Scheme 33 embed URL
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;