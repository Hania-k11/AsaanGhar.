// src/components/LoggingOutModal.jsx
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoggingOutModal = ({ isLoggingOut }) => {
  return (
    <AnimatePresence>
      {isLoggingOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4 min-w-[280px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Logging Out
              </h3>
              <p className="text-gray-600 text-sm">
                Please wait while we sign you out...
              </p>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoggingOutModal;
