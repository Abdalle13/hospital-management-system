import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Activity } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const isPatient = user?.role === 'patient';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {!isPatient && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isPatient && (
          <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="ml-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">SmartClinic</span>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
