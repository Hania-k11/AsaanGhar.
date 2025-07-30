// src/components/OverviewTab.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Info,
  Activity,
  Mail,
  Phone,
  ArrowRightCircle, // A more modern bullet icon
  Feather, // For bio section
  Contact, // For contact info section
} from "lucide-react"; // Make sure lucide-react is installed: npm install lucide-react

// The `userData` prop is passed from MyProfile
const OverviewTab = ({ userData }) => {
  // Variants for staggered animation of content sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger children by 0.1 seconds
      },
    },
  };

  // Variants for individual section cards
  const sectionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-2xl shadow-md border border-gray-200">
        <p className="text-xl text-gray-500 font-semibold flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" />
          Loading user data or no data available.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6" // Adds spacing between the main sections
    >
      {/* About Me Section */}
      <motion.div
        variants={sectionVariants}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl"
      >
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-100">
          <Feather className="w-6 h-6 text-emerald-600" /> About Me
        </h3>
        {userData.bio ? (
          <p className="text-gray-700 leading-relaxed text-lg">
            {userData.bio}
          </p>
        ) : (
          <p className="text-gray-500 italic text-md p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-600">Tip:</span> Share a
            bit about yourself! Your biography helps others get to know you.
          </p>
        )}
      </motion.div>

      {/* Activity Section */}
      <motion.div
        variants={sectionVariants}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl"
      >
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-100">
          <Activity className="w-6 h-6 text-teal-600" /> Recent Activity
        </h3>
        {userData.activity && userData.activity.length > 0 ? (
          <ul className="space-y-3 text-gray-700">
            {userData.activity.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 p-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors border border-gray-100"
                whileHover={{ scale: 1.01, x: 5 }} // Slight animation on hover
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRightCircle className="flex-shrink-0 w-5 h-5 text-emerald-500 mt-0.5" />
                <p className="flex-grow">{item}</p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-md p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-600">No activity yet.</span>{" "}
            Start engaging to see your updates here!
          </p>
        )}
      </motion.div>

      {/* Contact Information Section */}
      <motion.div
        variants={sectionVariants}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl"
      >
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-100">
          <Contact className="w-6 h-6 text-blue-600" /> Contact Information
        </h3>
        <div className="space-y-4 text-gray-700 text-lg">
          {userData.contact?.email ? (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-500" />
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${userData.contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {userData.contact.email}
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic text-md p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-600">Email:</span> Not
              provided.
            </p>
          )}

          {userData.contact?.phone ? (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-pink-500" />
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${userData.contact.phone}`}
                className="text-blue-600 hover:underline"
              >
                {userData.contact.phone}
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic text-md p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-600">Phone:</span> Not
              provided.
            </p>
          )}

          {!userData.contact?.email && !userData.contact?.phone && (
            <p className="text-gray-500 italic text-md p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-600">Note:</span> Your
              contact details are not listed. You can add them in your profile
              settings.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewTab;