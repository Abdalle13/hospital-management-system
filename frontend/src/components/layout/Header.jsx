import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, LogOut, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { logout } from '../../redux/slices/authSlice';

const NAV_LINKS = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Doctors', hash: '#doctors' },
  { name: 'Services', hash: '#services' },
  { name: 'Reviews', hash: '#reviews' },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const isHome = location.pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const goToSection = (hash) => {
    setMobileOpen(false);
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${hash}`);
    }
  };

  const handlePatientPortal = () => {
    setMobileOpen(false);
    if (!user) {
      navigate('/login');
    } else if (user.role === 'patient') {
      navigate('/portal');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setMobileOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const goHome = () => {
    setMobileOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav ref={menuRef} className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <button onClick={goHome} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Activity size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartClinic</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => (link.path ? navigate(link.path) : goToSection(link.hash))}
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button onClick={handlePatientPortal} className="shadow-lg shadow-emerald-500/20">
                {user.role === 'patient' ? 'Go to Portal' : 'Dashboard'}
              </Button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Log In</button>
              <Button onClick={handlePatientPortal} className="shadow-lg shadow-emerald-500/20">Patient Portal</Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 text-gray-600 hover:text-emerald-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 sm:px-6 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                if (link.path) { setMobileOpen(false); navigate(link.path); }
                else goToSection(link.hash);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Button onClick={handlePatientPortal} className="w-full justify-center shadow-lg shadow-emerald-500/20">
                  {user.role === 'patient' ? 'Go to Portal' : 'Dashboard'}
                </Button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Log In
                </button>
                <Button onClick={handlePatientPortal} className="w-full justify-center shadow-lg shadow-emerald-500/20">Patient Portal</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
