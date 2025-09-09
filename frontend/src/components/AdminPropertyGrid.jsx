import React, { useState } from "react";
import { Eye, FileText, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Rejection Modal Component
const RejectionModal = ({ isOpen, onClose, onConfirm, propertyTitle }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      onClose(); // Close on success
    } catch (error) {
      console.error("Error submitting rejection:", error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Reject Property</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Property Info */}
          <div className="p-3 mb-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Property:</p>
            <p className="font-medium truncate text-gray-900">{propertyTitle}</p>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <label htmlFor="rejectionReason" className="block mb-2 text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejecting this property..."
              className="w-full px-3 py-2 transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">{reason.length}/500 characters</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason.trim()}
              className="flex items-center justify-center flex-1 px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Rejecting...
                </>
              ) : (
                "Reject Property"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPropertyGrid = ({ properties, onViewDocuments, onApprove, onReject }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); // "", "rent", "sale"
  const [sortByDate, setSortByDate] = useState("newest"); // "newest" or "oldest"
  const [localProperties, setLocalProperties] = useState(properties);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, property: null });
  const propertiesPerPage = 6;

  // Update local properties when props change
  React.useEffect(() => {
    // Only update local properties if they're different from the current ones
    const hasChanges = properties.some((prop, index) => {
      const localProp = localProperties[index];
      return (
        !localProp ||
        localProp.property_id !== prop.property_id ||
        localProp.approval_status !== prop.approval_status ||
        localProp.status !== prop.status
      );
    });

    if (hasChanges) {
      console.log("Updating local properties due to prop changes");
      setLocalProperties(properties);
    }
  }, [properties, localProperties]);

  const handleApprove = async (property) => {
    try {
      const res = await fetch(`/api/admin/properties/${property.property_id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user.user_id }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state immediately
        setLocalProperties((prev) =>
          prev.map((p) =>
            p.property_id === property.property_id ? { ...p, approval_status: "approved", status: "approved" } : p,
          ),
        );
        // Call parent's onApprove if provided
        if (onApprove) {
          onApprove(property);
        }
        alert("Successfully approved");
      } else {
        alert("Failed to approve property");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Reject property with modal
  const handleReject = (property) => {
    setRejectionModal({ isOpen: true, property });
  };

  const confirmReject = async (reason) => {
    const property = rejectionModal.property;
    if (!property) return;

    try {
      console.log("Attempting to reject property:", property.property_id);
      const res = await fetch(`/api/admin/properties/${property.property_id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user.user_id, reason }),
      });
      const data = await res.json();
      console.log("Rejection response:", data);

      if (data.success) {
        const updatedProperty = {
          ...property,
          approval_status: "rejected",
          status: "rejected",
          rejectReason: reason,
        };

        // Update local state immediately
        setLocalProperties((prev) => prev.map((p) => (p.property_id === property.property_id ? updatedProperty : p)));

        // Call parent's onReject if provided
        if (onReject) {
          onReject(updatedProperty, reason);
        }

        // Close modal and reset state
        closeRejectionModal();
        alert("Successfully rejected");
        return true; // Indicate success to the modal
      } else {
        alert("Failed to reject property");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
      return false;
    }
  };

  const closeRejectionModal = () => {
    setRejectionModal({ isOpen: false, property: null });
  };

  // Sorting - use localProperties instead of properties
  const sortedProperties = [...localProperties].sort((a, b) => {
    // Date sorting first
    const dateA = new Date(a.date_posted);
    const dateB = new Date(b.date_posted);

    if (sortByDate === "newest") return dateB - dateA;
    if (sortByDate === "oldest") return dateA - dateB;

    // Rent / Sale sorting
    if (sortBy === "rent") return (a.rent || 0) - (b.rent || 0);
    if (sortBy === "sale") return (a.sale_price || 0) - (b.sale_price || 0);

    return 0;
  });

  // Pagination
  const indexOfLast = currentPage * propertiesPerPage;
  const indexOfFirst = indexOfLast - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(localProperties.length / propertiesPerPage);

  const transformedProperties = currentProperties.map((property) => {
    console.log("Rendering property:", property.property_id, "with status:", property.approval_status, "and status:", property.status);
    return {
      ...property,
      adminActions: (
        <div className="mt-4 space-y-3">
          {/* View Details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${property.property_id}`, { state: { property } });
            }}
            className="group w-full flex items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200 hover:shadow-md"
          >
            <Eye className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            View Details
          </button>

          {/* View Documents */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDocuments(property);
            }}
            className="group w-full flex items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:from-blue-100 hover:to-blue-200 hover:shadow-md"
          >
            <FileText className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            View Documents
          </button>

          {/* Approve/Reject or Status */}
          {property.approval_status === "approved" || property.status === "approved" ? (
            // APPROVED STATE: Only show "Approved" button, no reject button
            <div className="flex items-center justify-center w-full px-4 py-3 font-semibold text-center text-emerald-800 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-100 to-emerald-200">
              <Check className="w-4 h-4 mr-2" />
              Approved
            </div>
          ) : property.approval_status === "rejected" || property.status === "rejected" ? (
            // REJECTED STATE: Only show "Rejected" button, no approve button
            <div className="flex items-center justify-center w-full px-4 py-3 font-semibold text-center text-red-800 rounded-xl border border-red-300 bg-gradient-to-r from-red-100 to-red-200">
              <X className="w-4 h-4 mr-2" />
              Rejected
            </div>
          ) : (
            // PENDING STATE: Show both approve and reject buttons
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(property);
                }}
                className="flex items-center justify-center flex-1 px-4 py-3 font-semibold text-emerald-700 transition-all duration-200 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-sm hover:border-emerald-300 hover:from-emerald-100 hover:to-emerald-200 hover:shadow-md"
              >
                <Check className="w-4 h-4 mr-2" /> Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(property);
                }}
                className="flex items-center justify-center flex-1 px-4 py-3 font-semibold text-red-700 transition-all duration-200 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-sm hover:border-red-300 hover:from-red-100 hover:to-red-200 hover:shadow-md"
              >
                <X className="w-4 h-4 mr-2" /> Reject
              </button>
            </div>
          )}
        </div>
      ),
    };
  });

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Handle edge case where totalPages is 1
    if (totalPages <= 1) return [1];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <>
      <div className="space-y-8">
        {/* Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">Sort By:</span>
          <button
            onClick={() => {
              setSortByDate("newest");
              setSortBy(""); // clear other sorts
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortByDate === "newest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Date: Newest
          </button>
          <button
            onClick={() => {
              setSortByDate("oldest");
              setSortBy("");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortByDate === "oldest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Date: Oldest
          </button>
          <button
            onClick={() => {
              setSortBy("rent");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortBy === "rent" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => {
              setSortBy("sale");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortBy === "sale" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Sale
          </button>
        </div>

        {/* Properties Grid */}
        <PropertyGrid
          properties={transformedProperties}
          viewMode="grid"
          likedProperties={new Set()}
          toggleLike={() => {}}
          isOwner={false}
        />

        {/* Professional Pagination */}
        {totalPages > 1 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4">
              {/* Pagination Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{indexOfFirst + 1}</span> to{" "}
                  <span className="font-medium text-gray-900">{Math.min(indexOfLast, localProperties.length)}</span> of{" "}
                  <span className="font-medium text-gray-900">{localProperties.length}</span> properties
                </div>
                <div className="text-sm text-gray-600">
                  Page <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalPages}</span>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center">
                <nav className="flex items-center space-x-1" aria-label="Pagination">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden mx-4 space-x-1 sm:flex items-center">
                    {getPaginationRange().map((page, i) =>
                      page === "..." ? (
                        <span key={i} className="px-3 py-2 text-sm text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "border border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                              : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
                          }`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Mobile Page Indicator */}
                  <div className="px-4 py-2 mx-4 border border-gray-200 rounded-lg sm:hidden bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={closeRejectionModal}
        onConfirm={confirmReject}
        propertyTitle={rejectionModal.property?.title || rejectionModal.property?.property_name || "Property"}
      />
    </>
  );
};

export default AdminPropertyGrid;