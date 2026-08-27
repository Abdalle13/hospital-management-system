import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, LogOut } from 'lucide-react';
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

  const goToSection = (hash) => {
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${hash}`);
    }
  };

  const handlePatientPortal = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'patient') {
      navigate('/portal');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const goHome = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
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

        <div className="flex items-center gap-3">
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
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Log In</button>
              <Button onClick={handlePatientPortal} className="shadow-lg shadow-emerald-500/20">Patient Portal</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
