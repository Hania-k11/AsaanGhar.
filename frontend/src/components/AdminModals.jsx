// src/components/admin/AdminModals.jsx
import React, { useState, useEffect } from 'react';
import { X, FileText, ZoomIn, Loader, Check, File } from 'lucide-react';
import axios from 'axios';
import { useToast } from './ToastProvider';
import { useQueryClient } from '@tanstack/react-query';

const AdminModals = ({
  showPropertyDetails,
  setShowPropertyDetails,
  showDocuments,
  setShowDocuments,
  selectedProperty,
  showUserDetails,
  setShowUserDetails,
  selectedUser,
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch documents when modal opens
  useEffect(() => {
    if (showDocuments && selectedProperty) {
      fetchDocuments();
    }
  }, [showDocuments, selectedProperty]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `/api/admin/properties/${selectedProperty.property_id}/documents`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // Handle CNIC verification
  const handleVerifyCNIC = async () => {
    if (!selectedUser) return;
    
    setVerifying(true);
    try {
      const res = await axios.post(
        `/api/admin/users/${selectedUser.user_id}/verify-cnic`,
        {},
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success(res.data.message || 'CNIC verified successfully');
        // Wait for the query to refetch before closing modal
        await queryClient.invalidateQueries(['admin-users']);
        await queryClient.refetchQueries(['admin-users']);
        setShowUserDetails(false);
      }
    } catch (err) {
      console.error('Error verifying CNIC:', err);
      toast.error(err.response?.data?.message || 'Failed to verify CNIC');
    } finally {
      setVerifying(false);
    }
  };

  // Handle CNIC rejection
  const handleRejectCNIC = async () => {
    if (!selectedUser) return;
    
    setVerifying(true);
    try {
      const res = await axios.post(
        `/api/admin/users/${selectedUser.user_id}/reject-cnic`,
        {},
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success(res.data.message || 'CNIC rejected');
        // Wait for the query to refetch before closing modal
        await queryClient.invalidateQueries(['admin-users']);
        await queryClient.refetchQueries(['admin-users']);
        setShowUserDetails(false);
      }
    } catch (err) {
      console.error('Error rejecting CNIC:', err);
      toast.error(err.response?.data?.message || 'Failed to reject CNIC');
    } finally {
      setVerifying(false);
    }
  };

  // Get friendly name for document type
  const getDocTypeName = (docType) => {
    const typeMap = {
      cnic_front: 'CNIC Front',
      cnic_back: 'CNIC Back',
      property_papers: 'Property Papers',
      utility_bill: 'Utility Bill',
      other: 'Other Document',
    };
    return typeMap[docType] || docType;
  };

  // Helper function to check if file is PDF
  const isPDF = (url) => {
    if (!url) return false;
    const extension = url.toLowerCase().split('.').pop().split('?')[0];
    return extension === 'pdf';
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.doc_type]) {
      acc[doc.doc_type] = [];
    }
    acc[doc.doc_type].push(doc);
    return acc;
  }, {});

  // Get status badge for CNIC verification
  const getStatusBadge = (cnicVerified) => {
    switch (cnicVerified) {
      case 0:
        return { text: 'Not Submitted', className: 'bg-gray-100 text-gray-700 border border-gray-300' };
      case 1:
        return { text: 'Verified', className: 'bg-green-100 text-green-700 border border-green-300' };
      case 2:
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-700 border border-yellow-300' };
      case 3:
        return { text: 'Rejected', className: 'bg-red-100 text-red-700 border border-red-300' };
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-700 border border-gray-300' };
    }
  };

  return (
    <>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocuments && selectedProperty && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 g-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Property Documents</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProperty.title} - Owner: {selectedProperty.owner_name || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDocuments(false);
                    setDocuments([]);
                    setSelectedImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading documents...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {!loading && !error && documents.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents uploaded for this property</p>
                </div>
              )}

              {!loading && !error && documents.length > 0 && (
                <div className="space-y-6">
                  {Object.entries(groupedDocuments).map(([docType, docs]) => (
                    <div key={docType} className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {getDocTypeName(docType)}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {docs.map((doc) => {
                          const isDocPDF = isPDF(doc.doc_url);
                          return (
                            <div
                              key={doc.document_id}
                              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="relative aspect-video bg-gray-100">
                                {isDocPDF ? (
                                  // PDF Preview
                                  <div 
                                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                    onClick={() => setSelectedImage(doc.doc_url)}
                                  >
                                    <File className="w-16 h-16 text-red-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700">PDF Document</span>
                                  </div>
                                ) : (
                                  // Image Preview
                                  <>
                                    <img
                                      src={doc.doc_url}
                                      alt={getDocTypeName(doc.doc_type)}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => setSelectedImage(doc.doc_url)}
                                    />
                                    <button
                                      onClick={() => setSelectedImage(doc.doc_url)}
                                      className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                                      title="View full size"
                                    >
                                      <ZoomIn className="w-4 h-4 text-gray-700" />
                                    </button>
                                  </>
                                )}
                              </div>
                              <div className="p-3">
                                <p className="text-xs text-gray-500 text-center">
                                  Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-emerald-600 text-center mt-1">
                                  Click to view {isDocPDF ? 'PDF' : 'full size'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-gray-900">{selectedUser.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-gray-900">{selectedUser.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-gray-900">{selectedUser.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CNIC</label>
                    <p className="mt-1 text-gray-900 font-mono">{selectedUser.cnic || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        getStatusBadge(selectedUser.cnic_verified).className
                      }`}
                    >
                      {getStatusBadge(selectedUser.cnic_verified).text}
                    </span>
                  </div>
                </div>

                {/* CNIC Images */}
                {(selectedUser.cnic_front_url || selectedUser.cnic_back_url) && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">CNIC Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.cnic_front_url && (
                        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100">
                            <p className="text-sm font-medium text-emerald-900">CNIC Front</p>
                          </div>
                          <div className="relative aspect-video bg-gray-50 group cursor-pointer"
                               onClick={() => setSelectedImage(selectedUser.cnic_front_url)}>
                            <img
                              src={selectedUser.cnic_front_url}
                              alt="CNIC Front"
                              className="w-full h-full object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 text-center">
                            <p className="text-xs text-emerald-600">Click to view full size</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.cnic_back_url && (
                        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100">
                            <p className="text-sm font-medium text-emerald-900">CNIC Back</p>
                          </div>
                          <div className="relative aspect-video bg-gray-50 group cursor-pointer"
                               onClick={() => setSelectedImage(selectedUser.cnic_back_url)}>
                            <img
                              src={selectedUser.cnic_back_url}
                              alt="CNIC Back"
                              className="w-full h-full object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 text-center">
                            <p className="text-xs text-emerald-600">Click to view full size</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Actions */}
                <div className="border-t pt-6">
                  {selectedUser.cnic_verified === 1 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                      <Check className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-900">Already Verified</p>
                        <p className="text-sm text-green-700">This user's CNIC has been verified</p>
                      </div>
                    </div>
                  ) : selectedUser.cnic_verified === 2 ? (
                    <div className="flex gap-4">
                      <button
                        onClick={handleVerifyCNIC}
                        disabled={verifying}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {verifying ? (
                          <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Approve CNIC
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleRejectCNIC}
                        disabled={verifying}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {verifying ? (
                          <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 mr-2" />
                            Reject CNIC
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700">
                        {selectedUser.cnic_verified === 0
                          ? 'CNIC not submitted yet'
                          : 'CNIC has been rejected'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-8 z-[60] animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm"
            title="Close (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-7xl max-h-full flex items-center justify-center w-full">
            {isPDF(selectedImage) ? (
              // PDF Viewer
              <iframe
                src={selectedImage}
                className="w-full h-[85vh] rounded-lg shadow-2xl bg-white"
                title="PDF Document"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              // Image Viewer
              <img
                src={selectedImage}
                alt="Document"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminModals;