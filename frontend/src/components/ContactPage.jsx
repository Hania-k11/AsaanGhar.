import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FaChevronDown, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import emailjs from "@emailjs/browser";
// The toast library is no longer needed with the new UI logic, so it is commented out.
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// --- Constants ---

const contactDetails = [
  { icon: MapPinIcon, text: "Plot #123, Scheme 33, Karachi, Pakistan" },
  { icon: PhoneIcon, text: "+92 332 7923489", href: "tel:+923327923489" },
  { icon: EnvelopeIcon, text: "asaanghar.pk@gmail.com", href: "mailto:asaanghar.pk@gmail.com" },
  { icon: ClockIcon, text: "Mon - Sat: 9:00am – 6:00pm" },
];

const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/AsaanGhar.pk/" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/asaanghar.pk/" },
  { icon: FaEnvelope, label: "Email", href: "mailto:asaanghar.pk@gmail.com" },
];

const faqs = [
  { question: "Is there any commission or hidden fee?", answer: "Nope. AsaanGhar is 100% commission-free, ensuring you get the best value without extra costs." },
  { question: "How do I list my property on your platform?", answer: "You can easily list your property for free by creating an account and following our simple step-by-step process. No charges apply for basic listings." },
  { question: "How can I contact the property owner directly?", answer: "Each property listing includes the direct contact information of the owner, allowing you to communicate without any intermediary." },
  { question: "What kind of verification process do you have?", answer: "We have a multi-step verification process for both properties and owners to maintain a trustworthy and secure environment." },
  { question: "Is the platform available on mobile devices?", answer: "Absolutely! Our entire website is fully responsive and optimized for mobile devices, so you can browse properties on the go." },
  { question: "What if I face an issue with a listing or an owner?", answer: "Your satisfaction and security are our top priorities. You can report any issues to our support team, and we will investigate promptly." },
  { question: "Can I get help with property documentation?", answer: "While we do not provide legal services directly, we can guide you to trusted legal professionals who can assist with property documentation." },
  { question: "How do you ensure the privacy of my data?", answer: "We take your privacy very seriously. All personal data is encrypted and handled in strict accordance with our privacy policy." },
  { question: "What areas do you cover?", answer: "We currently focus on properties in Karachi, Pakistan, with plans to expand to other major cities in the future." },
];

// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// --- Components ---

const WaveSeparator = () => (
  <div className="relative w-full overflow-hidden mt-2">
    <svg viewBox="0 0 1440 100" className="w-full h-auto text-emerald-100 fill-current">
      <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 C1400,100 1440,50 1440,50 L1440,100 L0,100 L0,50 Z" />
    </svg>
  </div>
);

const InputField = ({ name, type = "text", value, onChange, placeholder, required = false, rows }) => (
  <motion.div variants={fadeInUp} className="relative">
    {type === "textarea" ? (
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required}
        className="w-full px-5 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-800 resize-y min-h-[120px]" />
    ) : (
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full px-5 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-800" />
    )}
  </motion.div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSubmissionStatus("invalid_email");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      // The credentials you provided
      const serviceId = "service_3drpirm";
      const templateId = "template_6lrwlze";
      const publicKey = "D2fBmXS-nbsvb1U1L";

      await emailjs.send(
        serviceId, 
        templateId,
        {
          // The variable names below MUST match the ones in your EmailJS template.
          // Your code snippet used these specific names.
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      );
      
      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email send failed:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 flex flex-col items-center justify-center h-full">
        <CheckCircleIcon className="h-16 w-16 text-emerald-500 mb-4" />
        <h3 className="text-2xl font-bold text-emerald-800">Message Sent!</h3>
        <p className="text-gray-600 mt-2">Thanks for reaching out. We'll reply soon.</p>
        <button onClick={() => setSubmissionStatus(null)} className="mt-6 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-md hover:bg-emerald-700 transition">
          Send another message
        </button>
      </motion.div>
    );
  }

  if (submissionStatus === "error") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 flex flex-col items-center justify-center h-full">
        <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-red-800">Oops, something went wrong.</h3>
        <p className="text-gray-600 mt-2">We couldn't send your message. Please try again later.</p>
        <button onClick={() => setSubmissionStatus(null)} className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition">
          Try again
        </button>
      </motion.div>
    );
  }

  // Render the form if no status is set or if there was an invalid email
  return (
    <motion.div variants={fadeInUp}>
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">Send us a Message</h2>
      {submissionStatus === "invalid_email" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-4">
          Please enter a valid email address.
        </motion.p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" required />
        <InputField name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
        <InputField name="message" type="textarea" value={formData.message} onChange={handleChange} placeholder="Tell us your query..." rows={5} required />
        <motion.button type="submit" className={`w-full flex items-center justify-center px-6 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"}`} disabled={isSubmitting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <PaperAirplaneIcon className="ml-3 h-5 w-5 -rotate-12" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

const FAQItem = ({ faq, index, activeFAQ, toggleFAQ }) => {
  const isOpen = index === activeFAQ;
  return (
    <motion.div variants={fadeInUp} className="border-b border-emerald-100 py-4">
      <button className="flex justify-between items-center w-full text-left text-emerald-800 font-semibold text-lg hover:text-emerald-600 transition" onClick={() => toggleFAQ(index)}>
        <span>{faq.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FaChevronDown className="ml-2" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: "1rem" }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
            <p className="text-gray-600">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Page Component ---

const ContactPage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => setActiveFAQ((prev) => (prev === index ? null : index));

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pb-20" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
      <div className="text-center max-w-3xl mx-auto pt-24 px-4">
        <motion.h1 variants={fadeInUp} className="text-5xl font-inter font-bold text-emerald-700 mb-4">Get In Touch</motion.h1>
        <motion.p variants={fadeInUp} className="text-xl text-gray-600">Have questions? Our team is ready to help.</motion.p>
      </div>

      <WaveSeparator />

      <motion.div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4" variants={staggerContainer}>
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-emerald-100 shadow-md p-8 text-center">
          <PhoneIcon className="h-10 w-10 text-emerald-600 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-emerald-800">Talk to our representative</h3>
          <p className="text-gray-600 mb-4">Want to chat? We're here to talk anytime.</p>
          <a href="tel:+923327923489" className="text-emerald-700 font-semibold underline hover:text-emerald-900">
            +92 332 7923489
          </a>
        </motion.div>
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-emerald-100 shadow-md p-8 text-center">
          <EnvelopeIcon className="h-10 w-10 text-emerald-600 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-emerald-800">Contact Customer Support</h3>
          <p className="text-gray-600 mb-6">Need help with something?</p>
          <a href="mailto:asaanghar.pk@gmail.com" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all">
            Contact Support
          </a>
        </motion.div>
      </motion.div>

      <div className="py-8 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
        <motion.div className="lg:col-span-2 space-y-8" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Our Details</h2>
            <ul className="space-y-5 text-gray-700">
              {contactDetails.map((item, index) => (
                <motion.li key={index} variants={fadeInUp} className="flex items-start">
                  <item.icon className="h-6 w-6 text-emerald-600 mr-4 mt-1" />
                  {item.href ? <a href={item.href} className="hover:text-emerald-700 hover:underline">{item.text}</a> : <span>{item.text}</span>}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
            <h3 className="text-3xl font-bold text-emerald-800 mb-6">Follow Us</h3>
            <div className="flex space-x-6 text-gray-500">
              {socialLinks.map((link, index) => (
                <motion.a key={index} href={link.href} aria-label={link.label} className="hover:text-emerald-600 transition" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <link.icon className="h-8 w-8" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <ContactForm />
        </div>
      </div>

      <motion.div variants={fadeInUp} className="mt-6 max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-emerald-100">
        <iframe title="Our Location in Scheme 33" className="w-full h-96 border-0" loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3375806666145!2d67.11956557451662!3d24.921319741369348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb338876c43d0e5%3A0x51c5d99645228543!2sGulzar%20E%20Hijri%20Scheme%2033%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1709292882772!5m2!1sen!2s"
          allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      </motion.div>

      <motion.div variants={staggerContainer} className="mt-12 max-w-4xl mx-auto px-4">
        <motion.h2 variants={fadeInUp} className="text-4xl font-extrabold text-emerald-900 mb-8 text-center">
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} activeFAQ={activeFAQ} toggleFAQ={toggleFAQ} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
