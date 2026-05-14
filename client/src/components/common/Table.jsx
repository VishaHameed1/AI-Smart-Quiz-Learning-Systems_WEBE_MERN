import React from 'react';
import { Search, Download, MoreVertical } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Table = ({
  data,
  columns,
  loading,
  error,
  onRetry,
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onExportCSV,
  onRoleChange, // Specific to user management table
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900">User Management</h3>
        <div className="flex items-center gap-3">
          {onExportCSV && (
            <button 
              onClick={onExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          {onRoleFilterChange && (
            <select 
              className="bg-slate-50 border-none rounded-2xl text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-12 text-center">
          <p className="text-rose-500 font-medium mb-4">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-4 font-semibold ${col.headerClassName || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-slate-50/50 transition">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                      {col.render ? col.render(row, onRoleChange) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;