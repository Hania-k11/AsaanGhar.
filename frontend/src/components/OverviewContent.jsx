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
} from "lucide-react"

// Mock data for demonstration
const mockStats = {
  propertiesViewed: 127,
  savedProperties: 23,
  searchesSaved: 8,
  messagesReceived: 15,
  listingsCreated: 3,
  totalViews: 1240,
}

const mockRecentActivity = [
  { id: 1, type: "view", property: "Modern Condo in SOMA", time: "2 hours ago", price: "$850,000" },
  { id: 2, type: "save", property: "Victorian House in Mission", time: "5 hours ago", price: "$1,200,000" },
  { id: 3, type: "message", property: "Penthouse Downtown", time: "1 day ago", price: "$2,100,000" },
  { id: 4, type: "search", property: "3BR Apartments under $900k", time: "2 days ago", price: null },
]

const OverviewContent = ({ userDetails }) => {
  const quickActions = [
    { icon: Plus, label: "List Property", color: "bg-emerald-500 hover:bg-emerald-600" },
    { icon: Search, label: "Search Property", color: "bg-blue-500 hover:bg-blue-600" },
    { icon: Heart, label: "Liked Properties", color: "bg-red-400 hover:bg-orange-600" },
    { icon: Edit, label: "Edit Profile", color: "bg-purple-500 hover:bg-purple-600" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 border border-emerald-100"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {userDetails.name}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          You've been actively searching for properties. Here's your latest activity overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Active Properties",
            value: mockStats.propertiesViewed,
            icon: Building,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Saved Properties",
            value: mockStats.savedProperties,
            icon: Heart,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Sold Properties",
            value: mockStats.totalViews,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} text-white p-3 sm:p-4 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center gap-2`}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Recent Activity</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          {mockRecentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === "view"
                    ? "bg-blue-100"
                    : activity.type === "save"
                      ? "bg-red-100"
                      : activity.type === "message"
                        ? "bg-green-100"
                        : "bg-purple-100"
                }`}
              >
                {activity.type === "view" && <Eye className="w-4 h-4 text-blue-600" />}
                {activity.type === "save" && <Heart className="w-4 h-4 text-red-600" />}
                {activity.type === "message" && <MessageSquare className="w-4 h-4 text-green-600" />}
                {activity.type === "search" && <Search className="w-4 h-4 text-purple-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.property}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {activity.price && (
                    <span className="text-xs font-semibold text-emerald-600">{activity.price}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OverviewContent