import React, { useState } from "react";
import { Eye, FileText, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import { useNavigate } from "react-router-dom";

const AdminPropertyGrid = ({ properties, onViewDocuments, onApprove, onReject }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); // "", "rent", "sale"
  const [sortByDate, setSortByDate] = useState("newest"); // "newest" or "oldest"
  const propertiesPerPage = 6;

  // Sorting
  const sortedProperties = [...properties].sort((a, b) => {
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
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const transformedProperties = currentProperties.map((property) => ({
    ...property,
    adminActions: (
      <div className="space-y-3 mt-4">
        {/* View Details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.property_id}`, { state: { property } });
          }}
          className="group w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300"
        >
          <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
          View Details
        </button>

        {/* View Documents */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDocuments(property);
          }}
          className="group w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 hover:border-blue-300"
        >
          <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
          View Documents
        </button>

        {/* Approve / Reject */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove(property);
            }}
            className="group flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 text-emerald-700 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md border border-emerald-200 hover:border-emerald-300"
          >
            <Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Approve
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(property);
            }}
            className="group flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-50 to-rose-100 hover:from-red-100 hover:to-rose-200 text-red-700 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300"
          >
            <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Reject
          </button>
        </div>
      </div>
    ),
  }));

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages);
    else rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="space-y-8">
      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="font-semibold">Sort By:</span>
        <button
          onClick={() => {
            setSortByDate("newest");
            setSortBy(""); // clear other sorts
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            sortByDate === "newest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200"
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
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            sortByDate === "oldest" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200"
          }`}
        >
          Date: Oldest
        </button>
        <button
          onClick={() => {
            setSortBy("rent");
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            sortBy === "rent" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200"
          }`}
        >
          Rent
        </button>
        <button
          onClick={() => {
            setSortBy("sale");
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            sortBy === "sale" ? "bg-gray-100 shadow-sm" : "bg-white border border-gray-200"
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4">
            {/* Pagination Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{indexOfFirst + 1}</span> to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(indexOfLast, properties.length)}
                </span>{" "}
                of <span className="font-medium text-gray-900">{properties.length}</span> properties
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
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center space-x-1 mx-4">
                  {getPaginationRange().map((page, i) =>
                    page === "..." ? (
                      <span key={i} className="px-3 py-2 text-gray-400 text-sm">
                        ...
                      </span>
                    ) : (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm border border-blue-600 hover:bg-blue-700"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                        }`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile Page Indicator */}
                <div className="sm:hidden mx-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
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
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
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
  );
};

export default AdminPropertyGrid;