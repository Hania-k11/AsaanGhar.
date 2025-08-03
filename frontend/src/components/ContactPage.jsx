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
import { FaChevronDown } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

// --- Constants ---

const contactDetails = [
  {
    icon: MapPinIcon,
    text: "Plot #123, Scheme 33, Karachi, Pakistan",
  },
  {
    icon: PhoneIcon,
    text: "+92 0900 78601",
    href: "tel:+92090078601",
  },
  {
    icon: EnvelopeIcon,
    text: "support@asaanghar.pk",
    href: "mailto:support@asaanghar.pk",
  },
  {
    icon: ClockIcon,
    text: "Mon - Sat: 9:00am – 6:00pm",
  },
];

const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
];

const faqs = [
  { question: "Is there any commission or hidden fee?", answer: "Nope. AsaanGhar is 100% commission-free. All listings are posted directly by verified owners, so you don't have to worry about any hidden charges." },
  { question: "How do I list my property on your platform?", answer: "You can easily list your property for free by creating an account and filling out our simple property submission form. Our team will review it and make it live within 24 hours." },
  { question: "How can I contact the property owner directly?", answer: "Each property listing includes the direct contact details of the owner, such as their phone number and email. We don't act as a middleman, so you can communicate with them directly." },
  { question: "What kind of verification process do you have?", answer: "We have a multi-step verification process. We verify the property owner's identity and the details of the property to ensure all listings are legitimate and trustworthy." },
  { question: "Is the platform available on mobile devices?", answer: "Absolutely! Our entire website is fully responsive and optimized for mobile phones and tablets, so you can browse properties on the go without any issues." },
  { question: "What if I face an issue with a listing or an owner?", answer: "Your satisfaction and security are our top priorities. If you encounter any problems, please contact our support team immediately using the form above or the contact details provided. We will investigate the issue promptly." },
  { question: "Can I get help with property documentation?", answer: "While we do not provide legal services directly, we can connect you with trusted partners who specialize in property documentation and legal advice. Just let us know your requirements through the contact form." },
  { question: "How do you ensure the privacy of my data?", answer: "We take your privacy very seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent." },
  { question: "What areas do you cover?", answer: "We currently focus on properties in Karachi, Pakistan, with plans to expand to other major cities soon. Keep an eye on our website for updates on new locations!" },
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
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// --- Custom Components ---

const WaveSeparator = () => (
  <div className="relative w-full overflow-hidden mt-2">
    <svg viewBox="0 0 1440 100" className="w-full h-auto text-emerald-100 fill-current">
      <path
        d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 C1400,100 1440,50 1440,50 L1440,100 L0,100 L0,50 Z"
      ></path>
    </svg>
  </div>
);

const InputField = ({ name, type = "text", value, onChange, placeholder, required = false, rows }) => (
  <motion.div variants={fadeInUp} className="relative">
    <label htmlFor={name} className="sr-only">{placeholder}</label>
    {type === "textarea" ? (
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required} className="w-full px-5 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400 text-gray-800 resize-y min-h-[120px]" />
    ) : (
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-5 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-400 text-gray-800" />
    )}
  </motion.div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'success', 'error', 'invalid_email'

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSubmissionStatus('invalid_email');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      await new Promise(res => setTimeout(res, 2000)); // Simulate API call
      setSubmissionStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 flex flex-col items-center justify-center h-full">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-emerald-800">Message Sent!</h3>
        <p className="text-gray-600 mt-2">Thank you for reaching out. We'll get back to you shortly.</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp}>
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" required />
        {submissionStatus === 'invalid_email' && <p className="text-red-500 text-sm -mt-3">Please enter a valid email address.</p>}
        <InputField name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
        <InputField name="message" type="textarea" value={formData.message} onChange={handleChange} placeholder="Tell us about your query..." rows={5} required />
        <motion.button type="submit" className={`w-full flex items-center justify-center px-6 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"}`} disabled={isSubmitting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <PaperAirplaneIcon className="ml-3 h-5 w-5 -rotate-12" />
            </>
          )}
        </motion.button>
        {submissionStatus === "error" && (
            <p className="text-red-600 flex items-center justify-center mt-4">
              <XCircleIcon className="h-5 w-5 mr-2" /> Failed to send message. Please try again.
            </p>
        )}
      </form>
    </motion.div>
  );
};

const FAQItem = ({ faq, index, activeFAQ, toggleFAQ }) => {
  const isOpen = index === activeFAQ;
  return (
    <motion.div variants={fadeInUp} className="border-b border-emerald-100 pb-4 last:border-b-0">
      <button className="flex justify-between items-center w-full text-left text-emerald-800 font-semibold text-lg hover:text-emerald-600 transition-colors" onClick={() => toggleFAQ(index)}>
        <span>{faq.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FaChevronDown className="ml-2 transition-transform duration-300" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
            <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Page Component ---

const ContactPage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => setActiveFAQ(prev => (prev === index ? null : index));

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-white font-inter pb-20"
      initial="hidden" animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {/* Header */}
      <div className="relative text-center max-w-3xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
       <motion.h1
  variants={fadeInUp}
  className="text-5xl sm:text-6xl font-bold text-emerald-900 mb-4 text-center"
>
  Get In Touch
</motion.h1>

        <motion.p variants={fadeInUp} className="text-xl text-gray-600 leading-relaxed">
          Whether you have a question, need assistance, or just want to give us feedback, our team is ready to help.
        </motion.p>
      </div>

      {/* Wave Separator */}
      <WaveSeparator />

      {/* Support Options Boxes */}
      <motion.div
        className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-emerald-100 shadow-md p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
          <PhoneIcon className="h-10 w-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-emerald-800 mb-2">Talk to our representative</h3>
          <p className="text-gray-600 mb-4">
            Interested in AsaanGhar? Just pick up the phone to chat with our
            representative.
          </p>
          <a
            href="tel:+923327923489"
            className="text-emerald-700 font-semibold underline hover:text-emerald-900"
          >
            +92 332 7923489
          </a>
        </motion.div>
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-emerald-100 shadow-md p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
          <EnvelopeIcon className="h-10 w-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-emerald-800 mb-2">
            Contact Customer Support
          </h3>
          <p className="text-gray-600 mb-6">
            Need help with something? Our team is here for you.
          </p>
          <a
            href="mailto:support@asaanghar.pk"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
          >
            Contact Support
          </a>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Contact Details Column */}
        <motion.div className="lg:col-span-2 space-y-8" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Our Details</h2>
            <ul className="space-y-5 text-gray-700 text-base">
              {contactDetails.map((item, index) => (
                <motion.li key={index} variants={fadeInUp} className="flex items-start">
                  <item.icon className="h-6 w-6 text-emerald-600 mr-4 mt-1 flex-shrink-0" />
                  {item.href ? (
                    <a href={item.href} className="hover:text-emerald-700 hover:underline">{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-emerald-800 mb-6">Follow Us</h3>
            <div className="flex space-x-6 text-gray-500">
              {socialLinks.map((link, index) => (
                <motion.a key={index} href={link.href} aria-label={link.label} className="hover:text-emerald-600 transition-colors duration-300" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <link.icon className="h-8 w-8" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form Column */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-emerald-100 hover:shadow-2xl transition-shadow duration-300">
            <ContactForm />
        </div>
      </div>

      {/* Map Section */}
      <motion.div variants={fadeInUp} className="mt-6 max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-emerald-100">
          <iframe
            title="Our Location in Gulzar-e-Hijri, Scheme 33"
            className="w-full h-96 border-0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3375806666145!2d67.11956557451662!3d24.921319741369348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb338876c43d0e5%3A0x51c5d99645228543!2sGulzar%20E%20Hijri%20Scheme%2033%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1709292882772!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={staggerContainer} className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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