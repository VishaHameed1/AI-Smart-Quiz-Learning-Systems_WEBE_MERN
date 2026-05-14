import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Cpu, Settings, MoreVertical } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Table from './Table'; // Import the new Table component

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/users');
      // Handle response format from Person A/B structure
      const userData = response.data.data || response.data;
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const rows = filteredUsers.map(user => [
      `"${user.name}"`,
      `"${user.email}"`,
      user.role,
      user.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/api/users/${id}`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error(`Failed to update user ${id} to role ${newRole}:`, error);
      alert('Failed to update user role');
    }
  };

  const stats = [
    { label: 'Total Platform Users', value: '1,284', icon: <Users className="w-6 h-6" />, color: 'bg-indigo-600' },
    { label: 'System Uptime', value: '99.9%', icon: <Activity className="w-6 h-6" />, color: 'bg-emerald-600' },
    { label: 'AI Tokens Used', value: '45.2k', icon: <Cpu className="w-6 h-6" />, color: 'bg-amber-600' },
    { label: 'Active Sessions', value: '89', icon: <Shield className="w-6 h-6" />, color: 'bg-rose-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500 text-sm">System-wide monitoring and user management.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <Settings className="w-4 h-4" />
          System Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* User Management Table */}
      <Table
        data={filteredUsers}
        columns={[
          {
            header: 'User',
            accessor: 'name',
            render: (user) => (
              <>
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </>
            ),
          },
          {
            header: 'Role',
            accessor: 'role',
            render: (user, onRoleChange) => (
              <select 
                className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 text-slate-700 cursor-pointer"
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            ),
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (user) => (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
              }`}>
                {user.status}
              </span>
            ),
          },
          {
            header: 'Actions',
            headerClassName: 'text-right',
            render: () => <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>,
            className: 'text-right',
          },
        ]}
        loading={loading}
        error={error}
        onRetry={fetchUsers}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onExportCSV={handleExportCSV}
        onRoleChange={handleRoleChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[300px]">
          <h3 className="font-bold text-slate-900 mb-4">Server Status</h3>
          <div className="space-y-4">
            {['Database', 'Gemini AI API', 'Auth Service', 'Storage'].map(service => (
              <div key={service} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{service}</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;