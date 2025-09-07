// src/components/admin/AdminHeader.jsx
import React from 'react';
import { Bell, LogOut } from 'lucide-react';

const AdminHeader = ({ currentAdmin, onLogout }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
          <p className="text-gray-600">Welcome back, {currentAdmin.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-emerald-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;