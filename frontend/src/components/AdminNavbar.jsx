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
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between px-6 sm:px-8 py-4 max-w-7xl mx-auto">
        {/* Left - Brand */}
        <div className="flex items-center group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl w-11 h-11 flex items-center justify-center border border-emerald-400/30 shadow-lg">
              <Home className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Asaan Ghar
            </div>
            <div className="text-xs font-medium text-slate-400 tracking-wider uppercase">
              Admin Dashboard
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop - Right */}
        <div className="hidden sm:flex flex-1 items-center justify-end ml-8">
          {/* Nav Links - Left aligned in remaining space */}
          <nav className="flex space-x-3 mr-auto">
            <button
              onClick={() => setNavbarActive("properties")}
              className={`group relative flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                navbarActive === "properties"
                  ? "text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {navbarActive === "properties" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl"></div>
              )}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                navbarActive === "properties" 
                  ? "bg-transparent" 
                  : "bg-slate-700/30 group-hover:bg-slate-700/50 border border-slate-600/50"
              }`}></div>
              <Home className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Properties</span>
            </button>

            <button
              onClick={() => setNavbarActive("users")}
              className={`group relative flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                navbarActive === "users"
                  ? "text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {navbarActive === "users" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl"></div>
              )}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                navbarActive === "users" 
                  ? "bg-transparent" 
                  : "bg-slate-700/30 group-hover:bg-slate-700/50 border border-slate-600/50"
              }`}></div>
              <Users className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Users</span>
            </button>
          </nav>

          {/* Right - User Info + Logout */}
          <div className="flex items-center space-x-3">
            {admin && (
              <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur opacity-60"></div>
                  <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center border border-emerald-400/30 shadow-lg">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-white truncate max-w-[130px]">
                    {admin.name}
                  </div>
                  <div className="text-slate-400 text-xs truncate max-w-[130px]">
                    {admin.email}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="group relative flex items-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 overflow-hidden"
              title="Logout"
            >
              <div className="absolute inset-0 bg-slate-700/30 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600 transition-all duration-300 border border-slate-600/50 group-hover:border-red-500/50 rounded-xl"></div>
              <LogOut className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700/50 backdrop-blur-xl">
          <nav className="flex flex-col space-y-2 pt-3">
            <button
              onClick={() => {
                setNavbarActive("properties");
                setMobileOpen(false);
              }}
              className={`group relative flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                navbarActive === "properties"
                  ? "text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-300"
              }`}
            >
              {navbarActive === "properties" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl"></div>
              )}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                navbarActive === "properties" 
                  ? "bg-transparent" 
                  : "bg-slate-700/30 border border-slate-600/50"
              }`}></div>
              <Home className="w-4 h-4 mr-3 relative z-10" />
              <span className="relative z-10">Properties</span>
            </button>

            <button
              onClick={() => {
                setNavbarActive("users");
                setMobileOpen(false);
              }}
              className={`group relative flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                navbarActive === "users"
                  ? "text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-300"
              }`}
            >
              {navbarActive === "users" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl"></div>
              )}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                navbarActive === "users" 
                  ? "bg-transparent" 
                  : "bg-slate-700/30 border border-slate-600/50"
              }`}></div>
              <Users className="w-4 h-4 mr-3 relative z-10" />
              <span className="relative z-10">Users</span>
            </button>
          </nav>

          {admin && (
            <div className="flex items-center space-x-3 px-4 py-3 bg-slate-700/30 rounded-xl border border-slate-600/50 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur opacity-60"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center border border-emerald-400/30 shadow-lg">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">{admin.name}</div>
                <div className="text-slate-400 text-xs">{admin.email}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="group relative flex items-center px-4 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 w-full justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-slate-700/30 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600 transition-all duration-300 border border-slate-600/50 group-hover:border-red-500/50 rounded-xl"></div>
            <LogOut className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;