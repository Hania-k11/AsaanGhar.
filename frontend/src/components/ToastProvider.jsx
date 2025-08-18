import { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";


const AestheticToast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const toastStyles = {
    success: {
      bg: 'from-emerald-400 to-teal-600',
      border: 'border-emerald-200/30',
      icon: CheckCircle2,
      glow: 'shadow-emerald-500/15',
      particle: 'bg-emerald-300'
    },
    error: {
      bg: 'from-red-600 to-red-200',
      border: 'border-red-900/30',
      icon: AlertTriangle,
      glow: 'shadow-rose-500/25',
     
    },
    warning: {
      bg: 'from-amber-400 to-orange-500',
      border: 'border-amber-200/30',
      icon: AlertTriangle,
      glow: 'shadow-amber-500/25',
      particle: 'bg-amber-300'
    },
    info: {
      bg: 'from-blue-400 to-indigo-500',
      border: 'border-blue-200/30',
      icon: Info,
      glow: 'shadow-blue-500/25',
      particle: 'bg-blue-300'
    }
  };

  const style = toastStyles[toast.type] || toastStyles.info;
  const IconComponent = style.icon;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden bg-gradient-to-r ${style.bg} border ${style.border} 
                  rounded-2xl shadow-xl ${style.glow} backdrop-blur-xl mb-3 group`}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${style.particle} rounded-full opacity-60`}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 50 - 25],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      -skew-x-12 transform translate-x-[-100%] 
                      group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />

      <div className="relative p-4 flex items-start gap-3">
        <motion.div
          initial={{ rotate: 0, scale: 1 }}
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/90 mt-0.5"
        >
          <IconComponent size={20} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white font-medium text-sm leading-relaxed"
          >
            {toast.message}
          </motion.p>
          {toast.subtitle && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-xs mt-1"
            >
              {toast.subtitle}
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClose(toast.id)}
          className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <X size={16} />
        </motion.button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
      />
    </motion.div>
  );
};

// ------------------ Toast Context + Provider ------------------
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", subtitle = null) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, subtitle }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const api = {
    success: (msg, sub) => addToast(msg, "success", sub),
    error:   (msg, sub) => addToast(msg, "error", sub),
    warning: (msg, sub) => addToast(msg, "warning", sub),
    info:    (msg, sub) => addToast(msg, "info", sub),
  };

return (
  <ToastContext.Provider value={api}>
    {children}

    {/* Toast container */}
   <div
  className="
    fixed z-[9999] 
    space-y-2 
    w-full max-w-[calc(100%-2rem)] px-2
    sm:max-w-sm sm:px-0

    top-4 left-1/2 -translate-x-1/2
    sm:left-auto sm:translate-x-0 sm:right-6
  "
>
  <AnimatePresence mode="popLayout">
    {toasts.map((toast) => (
      <AestheticToast key={toast.id} toast={toast} onClose={removeToast} />
    ))}
  </AnimatePresence>
    </div>
  </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
