// src/components/admin/AdminModals.jsx
import React from 'react';
import { X, FileText, MapPin, User, DollarSign, Building, Calendar, Bed, Bath, Square } from 'lucide-react';

const AdminModals = ({
  showRejectModal,
  setShowRejectModal,
  showPropertyDetails,
  setShowPropertyDetails,
  showDocuments,
  setShowDocuments,
  selectedProperty,
  rejectReason,
  setRejectReason,
  onSubmitReject
}) => {
  return (
    <>
      {/* Reject Modal */}
      {showRejectModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Property</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting "{selectedProperty.title}":
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows="4"
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await onSubmitReject();
                    setShowRejectModal(false);
                  }}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors"
                >
                  Reject Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-800">{selectedProperty.title}</h3>
                <button
                  onClick={() => setShowPropertyDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Owner</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.owner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.ownerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.price}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Area</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.area}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                    <p className="mt-1 text-gray-900">{selectedProperty.submittedDate}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{selectedProperty.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {selectedProperty.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="w-5 h-5 text-emerald-600 mr-2" />
                      <span>{selectedProperty.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {selectedProperty.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 text-emerald-600 mr-2" />
                      <span>{selectedProperty.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {selectedProperty.area && (
                    <div className="flex items-center">
                      <Square className="w-5 h-5 text-emerald-600 mr-2" />
                      <span>{selectedProperty.area}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocuments && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Property Documents</h3>
                <button
                  onClick={() => setShowDocuments(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Property: {selectedProperty.title}</h4>
                <p className="text-gray-600">Owner: {selectedProperty.owner}</p>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700 mb-4">Documents Submitted:</div>
                
                {selectedProperty.documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">{doc}</p>
                        <p className="text-sm text-gray-500">Uploaded on {selectedProperty.submittedDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}

                {(!selectedProperty.documents || selectedProperty.documents.length === 0) && (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-2">Document Verification Checklist:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-yellow-700">Property deed verified</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-yellow-700">Tax certificates are valid</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-yellow-700">Building permits are current</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-yellow-700">Insurance documents are valid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminModals;