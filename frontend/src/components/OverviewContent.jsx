import { motion } from "framer-motion"
import {
  Heart,
  TrendingUp,
  Eye,
  Search,
  MessageSquare,
  Plus,
  Edit,
  Building,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom" 

// Mock data for demonstration
const mockStats = {
  propertiesViewed: 127,
  savedProperties: 23,
  listingsCreated: 3,
  totalViews: 1240,
}

const mockRecentActivity = [
  { id: 1, type: "view", property: "Modern Condo in SOMA", time: "2 hours ago", price: "$850,000" },
  { id: 2, type: "save", property: "Victorian House in Mission", time: "5 hours ago", price: "$1,200,000" },
  { id: 3, type: "message", property: "Penthouse Downtown", time: "1 day ago", price: "$2,100,000" },
  { id: 4, type: "search", property: "3BR Apartments under $900k", time: "2 days ago", price: null },
]


const quickActions = [
  { icon: Plus, label: "List Property", color: "from-emerald-500 to-emerald-600", href: "/sell" },
  { icon: Search, label: "Find Property", color: "from-blue-500 to-blue-600", href: "/buy" },
  { icon: Heart, label: "Saved Listings", color: "from-rose-500 to-rose-600", href: "/my-profile?tab=favorites" },
  { icon: Edit, label: "Manage Profile", color: "from-purple-500 to-purple-600", href: "/my-profile?tab=profile" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
  >
    <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
    <p className="text-sm font-medium text-gray-600">{label}</p>
  </motion.div>
)

// QuickActionCard with React Router Link stays the same, no removals
const QuickActionCard = ({ icon: Icon, label, color, href }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className={`relative group bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg transition-all duration-300 flex flex-col items-start justify-between gap-4 overflow-hidden`}
  >
    <Link to={href} className="absolute inset-0 z-10" />
    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    <div className="flex items-center gap-4 relative z-20">
      <Icon className="w-8 h-8" strokeWidth={2} />
      <span className="text-lg font-semibold">{label}</span>
    </div>
    <ArrowRight className="w-6 h-6 self-end -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 relative z-20" />
  </motion.div>
)

const RecentActivityItem = ({ activity, index }) => {
  const Icon = {
    view: Eye,
    save: Heart,
    message: MessageSquare,
    search: Search,
  }[activity.type] || Clock

  const iconColor = {
    view: "text-blue-600",
    save: "text-rose-600",
    message: "text-emerald-600",
    search: "text-purple-600",
  }[activity.type]

  const bgColor = {
    view: "bg-blue-100",
    save: "bg-rose-100",
    message: "bg-emerald-100",
    search: "bg-purple-100",
  }[activity.type]

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{activity.property}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
      {activity.price && (
        <span className="text-sm font-bold text-emerald-600 flex-shrink-0">
          {activity.price}
        </span>
      )}
    </motion.div>
  )
}

const OverviewContent = ({ userDetails = { name: "Alex" } }) => {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Welcome back, {userDetails.name}! 👋
        </h1>
        <p className="text-base text-gray-600 max-w-2xl">
          Your dashboard provides a quick overview of your real estate activity. Let's make your next property move!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {[
          {
            label: "Active Properties",
            value: mockStats.listingsCreated,
            icon: Building,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Saved Properties",
            value: mockStats.savedProperties,
            icon: Heart,
            color: "text-rose-600",
            bg: "bg-rose-100",
          },
          {
            label: "Total Views",
            value: mockStats.totalViews,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Recent Activity</h3>
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <div className="space-y-4 sm:space-y-5">
          {mockRecentActivity.map((activity, index) => (
            <RecentActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewContent
