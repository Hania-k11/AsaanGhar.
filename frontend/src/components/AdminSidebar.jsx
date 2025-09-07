// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Building, Home, Users, BarChart3, Settings } from 'lucide-react';

const AdminSidebar = ({ sidebarActive, setSidebarActive }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-emerald-100 rounded-lg w-10 h-10 flex items-center justify-center">
            <Home className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="ml-3">
            <div className="text-lg font-semibold text-gray-800">Asaan Ghar</div>
            <div className="text-sm text-gray-600">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          <button
            onClick={() => setSidebarActive('properties')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
              sidebarActive === 'properties' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Properties
          </button>
          <button
            onClick={() => setSidebarActive('admins')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
              sidebarActive === 'admins' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Admin Users
          </button>
          <button
            onClick={() => setSidebarActive('analytics')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
              sidebarActive === 'analytics' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </button>
          <button
            onClick={() => setSidebarActive('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
              sidebarActive === 'settings' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;