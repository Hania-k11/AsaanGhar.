// src/components/admin/AdminStats.jsx
import React from 'react';
import { Clock, Check, X, Building } from 'lucide-react';

const AdminStats = ({ properties }) => {
  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const approvedCount = properties.filter(p => p.status === 'approved').length;
  const rejectedCount = properties.filter(p => p.status === 'rejected').length;
  const totalCount = properties.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-yellow-100 rounded-lg p-3">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-green-100 rounded-lg p-3">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-800">{approvedCount}</div>
            <div className="text-gray-600">Approved</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-red-100 rounded-lg p-3">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-800">{rejectedCount}</div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-emerald-100 rounded-lg p-3">
            <Building className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
            <div className="text-gray-600">Total Properties</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;