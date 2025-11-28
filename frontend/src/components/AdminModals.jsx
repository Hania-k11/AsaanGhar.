// src/components/admin/AdminModals.jsx
import React, { useState, useEffect } from 'react';
import { X, FileText, Download, ZoomIn, Loader } from 'lucide-react';
import axios from 'axios';

const AdminModals = ({
  showPropertyDetails,
  setShowPropertyDetails,
  showDocuments,
  setShowDocuments,
  selectedProperty,
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.doc_type]) {
      acc[doc.doc_type] = [];
    }
    acc[doc.doc_type].push(doc);
    return acc;
  }, {});

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
                        {docs.map((doc) => (
                          <div
                            key={doc.document_id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative aspect-video bg-gray-100">
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
                            </div>
                            <div className="p-3">
                              <p className="text-xs text-gray-500">
                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                              <a
                                href={doc.doc_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 flex items-center justify-center w-full px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30  bg-opacity-90 flex items-center justify-center p-4 z-[60]"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Document"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={selectedImage}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </a>
        </div>
      )}
    </>
  );
};

export default AdminModals;