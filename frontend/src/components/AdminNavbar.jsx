// src/components/admin/AdminNavbar.jsx

import React, { useState } from "react";
import { Home, Users, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = ({ navbarActive, setNavbarActive }) => {
  const { logoutAdmin, admin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      window.location.href = "/admin-panel";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="w-full bg-emerald-800  shadow-lg">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Left - Brand */}
        <div className="flex items-center">
          <div className="bg-emerald-700 rounded-lg w-10 h-10 flex items-center justify-center border border-emerald-600">
            <Home className="w-6 h-6 text-emerald-100" />
          </div>
          <div className="ml-3">
            <div className="text-lg font-semibold text-white">Asaan Ghar</div>
            <div className="text-sm text-emerald-200">Admin Panel</div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 rounded-md text-emerald-100 hover:bg-emerald-700 border border-transparent hover:border-emerald-600 transition-all duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop - Right */}
        <div className="hidden sm:flex flex-1 items-center justify-between">
          {/* Center - Nav Links */}
          <nav className="flex space-x-2 mx-auto">
            <button
              onClick={() => setNavbarActive("properties")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                navbarActive === "properties"
                  ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                  : "text-emerald-100 hover:bg-emerald-700 hover:text-white hover:border-emerald-600 border border-transparent"
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Properties
            </button>

            <button
              onClick={() => setNavbarActive("users")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                navbarActive === "users"
                  ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                  : "text-emerald-100 hover:bg-emerald-700 hover:text-white hover:border-emerald-600 border border-transparent"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </button>

          </nav>

          {/* Right - User Info + Logout */}
          <div className="flex items-center space-x-3">
            {admin && (
              <div className="flex items-center space-x-2 px-3 py-2 border-emerald-600">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-500">
                  <UserIcon className="w-4 h-4 text-emerald-100" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white truncate max-w-[120px]">
                    {admin.name}
                  </div>
                  <div className="text-emerald-200 text-xs truncate max-w-[120px]">
                    {admin.email}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 border border-transparent hover:border-red-500"
              title="Logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-emerald-800 border-t border-emerald-700">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setNavbarActive("properties");
                setMobileOpen(false);
              }}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                navbarActive === "properties"
                  ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                  : "text-emerald-100 hover:bg-emerald-700 hover:text-white hover:border-emerald-600 border border-transparent"
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Properties
            </button>

            <button
              onClick={() => {
                setNavbarActive("users");
                setMobileOpen(false);
              }}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                navbarActive === "users"
                  ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                  : "text-emerald-100 hover:bg-emerald-700 hover:text-white hover:border-emerald-600 border border-transparent"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </button>
          </nav>

          {admin && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-700 rounded-lg mt-3 border border-emerald-600">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-500">
                <UserIcon className="w-4 h-4 text-emerald-100" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">{admin.name}</div>
                <div className="text-emerald-200 text-xs">{admin.email}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-3 flex items-center px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 w-full justify-center border border-transparent hover:border-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;