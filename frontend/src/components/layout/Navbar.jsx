import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Calendar, Clock } from 'lucide-react';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatter';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patient Management',
  '/doctors': 'Doctor Management',
  '/staff': 'Staff Management',
  '/appointments': 'Appointments',
  '/records': 'Medical Records',
  '/pharmacy': 'Pharmacy & Inventory',
  '/invoices': 'Billing & Invoices',
  '/settings': 'Settings',
  '/portal': 'My Portal',
};

const Navbar = ({ onMenuClick }) => {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const panelRef = useRef(null);

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'Hospital Management';

  useEffect(() => {
    const load = async () => {
      setLoadingNotifications(true);
      try {
        if (user?.role === 'admin' || user?.role === 'receptionist') {
          const { data } = await api.get('/appointments/requests');
          setNotifications(
            data.filter((r) => r.status === 'Pending').map((r) => ({
              id: r._id,
              title: `${r.name} requested an appointment`,
              subtitle: `${r.department} · ${formatDate(r.date)} at ${r.time}`,
              icon: Calendar,
            }))
          );
        } else if (user?.role === 'doctor') {
          const { data } = await api.get('/appointments', { params: { filter: 'today' } });
          setNotifications(
            data.filter((a) => a.status !== 'Cancelled').map((a) => ({
              id: a._id,
              title: `Appointment with ${a.patient?.name || 'patient'} today`,
              subtitle: `${a.time} · ${a.status}`,
              icon: Clock,
            }))
          );
        }
      } catch (error) {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };
    load();
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToNotifications = () => {
    setOpen(false);
    navigate('/appointments');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile only */}
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients, doctors, invoices..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <p className="px-4 py-6 text-xs text-gray-400 text-center">Loading…</p>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-6 text-xs text-gray-400 text-center">You're all caught up.</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={goToNotifications}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <n.icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{n.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{n.subtitle}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <button onClick={goToNotifications} className="w-full px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-gray-100">
                  View All
                </button>
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
