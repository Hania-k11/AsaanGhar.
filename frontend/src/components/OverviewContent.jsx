/* eslint-disable no-unused-vars */
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
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Link } from "react-router-dom"
import useOverview from "../hooks/useOverview"

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

const StatCard = ({ icon: Icon, label, value, color, bg, isLoading }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
  >
    <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
    </div>
    {isLoading ? (
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-1"></div>
    ) : (
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
    )}
    <p className="text-sm font-medium text-gray-600">{label}</p>
  </motion.div>
)

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
    inquiry: MessageSquare,
    search: Search,
  }[activity.type] || Clock

  const iconColor = {
    view: "text-blue-600",
    save: "text-rose-600",
    inquiry: "text-emerald-600",
    search: "text-purple-600",
  }[activity.type]

  const bgColor = {
    view: "bg-blue-100",
    save: "bg-rose-100",
    inquiry: "bg-emerald-100",
    search: "bg-purple-100",
  }[activity.type]

  const actionText = {
    view: "Updated listing",
    save: "Saved property",
    inquiry: "Received inquiry for",
    search: "Searched for",
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
          <p className="text-sm font-semibold text-gray-900 truncate">
            {actionText} "{activity.property}"
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500">{activity.time}</p>
            {activity.location && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">{activity.location}</p>
              </>
            )}
          </div>
        </div>
      </div>
     
    </motion.div>
  )
}

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
      <p className="text-gray-600">Loading your overview...</p>
    </div>
  </div>
)

const ErrorState = ({ error, refetch }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
  >
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Overview</h3>
    <p className="text-sm text-gray-600 mb-4">
      {error?.message || "Unable to fetch your overview data. Please try again."}
    </p>
    <button
      onClick={refetch}
      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 mx-auto"
    >
      <RefreshCw className="w-4 h-4" />
      Retry
    </button>
  </motion.div>
)

const OverviewContent = ({ user = {} }) => {
  const { data: stats, isLoading, isError, error, refetch } = useOverview();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} refetch={refetch} />;
  }

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
          <span>
            Welcome back {user?.first_name || ""} {user?.last_name || ""}! 👋
          </span>
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
            label: "Properties",
            value: stats?.activeProperties || 0,
            icon: Building,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Saved Properties",
            value: stats?.savedProperties || 0,
            icon: Heart,
            color: "text-rose-600",
            bg: "bg-rose-100",
          },
          {
            label: "Sold Properties",
            value: stats?.soldProperties || 0,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          // {
          //   label: "Paused Properties",
          //   value: stats?.pausedProperties || 0,
          //   icon: Clock,
          //   color: "text-amber-600",
          //   bg: "bg-amber-100",
          // },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </motion.div>

      {/* Additional Stats Row */}
      {/* <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalViews?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Inquiries</p>
              <p className="text-3xl font-bold text-emerald-600">
                {stats?.totalInquiries?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>
      </motion.div> */}

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
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            {stats.recentActivity.map((activity, index) => (
              <RecentActivityItem key={`${activity.id}-${activity.type}-${index}`} activity={activity} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No recent activity</p>
            <p className="text-sm text-gray-500">Start by listing a property or saving your favorites!</p>
          </div>
        )}
      </motion.div>

      {/* Paused Properties Notice (if any) */}
      {stats?.pausedProperties > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                You have {stats.pausedProperties} paused {stats.pausedProperties === 1 ? 'property' : 'properties'}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                These properties are not visible to potential buyers or renters.
              </p>
              <Link
                to="/my-profile?tab=listings"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 underline"
              >
                Manage your listings →
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default OverviewContent