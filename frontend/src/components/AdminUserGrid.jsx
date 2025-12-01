import React, { useState } from 'react';
import { useToast } from './ToastProvider';
import axios from 'axios';
import {
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
} from 'lucide-react';

const AdminUserGrid = ({
  users,
  page,
  totalPages,
  onPageChange,
  onViewUserDetails,
  currentAdmin,
  startIndex = 0,
}) => {
  const { showToast } = useToast();

  // Get status badge styling
  const getStatusBadge = (cnicVerified) => {
    switch (cnicVerified) {
      case 0:
        return {
          text: 'Not Submitted',
          className: 'bg-gray-100 text-gray-700 border border-gray-300',
        };
      case 1:
        return {
          text: 'Verified',
          className: 'bg-green-100 text-green-700 border border-green-300',
        };
      case 2:
        return {
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
        };
      case 3:
        return {
          text: 'Rejected',
          className: 'bg-red-100 text-red-700 border border-red-300',
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-700 border border-gray-300',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Users Grid */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-50 border-b border-emerald-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  CNIC
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  Verification Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const statusBadge = getStatusBadge(user.cnic_verified);
                  return (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.city || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.phone_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {user.cnic || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewUserDetails(user)}
                          className="flex items-center px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-md">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserGrid;
