import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load user list');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const changeRole = async (userId, role) => {
    try {
      await adminService.updateUser(userId, { role });
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role } : user)));
    } catch (err) {
      console.error(err);
      alert('Failed to update user role');
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm('Remove this user from the system?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400">Monitor registered users and manage roles for administrators, teachers, and students.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-slate-900 p-8 text-slate-200">Loading users...</div>
      ) : error ? (
        <div className="rounded-xl bg-red-800 p-8 text-white">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900 shadow-lg">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-800/80">
                  <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none"
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeUser(user._id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
