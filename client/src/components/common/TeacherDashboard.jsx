import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart2, Clock, PlusCircle, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import DatePicker from 'react-datepicker';
import LoadingSpinner from './LoadingSpinner';

const TeacherDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1))); // Default to last month
  const [endDate, setEndDate] = useState(new Date());
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [folderCount, setFolderCount] = useState(0);

  const fetchTrendData = async () => {
    try {
      setTrendLoading(true);
      setTrendError(null);
      const response = await api.get('/teacher/analytics/performance-trend', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setTrendData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching trend data:', error);
      setTrendError('Failed to load performance trends.');
    } finally {
      setTrendLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await api.get('/teacher/analytics/recent-activities');
        setActivities(response.data.data || []);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/teacher');
        setDashboardStats(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    const fetchFolders = async () => {
      try {
        const res = await api.get('/teacher/folders');
        setFolderCount(res.data.data?.length || 0);
      } catch (err) {}
    };

    fetchRecentActivities();
    fetchTrendData(); // Initial fetch
    fetchDashboardData();
    fetchFolders();
  }, []);

  const stats = [
    { label: 'Total Students', value: dashboardStats?.totalStudentsWhoAttemptedMyQuizzes || '0', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Total Quizzes', value: dashboardStats?.totalQuizzesCreated || '0', icon: <BookOpen className="w-6 h-6" />, color: 'bg-emerald-500' },
    { label: 'Avg. Score', value: `${dashboardStats?.averageScoreOnMyQuizzes || 0}%`, icon: <BarChart2 className="w-6 h-6" />, color: 'bg-violet-500' },
    { label: 'Enrollment Requests', value: dashboardStats?.pendingEnrollmentsCount || '0', icon: <Clock className="w-6 h-6" />, color: dashboardStats?.pendingEnrollmentsCount > 0 ? 'bg-rose-500' : 'bg-slate-500' },
    { label: 'Content Folders', value: folderCount, icon: <Folder className="w-6 h-6" />, color: 'bg-cyan-500' },
  ];

  useEffect(() => {
    fetchTrendData(); // Refetch when date range changes
  }, [startDate, endDate]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Overview</h1>
          <p className="text-slate-500 text-sm">Manage your classes and monitor performance.</p>
        </div>
        <Link to="/teacher/create-quiz" className="glow-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
          <PlusCircle className="w-4 h-4" />
          Create New Quiz
        </Link>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[350px]">
          <h3 className="font-bold text-slate-900 mb-6">Class Performance Trend</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-xs font-medium text-slate-500 mb-1">From</label>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-xs font-medium text-slate-500 mb-1">To</label>
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {trendLoading ? (
              <LoadingSpinner />
            ) : trendError ? (
              <div className="text-center">
                <p className="text-sm text-rose-500 mb-3">{trendError}</p>
                <button 
                  onClick={fetchTrendData}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[350px]">
          <h3 className="font-bold text-slate-900 mb-6">Recent Activity Feed</h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{activity.studentName}</span>
                    <span className="text-xs text-slate-500">Completed: {activity.quizTitle}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{activity.score}%</span>
                </div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">No recent activity found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;