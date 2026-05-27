import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patient Management',
  '/doctors': 'Doctor Management',
  '/appointments': 'Appointments',
  '/records': 'Medical Records',
  '/invoices': 'Billing & Invoices',
  '/settings': 'Settings',
};

const Navbar = ({ onMenuClick }) => {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'Hospital Management';

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
        <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>

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
