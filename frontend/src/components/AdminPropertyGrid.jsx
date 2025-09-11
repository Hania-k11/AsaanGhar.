import React, { useState } from "react";
import { Eye, FileText, Check, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason("");
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Reject {propertyTitle}</h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          rows={3}
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPropertyGrid = ({ 
  properties, 
  onViewDocuments, 
  handleApprove, 
  handleReject,
  // Backend-driven pagination & sorting controls
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
  sortByDate,
  listingType,
  onChangeSortByDate,
  onChangeListingType,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, property: null });

  const closeRejectionModal = () => setRejectionModal({ isOpen: false, property: null });

  const confirmReject = async (reason) => {
    if (!rejectionModal.property) return;
    await handleReject(rejectionModal.property, reason);
    closeRejectionModal();
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
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

  const transformedProperties = properties.map((property) => ({
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

        {/* Approve/Reject */}
        {property.approval_status === "approved" || property.status === "approved" ? (
          <div className="flex items-center justify-center w-full px-4 py-3 font-semibold text-center text-emerald-800 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-100 to-emerald-200">
            <Check className="w-4 h-4 mr-2" />
            Approved
          </div>
        ) : property.approval_status === "rejected" || property.status === "rejected" ? (
          <div className="flex items-center justify-center w-full px-4 py-3 font-semibold text-center text-red-800 rounded-xl border border-red-300 bg-gradient-to-r from-red-100 to-red-200">
            <X className="w-4 h-4 mr-2" />
            Rejected
          </div>
        ) : (
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
                setRejectionModal({ isOpen: true, property });
              }}
              className="flex items-center justify-center flex-1 px-4 py-3 font-semibold text-red-700 transition-all duration-200 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-sm hover:border-red-300 hover:from-red-100 hover:to-red-200 hover:shadow-md"
            >
              <X className="w-4 h-4 mr-2" /> Reject
            </button>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <>
      <div className="space-y-8">
        {/* Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">Sort By:</span>
          <button
            onClick={() => {
              onChangeSortByDate && onChangeSortByDate("newest");
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortByDate === "newest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Date: Newest
          </button>
          <button
            onClick={() => {
              onChangeSortByDate && onChangeSortByDate("oldest");
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortByDate === "oldest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Date: Oldest
          </button>
          <button
            onClick={() => {
              onChangeListingType && onChangeListingType("rent");
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              listingType === "rent" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => {
              onChangeListingType && onChangeListingType("sale");
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              listingType === "sale" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200 hover:bg-gray-50"
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
        />
        {/* Backend Pagination Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-2 rounded border border-gray-200 bg-white disabled:opacity-50"
            onClick={onFirstPage}
            disabled={!onFirstPage || currentPage <= 1}
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            className="px-3 py-2 rounded border border-gray-200 bg-white disabled:opacity-50"
            onClick={onPrevPage}
            disabled={!onPrevPage || currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {Math.max(totalPages || 1, 1)}
          </div>

          <button
            className="px-3 py-2 rounded border border-gray-200 bg-white disabled:opacity-50"
            onClick={onNextPage}
            disabled={!onNextPage || currentPage >= (totalPages || 1)}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            className="px-3 py-2 rounded border border-gray-200 bg-white disabled:opacity-50"
            onClick={onLastPage}
            disabled={!onLastPage || currentPage >= (totalPages || 1)}
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={closeRejectionModal}
        onConfirm={confirmReject}
        propertyTitle={rejectionModal.property?.title || "Property"}
      />
    </>
  );
};

export default AdminPropertyGrid;
