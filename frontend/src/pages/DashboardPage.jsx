import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, UserCog, Calendar, DollarSign,
  Plus, CalendarPlus, UserPlus, ChevronRight,
} from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { formatDate, formatCurrency } from '../utils/formatter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-card rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-emerald-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-1.5">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenueChart = data?.revenueChart || [];
  const recentAppointments = data?.recentAppointments || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Welcome back — here's what's happening today</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/patients')} className="btn-secondary hidden sm:flex">
            <UserPlus size={16} /> Add Patient
          </button>
          <button onClick={() => navigate('/appointments')} className="btn-primary">
            <CalendarPlus size={16} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Patients" value={stats.totalPatients || 0} icon={Users}
          iconColor="text-emerald-500" iconBg="bg-emerald-50" trend="up" trendValue="+12%" />
        <StatCard index={1} title="Total Doctors" value={stats.totalDoctors || 0} icon={UserCog}
          iconColor="text-blue-500" iconBg="bg-blue-50" trend="up" trendValue="+2" />
        <StatCard index={2} title="Appointments Today" value={stats.appointmentsToday || 0} icon={Calendar}
          iconColor="text-purple-500" iconBg="bg-purple-50" />
        <StatCard index={3} title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign}
          iconColor="text-amber-500" iconBg="bg-amber-50" trend="up" trendValue="+8.2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Revenue collected this year</p>
            </div>
            <span className="text-sm font-semibold text-emerald-600">{formatCurrency(stats.totalRevenue)}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="card p-6"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Register Patient', icon: UserPlus, to: '/patients', color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Book Appointment', icon: CalendarPlus, to: '/appointments', color: 'text-blue-600 bg-blue-50' },
              { label: 'Add Doctor', icon: Plus, to: '/doctors', color: 'text-purple-600 bg-purple-50' },
              { label: 'View Invoices', icon: DollarSign, to: '/invoices', color: 'text-amber-600 bg-amber-50' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 flex-1 text-left">{label}</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Recent Appointments</h3>
          <button onClick={() => navigate('/appointments')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                {['Patient', 'Doctor', 'Date', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">No appointments yet</td>
                </tr>
              ) : (
                recentAppointments.map((apt, i) => (
                  <tr key={apt._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{apt.patient?.name || '—'}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{apt.doctor?.name || '—'}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">{formatDate(apt.date)}</td>
                    <td className="px-6 py-3.5"><Badge status={apt.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
