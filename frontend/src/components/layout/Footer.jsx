import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Activity, MapPin, Phone, Mail } from 'lucide-react';

const Facebook = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);
const XLogo = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);
const Instagram = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TikTok = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.03-1.03-2.28-1.39-3.41-4.09-2.61-6.6.35-1.08 1.02-2.05 1.89-2.76 1.19-.94 2.73-1.4 4.25-1.31.03.01.06.01.08.02V12.7c-1.05-.13-2.15.11-3.03.73-.83.56-1.35 1.48-1.47 2.47-.13 1.05.21 2.13.91 2.91.73.83 1.8 1.33 2.9 1.36 1.06.01 2.09-.43 2.8-1.22.7-.8.98-1.89.85-2.94-.02-2.11 0-4.22 0-6.33V0z" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const handlePatientPortal = () => {
    if (!user) navigate('/login');
    else if (user.role === 'patient') navigate('/portal');
    else navigate('/dashboard');
  };

  const goHomeSection = (hash) => {
    if (location.pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${hash}`);
    }
  };

  return (
    <footer className="bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SmartClinic</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming the healthcare experience through technology, compassion, and clinical excellence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <XLogo size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
                <TikTok size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Home</button></li>
              <li><button onClick={() => goHomeSection('#about')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">About Us</button></li>
              <li><button onClick={() => goHomeSection('#doctors')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Our Doctors</button></li>
              <li><button onClick={() => goHomeSection('#services')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Services</button></li>
              <li><button onClick={handlePatientPortal} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Patient Portal</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
                <span>KM4 Area, Wadada Maka Al Mukarama,<br />Mogadishu, Somalia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-emerald-500 flex-shrink-0" />
                <span>+252 61 9157381</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-emerald-500 flex-shrink-0" />
                <span>contact@smartclinic.com</span>
              </li>
            </ul>
          </div>

          {/* Open Hours */}
          <div>
            <h4 className="text-white font-bold mb-6">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className="text-gray-400">Monday - Sunday</span>
                <span className="text-emerald-400 font-medium">Open 24 Hours</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-400">Emergency Services</span>
                <span className="text-emerald-400 font-medium">Available 24/7</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 SmartClinic. Created by Abdalle.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-service')} className="hover:text-emerald-400 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
