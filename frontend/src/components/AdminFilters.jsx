// src/components/admin/AdminFilters.jsx
import React from 'react';
import { Search } from 'lucide-react';

const AdminFilters = ({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  
  properties, 
  
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'all' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Properties
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'pending' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending Properties 
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'approved' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Approved Properties 
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'rejected' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rejected Properties 
          </button>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
            />
          </div>
          
          {/* <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select> */}
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;