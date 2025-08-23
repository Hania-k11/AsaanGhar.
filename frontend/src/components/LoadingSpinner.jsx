// src/components/LoadingSpinner.jsx
import { motion } from "framer-motion";

const LoadingSpinner = ({ 
  variant = "inline", 
  message = "Loading...", 
  subMessage 
}) => {
  const isFull = variant === "full";

 
  const spinnerSize = isFull ? 20 : 16; 
  const innerSpinnerSize = isFull ? 16 : 12;
  const textSize = isFull ? "text-xl font-semibold text-slate-700" : "text-base text-gray-700";
  const containerPadding = isFull ? "p-8 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" : "py-6";

  return (
    <div className={`flex flex-col items-center justify-center ${containerPadding}`}>
      {/* Spinner */}
      <motion.div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-${spinnerSize} h-${spinnerSize} border-4 border-t-emerald-500 border-slate-200 rounded-full`}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-2 w-${innerSpinnerSize} h-${innerSpinnerSize} border-4 border-r-blue-500 border-transparent rounded-full`}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <p className={textSize}>{message}</p>
        {isFull && subMessage && (
          <p className="text-sm text-slate-500 mt-2">{subMessage}</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
