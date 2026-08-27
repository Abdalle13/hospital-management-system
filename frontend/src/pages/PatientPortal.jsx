import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar, FileText, Receipt, Clock, Activity,
  LogOut, ShieldCheck, Bell, Plus, ArrowLeft,
  LayoutDashboard, UserCog, ChevronDown, ChevronUp,
} from 'lucide-react';
import api from '../utils/api';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { formatDate, formatCurrency } from '../utils/formatter';
import { logout } from '../redux/slices/authSlice';

const PROFILE_FORM_DEFAULTS = {
  age: '', gender: 'Male', bloodType: 'Unknown', phone: '', address: '',
  emergencyContact: { name: '', phone: '', relationship: '' },
};

const NAV_ITEMS = [
  { key: 'dashboard', label: 'My Portal', icon: LayoutDashboard },
  { key: 'appointments', label: 'My Appointments', icon: Calendar },
  { key: 'bills', label: 'My Bills', icon: Receipt },
  { key: 'records', label: 'My Medical Records', icon: FileText },
];

const PatientPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({ department: '', date: '', time: '09:00', reason: '' });
  const [requestStatus, setRequestStatus] = useState('idle');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [myPatientId, setMyPatientId] = useState(null);
  const [loaded, setLoaded] = useState({ appointments: false, bills: false, records: false });

  const [fullAppointments, setFullAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(PROFILE_FORM_DEFAULTS);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [showNotifications, setShowNotifications] = useState(false);
  const notifPanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    api.get('/dashboard/patient')
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'appointments' && !loaded.appointments) {
      setLoadingAppointments(true);
      Promise.all([
        api.get('/appointments').then((r) => r.data).catch(() => []),
        api.get('/appointments/requests/me').then((r) => r.data).catch(() => []),
      ])
        .then(([appointments, requests]) => {
          setFullAppointments(appointments);
          setPendingRequests(requests.filter((r) => r.status === 'Pending'));
        })
        .finally(() => { setLoadingAppointments(false); setLoaded((l) => ({ ...l, appointments: true })); });
    }
    if (activeTab === 'bills' && !loaded.bills) {
      setLoadingInvoices(true);
      api.get('/invoices')
        .then((r) => setInvoices(r.data))
        .catch(() => setInvoices([]))
        .finally(() => { setLoadingInvoices(false); setLoaded((l) => ({ ...l, bills: true })); });
    }
    if (activeTab === 'records' && !loaded.records) {
      setLoadingRecords(true);
      (async () => {
        try {
          let pid = myPatientId;
          if (!pid) {
            const { data: profile } = await api.get('/patients/me');
            pid = profile._id;
            setMyPatientId(pid);
          }
          const { data: recordData } = await api.get(`/records/${pid}`);
          setRecords(recordData);
        } catch (error) {
          setRecords([]);
        } finally {
          setLoadingRecords(false);
          setLoaded((l) => ({ ...l, records: true }));
        }
      })();
    }
  }, [activeTab]);

  const openProfile = async () => {
    setProfileError('');
    setShowProfileModal(true);
    try {
      const { data: profile } = await api.get('/patients/me');
      setProfileForm({
        age: profile.age ?? '',
        gender: profile.gender || 'Male',
        bloodType: profile.bloodType || 'Unknown',
        phone: profile.phone || '',
        address: profile.address || '',
        emergencyContact: profile.emergencyContact || { name: '', phone: '', relationship: '' },
      });
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Could not load your profile');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    try {
      await api.put('/patients/me', profileForm);
      setShowProfileModal(false);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestStatus('loading');
    try {
      await api.post('/appointments/public-request', {
        name: user.name,
        phone: user.phone,
        email: user.email,
        department: requestForm.department,
        date: requestForm.date,
        time: requestForm.time,
        message: requestForm.reason
      });
      setRequestStatus('success');
      setLoaded((l) => ({ ...l, appointments: false })); // force a refetch so the new request shows up
      setTimeout(() => {
        setRequestStatus('idle');
        setRequestForm({ department: '', date: '', time: '09:00', reason: '' });
      }, 3000);
    } catch (error) {
      setRequestStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFDFD]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const appointments = data?.recentAppointments || [];
  const upcomingAppointments = appointments.filter((apt) => apt.status === 'Scheduled');

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased overflow-x-hidden">

      {/* ================= FIXED SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between p-6 fixed h-full z-30">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SmartClinic</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left ${
                  activeTab === item.key
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
            <button onClick={openProfile} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all text-left">
              <UserCog size={18} />
              My Profile
            </button>
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-800 font-bold text-sm">
              {user?.name?.[0] || 'Z'}
            </div>
            <div className="truncate max-w-[110px]">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Zekovic 99'}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Verified Patient</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 min-w-0 md:pl-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={openProfile} className="md:hidden p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="My Profile">
              <UserCog size={18} />
            </button>
            <div className="relative" ref={notifPanelRef}>
              <button onClick={() => setShowNotifications((o) => !o)} className="p-2 text-slate-400 hover:text-emerald-600 relative transition-colors">
                <Bell size={18} />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-900">Notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {upcomingAppointments.length === 0 ? (
                      <p className="px-4 py-6 text-xs text-slate-400 text-center">You're all caught up.</p>
                    ) : (
                      upcomingAppointments.map((apt) => (
                        <button
                          key={apt._id}
                          onClick={() => { setShowNotifications(false); setActiveTab('appointments'); }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">Upcoming with {apt.doctor?.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(apt.date)} · {apt.time}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MOBILE TAB BAR — sidebar is desktop-only, so mobile needs its own nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-6 py-3 border-b border-slate-100 bg-white sticky top-16 z-10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === item.key ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-500'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* CONTENT BODY */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">

          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl px-6 py-4 text-white shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black">Welcome back, {user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-emerald-50 mt-0.5">Manage your appointments, records, and bills — all in one place.</p>
                </div>
                <Activity size={24} className="text-white/40 flex-shrink-0 hidden sm:block" />
              </div>

              <div className="grid lg:grid-cols-3 gap-8 items-start">

                {/* Left/Main Column: Stats Grid + Appointment Form */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Cards Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Upcoming', value: appointments.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'appointments' },
                      { label: 'History', value: data?.recordsCount || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'records' },
                      { label: 'Billing', value: data?.invoicesCount || 0, icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-50', tab: 'bills' },
                    ].map((stat) => (
                      <button
                        key={stat.label}
                        onClick={() => setActiveTab(stat.tab)}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md hover:border-emerald-100 transition-all text-left"
                      >
                        <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                          <stat.icon size={18} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Booking Form Card */}
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <Plus size={18} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Book an Appointment</h3>
                    </div>

                    {requestStatus === 'success' ? (
                      <div className="py-8 text-center bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                        <ShieldCheck size={40} className="mx-auto mb-2 text-emerald-600 animate-bounce" />
                        <p className="text-sm font-black">Request Sent Successfully!</p>
                        <p className="text-xs text-emerald-600/80 mt-1">Our medical team will contact you soon.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRequestSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Department</label>
                            <select
                              required
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                              value={requestForm.department}
                              onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })}
                            >
                              <option value="">Select Specialty</option>
                              <option value="General Medicine">General Medicine</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Laboratory">Laboratory</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Date</label>
                              <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" value={requestForm.date} onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })} />
                            </div>
                            <div>
                              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Time</label>
                              <input required type="time" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" value={requestForm.time} onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Concern / Reason</label>
                          <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-20 resize-none" placeholder="Briefly describe your health concern..." value={requestForm.reason} onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}></textarea>
                        </div>
                        <button type="submit" disabled={requestStatus === 'loading'} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50">
                          {requestStatus === 'loading' ? 'Sending...' : 'Confirm Appointment Request'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Right Column: Recent Activity Sidebar Card */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Activity</h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors">See All</button>
                  </div>

                  <div className="space-y-3">
                    {appointments.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Calendar size={24} className="mx-auto mb-2 opacity-40" />
                        <p className="text-xs font-semibold">No recent activity.</p>
                      </div>
                    ) : (
                      appointments.map((apt) => (
                        <div key={apt._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100/50 flex flex-col gap-2 hover:bg-slate-100/40 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-tight">{apt.doctor?.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{apt.doctor?.specialization}</p>
                            </div>
                            <Badge status={apt.status} />
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 text-[10px] text-slate-400 font-bold">
                            <span>{formatDate(apt.date)}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">My Appointments</h3>
              {loadingAppointments ? (
                <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
              ) : fullAppointments.length === 0 && pendingRequests.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Calendar size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-xs font-semibold">You have no appointments yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {pendingRequests.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Requests — awaiting confirmation</p>
                      <div className="space-y-3">
                        {pendingRequests.map((req) => (
                          <div key={req._id} className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-slate-900">{req.doctor ? `Dr. ${req.doctor.name}` : req.department}</p>
                              <p className="text-xs font-bold text-slate-400">{req.doctor?.specialization || req.department}</p>
                              {req.message && <p className="text-xs text-slate-500 mt-1">{req.message}</p>}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right text-xs text-slate-500 font-bold">
                                <p>{formatDate(req.date)}</p>
                                <p className="flex items-center gap-1 justify-end"><Clock size={12} /> {req.time}</p>
                              </div>
                              <Badge status="Pending" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {fullAppointments.length > 0 && (
                    <div className="space-y-3">
                      {pendingRequests.length > 0 && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Confirmed</p>
                      )}
                      {fullAppointments.map((apt) => (
                        <div key={apt._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-900">{apt.doctor?.name}</p>
                            <p className="text-xs font-bold text-slate-400">{apt.doctor?.specialization}</p>
                            {apt.reason && <p className="text-xs text-slate-500 mt-1">{apt.reason}</p>}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs text-slate-500 font-bold">
                              <p>{formatDate(apt.date)}</p>
                              <p className="flex items-center gap-1 justify-end"><Clock size={12} /> {apt.time}</p>
                            </div>
                            <Badge status={apt.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bills' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">My Bills</h3>
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <Receipt size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Online payment isn't available yet — please settle unpaid bills in person at the clinic
                  reception (cash, card, or insurance). Your invoice status here updates automatically once
                  reception records your payment.
                </p>
              </div>
              {loadingInvoices ? (
                <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Receipt size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-xs font-semibold">No invoices yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100/50 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-900">{inv.invoiceNumber}</p>
                        <p className="text-xs font-bold text-slate-400">Dr. {inv.doctor?.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black text-slate-900">{formatCurrency(inv.totalAmount)}</p>
                        <Badge status={inv.paymentStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">My Medical Records</h3>
              {loadingRecords ? (
                <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
              ) : records.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FileText size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-xs font-semibold">No medical records yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((rec) => (
                    <div key={rec._id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedRecord(expandedRecord === rec._id ? null : rec._id)}
                        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-900">{rec.diagnosis}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Dr. {rec.doctor?.name} · {formatDate(rec.createdAt)}</p>
                        </div>
                        {expandedRecord === rec._id ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                      </button>
                      {expandedRecord === rec._id && (
                        <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50/50">
                          {Object.values(rec.vitalSigns || {}).some(Boolean) && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vital Signs</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[['BP', rec.vitalSigns?.bloodPressure], ['Heart Rate', rec.vitalSigns?.heartRate], ['Temp', rec.vitalSigns?.temperature], ['Weight', rec.vitalSigns?.weight]].filter(([, v]) => v).map(([label, value]) => (
                                  <div key={label} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                                    <p className="text-[10px] text-slate-400">{label}</p>
                                    <p className="text-xs font-bold text-slate-900">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {rec.prescription?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prescriptions</p>
                              <div className="space-y-1.5">
                                {rec.prescription.map((rx, i) => (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-xs">
                                    <span className="font-bold text-slate-900">{rx.medication}</span>
                                    {rx.dosage && <span className="text-slate-500">· {rx.dosage}</span>}
                                    {rx.duration && <span className="text-slate-500">· {rx.duration}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {rec.notes && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                              <p className="text-xs text-slate-700 leading-relaxed">{rec.notes}</p>
                            </div>
                          )}
                          {rec.followUpDate && (
                            <p className="text-xs text-emerald-700 font-bold">Follow-up: {formatDate(rec.followUpDate)}</p>
                          )}
                          {rec.attachments?.length > 0 && (
                            <div className="flex gap-2 flex-wrap pt-1">
                              {rec.attachments.map((att, i) => (
                                <a key={i} href={att.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold">
                                  {att.name || 'View File'}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>

      {/* My Profile Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="My Profile" size="md">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileError && <p className="text-xs text-red-500">{profileError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input id="pp-age" label="Age" type="number" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} />
            <Select id="pp-gender" label="Gender" value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
              <option>Male</option><option>Female</option>
            </Select>
            <Select id="pp-blood" label="Blood Type" value={profileForm.bloodType} onChange={(e) => setProfileForm({ ...profileForm, bloodType: e.target.value })}>
              {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b}>{b}</option>)}
            </Select>
            <Input id="pp-phone" label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            <Input id="pp-address" label="Address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="col-span-2" />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-3">
              <Input id="pp-ec-name" label="Name" value={profileForm.emergencyContact?.name || ''} onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: { ...profileForm.emergencyContact, name: e.target.value } })} />
              <Input id="pp-ec-phone" label="Phone" value={profileForm.emergencyContact?.phone || ''} onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: { ...profileForm.emergencyContact, phone: e.target.value } })} />
              <Input id="pp-ec-rel" label="Relationship" value={profileForm.emergencyContact?.relationship || ''} onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: { ...profileForm.emergencyContact, relationship: e.target.value } })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowProfileModal(false)}>Cancel</Button>
            <Button type="submit" loading={savingProfile}>Save Profile</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientPortal;
