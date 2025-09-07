import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // use the context
import AdminLogin from "./AdminLogin";
import AdminStats from "./AdminStats";
import AdminFilters from "./AdminFilters";
import AdminPropertyGrid from "./AdminPropertyGrid";
import AdminModals from "./AdminModals";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const AdminPanel = () => {
  const { user, loading, loginadmin, logoutadmin } = useAuth(); // use context
  const [navbarActive, setNavbarActive] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState("");

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch properties when admin is logged in
  useEffect(() => {
    if (!user) return;

    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/admin/pending-properties", {
          withCredentials: true,
        });
        if (res.data.success) {
          setProperties(res.data.properties);
        } else {
          setError("Failed to fetch properties");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching properties");
      }
    };

    fetchProperties();
  }, [user]);

  // Show loading while context checks cookie
// Show loading while context checks cookie
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-600 text-lg font-medium">Loading...</div>
    </div>
  );
}


  // Show login form if not logged in
  if (!user) return <AdminLogin onLogin={loginadmin} />;

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    let keep = true;
    if (activeTab === "pending") keep = keep && p.status === "pending";
    if (activeTab === "myActions") keep = keep && p.adminAction === user.email;
    if (filterStatus !== "all") keep = keep && p.status === filterStatus;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      keep =
        keep &&
        (p.title.toLowerCase().includes(term) ||
          p.owner.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term));
    }
    return keep;
  });

  return (
    <div className="flex flex-col bg-emerald-100/30 min-h-screen">
      {/* Navbar handles branding + profile + logout */}
      <AdminNavbar
        navbarActive={navbarActive}
        setNavbarActive={setNavbarActive}
      />

      <div className="p-6">
        {error && <p className="text-red-500">{error}</p>}
        {!error && navbarActive === "properties" && (
          <>
            <AdminStats properties={properties} />
            <AdminFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              properties={properties}
              currentAdmin={user}
            />
            <AdminPropertyGrid
              properties={filteredProperties}
              onViewDetails={(p) => {
                setSelectedProperty(p);
                setShowPropertyDetails(true);
              }}
              onViewDocuments={(p) => {
                setSelectedProperty(p);
                setShowDocuments(true);
              }}
              onApprove={(id) =>
                setProperties((prev) =>
                  prev.map((p) =>
                    p.id === id
                      ? {
                          ...p,
                          status: "approved",
                          adminAction: user.email,
                          actionDate: new Date().toISOString().split("T")[0],
                        }
                      : p
                  )
                )
              }
              onReject={(p) => {
                setSelectedProperty(p);
                setShowRejectModal(true);
              }}
              currentAdmin={user}
            />
          </>
        )}
      </div>

      <AdminModals
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        showPropertyDetails={showPropertyDetails}
        setShowPropertyDetails={setShowPropertyDetails}
        showDocuments={showDocuments}
        setShowDocuments={setShowDocuments}
        selectedProperty={selectedProperty}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onSubmitReject={() => {
          if (!rejectReason.trim()) return;
          setProperties((prev) =>
            prev.map((p) =>
              p.id === selectedProperty.id
                ? {
                    ...p,
                    status: "rejected",
                    adminAction: user.email,
                    actionDate: new Date().toISOString().split("T")[0],
                    rejectReason,
                  }
                : p
            )
          );
          setShowRejectModal(false);
          setRejectReason("");
          setSelectedProperty(null);
        }}
      />
    </div>
  );
};

export default AdminPanel;
