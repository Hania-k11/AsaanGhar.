
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { Home, Building, MapPin } from "lucide-react"

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating buildings and houses */}
      <motion.div
        className="absolute text-violet-200/30"
        style={{ top: "10%", left: "5%" }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeInOut" }}
      >
        <Home size={40} />
      </motion.div>

      <motion.div
        className="absolute text-teal-200/20"
        style={{ top: "30%", right: "10%" }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "easeInOut" }}
      >
        <Building size={60} />
      </motion.div>

      <motion.div
        className="absolute text-violet-300/20"
        style={{ bottom: "20%", left: "15%" }}
        animate={{
          y: [0, 10, 0],
          rotate: [0, 3, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut" }}
      >
        <Building size={50} />
      </motion.div>

      <motion.div
        className="absolute text-teal-300/20"
        style={{ top: "60%", right: "20%" }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 9, ease: "easeInOut" }}
      >
        <Home size={35} />
      </motion.div>

      <motion.div
        className="absolute text-amber-300/20"
        style={{ top: "40%", left: "30%" }}
        animate={{
          y: [0, 12, 0],
          rotate: [0, 4, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 11, ease: "easeInOut" }}
      >
        <MapPin size={30} />
      </motion.div>

      {/* Floating blobs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-violet-500/5 blur-3xl"
        style={{ top: "20%", left: "10%" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 15, ease: "easeInOut" }}
      ></motion.div>

      <motion.div
        className="absolute w-80 h-80 rounded-full bg-teal-500/5 blur-3xl"
        style={{ bottom: "10%", right: "5%" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 18, ease: "easeInOut" }}
      ></motion.div>

      <motion.div
        className="absolute w-72 h-72 rounded-full bg-amber-500/5 blur-3xl"
        style={{ top: "50%", left: "40%" }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "easeInOut" }}
      ></motion.div>
    </div>
  )
}

export default FloatingElements
