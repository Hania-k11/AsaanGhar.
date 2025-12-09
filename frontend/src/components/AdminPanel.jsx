import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // use the context
import AdminLogin from "./AdminLogin";
import AdminStats from "./AdminStats";
import AdminFilters from "./AdminFilters";
import AdminPropertyGrid from "./AdminPropertyGrid";
import AdminUserGrid from "./AdminUserGrid";
import AdminModals from "./AdminModals";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import { useUsers } from "../hooks/useUsers";


const AdminPanel = () => {
  const { admin, loading, loginadmin, logoutadmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navbarActive = searchParams.get("tab") || "properties";
  
  const setNavbarActive = (tab) => {
    setSearchParams(prev => {
      prev.set("tab", tab);
      return prev;
    });
  };

  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sortByDate, setSortByDate] = useState("newest");
  const [listingType, setListingType] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // User management state
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userVerificationFilter, setUserVerificationFilter] = useState("all");


  // convert activeTab -> status param
  const status =
    activeTab === "all"
      ? "all"
      : activeTab === "pending"
      ? "pending"
      : activeTab === "approved"
      ? "approved"
      : activeTab === "rejected"
      ? "rejected"
      : "all";

  // Fetch properties with React Query (useAdmin) - only when user is logged in
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdmin({
    page,
    limit,
    sort_by: sortByDate === "newest" ? "posted_at" : "posted_at",
    sort_order: sortByDate === "newest" ? "DESC" : "ASC",
    status,
    search: searchTerm,
    enabled: !!admin, // Only fetch when user is logged in
  });
const properties = data?.data || []; 
const totalCount = data?.pagination?.totalCount || 0;
const totalPages = data?.pagination?.totalPages || 1;
  const stats = data?.stats || {};

  // Fetch users with React Query
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMsg,
  } = useUsers({
    page: userPage,
    limit,
    sort_by: "created_at",
    sort_order: "DESC",
    verification_status: userVerificationFilter,
    search: userSearchTerm,
    enabled: !!admin && navbarActive === "users",
  });

  const users = usersData?.data || [];
  const userTotalCount = usersData?.pagination?.totalCount || 0;
  const userTotalPages = usersData?.pagination?.totalPages || 1;
  const userStats = usersData?.stats || {};


  // keep filter tab synced and reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, sortByDate, listingType, searchTerm]);

  // Reset user page when user filters change
  useEffect(() => {
    setUserPage(1);
  }, [userVerificationFilter, userSearchTerm]);

  // Handle view documents
  const handleViewDocuments = (property) => {
    setSelectedProperty(property);
    setShowDocuments(true);
  };

  // Handle view user details
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!admin) return <AdminLogin />;


  return (
<div className="flex flex-col min-h-screen bg-emerald-100/30">
      <AdminNavbar navbarActive={navbarActive} setNavbarActive={setNavbarActive} />

      <div className="p-6">
        {isError && <p className="text-red-500">{error.message || "Error fetching properties"}</p>}
        {isLoading && <p className="text-gray-500">Loading properties...</p>}

        {!isError && !isLoading && navbarActive === "properties" && (
          <>
            <AdminStats properties={properties} totalCount={totalCount} stats={stats} />
            <AdminFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={status}
              setFilterStatus={() => {}}
              properties={properties}
              currentAdmin={admin}
            />
            <AdminPropertyGrid
              properties={properties}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              sortByDate={sortByDate}
              onSortByDateChange={setSortByDate}    
  listingType={listingType}
  onListingTypeChange={setListingType}  
              currentAdmin={admin}
              onViewDocuments={handleViewDocuments}
              onViewUserDetails={handleViewUserDetails}
            />
          </>
        )}

        {navbarActive === "users" && (
          <>
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-sm font-medium text-gray-600">Total Users</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{userStats.totalUsers || 0}</div>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-200">
                <div className="text-sm font-medium text-yellow-700">Pending Verification</div>
                <div className="text-3xl font-bold text-yellow-900 mt-2">{userStats.pendingVerifications || 0}</div>
              </div>
              <div className="bg-green-50 rounded-xl shadow-md p-6 border border-green-200">
                <div className="text-sm font-medium text-green-700">Verified</div>
                <div className="text-3xl font-bold text-green-900 mt-2">{userStats.verifiedUsers || 0}</div>
              </div>
              <div className="bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
                <div className="text-sm font-medium text-red-700">Rejected</div>
                <div className="text-3xl font-bold text-red-900 mt-2">{userStats.rejectedUsers || 0}</div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={userVerificationFilter}
                  onChange={(e) => setUserVerificationFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Users</option>
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="not_submitted">Not Submitted</option>
                </select>
              </div>
            </div>

            {usersError && <p className="text-red-500">{usersErrorMsg?.message || "Error fetching users"}</p>}
            {usersLoading && <p className="text-gray-500">Loading users...</p>}

            {!usersError && !usersLoading && (
              <AdminUserGrid
                users={users}
                page={userPage}
                totalPages={userTotalPages}
                onPageChange={setUserPage}
                onViewUserDetails={handleViewUserDetails}
                currentAdmin={admin}
                startIndex={(userPage - 1) * limit}
              />
            )}
          </>
        )}
      </div>

      <AdminModals
        showPropertyDetails={showPropertyDetails}
        setShowPropertyDetails={setShowPropertyDetails}
        showDocuments={showDocuments}
        setShowDocuments={setShowDocuments}
        selectedProperty={selectedProperty}
        showUserDetails={showUserDetails}
        setShowUserDetails={setShowUserDetails}
        selectedUser={selectedUser}
        refetchUsers={() => usersData?.refetch?.()}
      />
    </div>
  );
};

export default AdminPanel;