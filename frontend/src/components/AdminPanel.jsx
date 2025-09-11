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
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pendingCount: 0, approvedByAdminCount: 0, rejectedByAdminCount: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState("");

  // Modals
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch properties when admin is logged in
const [page, setPage] = useState(1);
const [limit] = useState(6);
const [sortByDate, setSortByDate] = useState("newest"); // newest / oldest
const [listingType, setListingType] = useState(""); // rent / sale / ""

useEffect(() => {
  if (!user) return;

  const fetchProperties = async () => {
    try {
      const res = await axios.get("/api/admin/moderated-properties", {
        params: {
          adminId: user.user_id,
          page,
          limit,
          sortBy: sortByDate,
          sortByDate, // for backend compatibility
          listingType: listingType || null,
          statusFilter: filterStatus,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setProperties(res.data.properties || []);
        const p = res.data.pagination || {};
        setTotalCount(p.totalCount || 0);
        setTotalPages(p.totalPages || 1);
        if (res.data.stats) setStats(res.data.stats);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching properties");
    }
  };

  fetchProperties();
}, [user, page, limit, sortByDate, listingType, filterStatus]);


  // Update status filter based on active tab
  useEffect(() => {
    if (activeTab === "all") setFilterStatus("all");
    else if (activeTab === "pending") setFilterStatus("pending");
    else if (activeTab === "approved") setFilterStatus("approved");
    else if (activeTab === "rejected") setFilterStatus("rejected");
    setPage(1);
  }, [activeTab]);

  // Refetch when switching to All tab (kept for UX parity)
  useEffect(() => {
    if (!user) return;
    if (activeTab !== "all") return;

    const fetchAll = async () => {
      try {
        const res = await axios.get("/api/admin/moderated-properties", {
          params: { 
            adminId: user.user_id,
            page,
            limit,
            sortBy: sortByDate,
            sortByDate,
            listingType: listingType || null,
            statusFilter: filterStatus,
          },
          withCredentials: true,
        });
        if (res.data.success) {
          setProperties(res.data.properties || []);
          const p = res.data.pagination || {};
          setTotalCount(p.totalCount || 0);
          setTotalPages(p.totalPages || 1);
          if (res.data.stats) setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, [activeTab, user]);

  // Show loading while context checks cookie
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login form if not logged in
  if (!user) return <AdminLogin onLogin={loginadmin} />;

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    let keep = true;

    if (activeTab === "pending") {
      keep = keep && p.approval_status === "pending";
    }

    if (activeTab === "approved") {
      keep = keep && p.approval_status === "approved";
    }

    if (activeTab === "rejected") {
      keep = keep && p.approval_status === "rejected";
    }

    if (activeTab === "myActions") {
      keep = keep && p.moderated_by === user.user_id;
    }

    if (filterStatus !== "all") {
      keep = keep && p.approval_status === filterStatus;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      keep =
        keep &&
        (p.title?.toLowerCase().includes(term) ||
          p.owner_id?.toString().includes(term) ||
          p.location_city?.toLowerCase().includes(term) ||
          p.location_name?.toLowerCase().includes(term));
    }

    return keep;
  });

  return (
    <div className="flex flex-col min-h-screen bg-emerald-100/30">
      {/* Navbar handles branding + profile + logout */}
      <AdminNavbar navbarActive={navbarActive} setNavbarActive={setNavbarActive} />

      <div className="p-6">
        {error && <p className="text-red-500">{error}</p>}
        {!error && navbarActive === "properties" && (
          <>
            <AdminStats properties={properties} totalCount={totalCount} stats={stats} />
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
              handleApprove={(property) =>
                setProperties((prev) =>
                  prev.map((p) =>
                    p.property_id === property.property_id
                      ? {
                          ...p,
                          status: "approved",
                          approval_status: "approved",
                          adminAction: user.email,
                          actionDate: new Date().toISOString().split("T")[0],
                        }
                      : p,
                  ),
                )
              }
              handleReject={(updatedProperty, reason) => {
                setProperties((prev) =>
                  prev.map((p) =>
                    p.property_id === updatedProperty.property_id
                      ? {
                          ...p,
                          status: "rejected",
                          approval_status: "rejected",
                          adminAction: user.email,
                          actionDate: new Date().toISOString().split("T")[0],
                          rejectReason: reason,
                        }
                      : p,
                  ),
                );
              }}
              // Backend-driven pagination & sorting
              currentPage={page}
              totalPages={totalPages}
              onNextPage={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              onPrevPage={() => setPage((prev) => Math.max(prev - 1, 1))}
              onFirstPage={() => setPage(1)}
              onLastPage={() => setPage(totalPages)}
              sortByDate={sortByDate}
              listingType={listingType}
              onChangeSortByDate={(val) => { setPage(1); setSortByDate(val); setListingType(""); }}
              onChangeListingType={(val) => { setPage(1); setListingType(val); setSortByDate(""); }}
              currentAdmin={user}
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