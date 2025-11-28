import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // use the context
import AdminLogin from "./AdminLogin";
import AdminStats from "./AdminStats";
import AdminFilters from "./AdminFilters";
import AdminPropertyGrid from "./AdminPropertyGrid";
import AdminModals from "./AdminModals";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { useAdmin } from "../hooks/useAdmin";


const AdminPanel = () => {
  const { admin, loading, loginadmin, logoutadmin } = useAuth();
  const [navbarActive, setNavbarActive] = useState("properties");
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sortByDate, setSortByDate] = useState("newest");
  const [listingType, setListingType] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");


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
    enabled: !!admin, // Only fetch when user is logged in
  });
const properties = data?.data || []; 
const totalCount = data?.pagination?.totalCount || 0;
const totalPages = data?.pagination?.totalPages || 1;
  const stats = data?.stats || {};


  // keep filter tab synced
  useEffect(() => {
    setPage(1);
  }, [activeTab, sortByDate, listingType]);

  // Handle view documents
  const handleViewDocuments = (property) => {
    setSelectedProperty(property);
    setShowDocuments(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!admin) return <AdminLogin />;


  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.owner_id?.toString().includes(term) ||
      p.location_city?.toLowerCase().includes(term) ||
      p.location_name?.toLowerCase().includes(term)
    );
  });


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
              properties={filteredProperties}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              sortByDate={sortByDate}
              onSortByDateChange={setSortByDate}    
  listingType={listingType}
  onListingTypeChange={setListingType}  
              currentAdmin={admin}
              onViewDocuments={handleViewDocuments}
            />
          </>
        )}
      </div>

      <AdminModals
        showPropertyDetails={showPropertyDetails}
        setShowPropertyDetails={setShowPropertyDetails}
        showDocuments={showDocuments}
        setShowDocuments={setShowDocuments}
        selectedProperty={selectedProperty}
      />
    </div>
  );
};

export default AdminPanel;