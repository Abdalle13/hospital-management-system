// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';

// import { motion } from 'framer-motion';
// import { 
//   Calendar, FileText, Receipt, User, 
//   Clock, ChevronRight, Activity,
//   LogOut, Phone, ShieldCheck, Bell, 
//   Plus, ArrowUpRight, Heart, ArrowLeft,
//   MapPin, Mail
// } from 'lucide-react';
// import api from '../utils/api';
// import Badge from '../components/ui/Badge';
// import { formatDate } from '../utils/formatter';
// import { logout } from '../redux/slices/authSlice';

// // Social Icons - Exact Copy from LandingPage
// const Facebook = ({ size = 24, ...props }) => (
//   <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" />
//   </svg>
// );
// const XLogo = ({ size = 24, ...props }) => (
//   <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
//   </svg>
// );
// const Instagram = ({ size = 24, ...props }) => (
//   <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//   </svg>
// );
// const TikTok = ({ size = 24, ...props }) => (
//   <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.03-1.03-2.28-1.39-3.41-4.09-2.61-6.6.35-1.08 1.02-2.05 1.89-2.76 1.19-.94 2.73-1.4 4.25-1.31.03.01.06.01.08.02V12.7c-1.05-.13-2.15.11-3.03.73-.83.56-1.35 1.48-1.47 2.47-.13 1.05.21 2.13.91 2.91.73.83 1.8 1.33 2.9 1.36 1.06.01 2.09-.43 2.8-1.22.7-.8.98-1.89.85-2.94-.02-2.11 0-4.22 0-6.33V0z" />
//   </svg>
// );

// const PatientPortal = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [requestForm, setRequestForm] = useState({ department: '', date: '', time: '09:00', reason: '' });
//   const [requestStatus, setRequestStatus] = useState('idle');

//   useEffect(() => {
//     api.get('/dashboard/patient')
//       .then((r) => setData(r.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();
//     setRequestStatus('loading');
//     try {
//       // Send the request with the logged-in user's details
//       await api.post('/appointments/public-request', {
//         name: user.name,
//         phone: user.phone,
//         department: requestForm.department,
//         date: requestForm.date,
//         time: requestForm.time,
//         message: requestForm.reason
//       });
//       setRequestStatus('success');
//       setTimeout(() => {
//         setShowRequestForm(false);
//         setRequestStatus('idle');
//         setRequestForm({ department: '', date: '', time: '09:00', reason: '' });
//       }, 3000);
//     } catch (error) {
//       setRequestStatus('error');
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#FDFDFD]">
//         <div className="relative w-16 h-16">
//           <div className="absolute inset-0 border-4 border-emerald-50 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   const appointments = data?.recentAppointments || [];

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100 pt-20 overflow-x-hidden">
//       {/* Sleek Top Navigation - Matched with Landing Page Style */}
//       <nav className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => navigate('/')}
//               className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all border border-slate-100"
//               title="Back to Home"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <Link to="/" className="flex items-center gap-3 group cursor-pointer">
//               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
//                 <Activity size={22} className="text-white" />
//               </div>
//               <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartClinic</span>
//             </Link>

//           </div>

//           <div className="flex items-center gap-4 sm:gap-6">
//             <button className="hidden md:flex p-2 text-slate-400 hover:text-emerald-600 transition-colors">
//               <Bell size={20} />
//             </button>
//             <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
//               <div className="text-right hidden sm:block">
//                 <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name}</p>
//                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Verified Patient</p>
//               </div>
//               <button 
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100"
//               >
//                 <LogOut size={16} />
//                 <span className="hidden sm:inline">Sign Out</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

//         <div className="space-y-12">

//           <div className="grid lg:grid-cols-12 gap-12">
//             {/* Left Column: Stats Cards */}
//             <div className="lg:col-span-4 space-y-6">
//               {[
//                 { label: 'Upcoming', value: appointments.length, icon: Calendar, color: 'emerald', bg: 'bg-emerald-50' },
//                 { label: 'History', value: data?.recordsCount || 0, icon: FileText, color: 'blue', bg: 'bg-blue-50' },
//                 { label: 'Billing', value: data?.invoicesCount || 0, icon: Receipt, color: 'indigo', bg: 'bg-indigo-50' },
//               ].map((stat, idx) => (
//                 <motion.div 
//                   key={stat.label}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: idx * 0.1 }}
//                   whileHover={{ x: 6 }}
//                   className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-50 transition-all cursor-pointer group relative overflow-hidden"
//                   onClick={() => navigate(stat.label === 'Upcoming' ? '/appointments' : stat.label === 'History' ? '/records' : '/invoices')}
//                 >
//                   <div className="flex items-center gap-6">
//                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-900 group-hover:${stat.bg} group-hover:text-white transition-all duration-500`}>
//                       <stat.icon size={24} />
//                     </div>
//                     <div>
//                       <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
//                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
//                     </div>
//                     <ArrowUpRight size={16} className="ml-auto text-slate-300 group-hover:text-emerald-500" />
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Right Column: Booking Form */}
//             <div className="lg:col-span-8 space-y-8">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
//                   <Plus size={20} />
//                 </div>
//                 <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Book an Appointment</h2>
//               </div>

//               <motion.div 
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-[2.5rem] border-2 border-emerald-100 p-8 shadow-2xl shadow-emerald-50"
//               >
//                 {requestStatus === 'success' ? (
//                   <div className="py-8 text-center">
//                     <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <ShieldCheck size={32} />
//                     </div>
//                     <h4 className="text-xl font-black text-slate-900 mb-2">Request Sent Successfully!</h4>
//                     <p className="text-sm text-slate-500">Our team will contact you shortly.</p>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleRequestSubmit} className="space-y-6">
//                     <div className="grid sm:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
//                         <select 
//                           required
//                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
//                           value={requestForm.department}
//                           onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })}
//                         >
//                           <option value="">Select Specialty</option>
//                           <option value="General Medicine">General Medicine</option>
//                           <option value="Pediatrics">Pediatrics</option>
//                           <option value="Cardiology">Cardiology</option>
//                           <option value="Laboratory">Laboratory</option>
//                         </select>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
//                           <input required type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" value={requestForm.date} onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })} />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Time</label>
//                           <input required type="time" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" value={requestForm.time} onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })} />
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Concern / Reason</label>
//                       <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-24 resize-none" placeholder="Briefly describe your health concern..." value={requestForm.reason} onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}></textarea>
//                     </div>
//                     <button type="submit" disabled={requestStatus === 'loading'} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50">
//                       {requestStatus === 'loading' ? 'Sending...' : 'Confirm Appointment Request'}
//                     </button>
//                   </form>
//                 )}
//               </motion.div>
//             </div>
//           </div>

//           {/* Recent Activity: Full Width Below */}
//           <div className="space-y-6">
//             <div className="flex items-center justify-between px-2">
//               <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
//               <button onClick={() => navigate('/appointments')} className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest">View History</button>
//             </div>

//             <div className="space-y-4">
//               {appointments.length === 0 ? (
//                 <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center">
//                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
//                     <Calendar size={32} />
//                   </div>
//                   <p className="text-slate-400 font-bold text-sm">No clinical activity found.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {appointments.map((apt, idx) => (
//                     <motion.div 
//                       key={apt._id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.2 + idx * 0.1 }}
//                       className="group flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-50 transition-all duration-500"
//                     >
//                       <div className="flex items-center gap-6 flex-1">
//                         <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700">
//                           {apt.doctor?.name?.[0]}
//                         </div>
//                         <div>
//                           <p className="text-lg font-black text-slate-900 leading-tight mb-1">{apt.doctor?.name}</p>
//                           <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
//                             {apt.doctor?.specialization}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between md:justify-end gap-12 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
//                         <div className="text-left md:text-right">
//                           <p className="text-sm font-black text-slate-900 mb-1">{formatDate(apt.date)}</p>
//                           <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
//                             <Clock size={14} className="text-emerald-500" /> {apt.time}
//                           </div>
//                         </div>
//                         <Badge status={apt.status} />
//                         <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//       </main>



//       {/* Footer - Exact 1:1 Copy from LandingPage */}
//       <footer className="bg-gray-900 pt-20 pb-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

//             {/* Brand */}
//             <div className="space-y-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
//                   <Activity size={18} className="text-white" />
//                 </div>
//                 <span className="text-xl font-bold text-white tracking-tight">SmartClinic</span>
//               </div>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 Transforming the healthcare experience through technology, compassion, and clinical excellence.
//               </p>
//               <div className="flex gap-3">
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
//                   <Facebook size={16} />
//                 </a>
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
//                   <XLogo size={14} />
//                 </a>
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
//                   <Instagram size={16} />
//                 </a>
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-colors">
//                   <TikTok size={16} />
//                 </a>
//               </div>
//             </div>

//             <div>
//               <h4 className="text-white font-bold mb-6">Quick Links</h4>
//               <ul className="space-y-4">
//                 <li><button onClick={() => navigate('/')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Home</button></li>
//                 <li><button onClick={() => navigate('/#about')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">About Us</button></li>
//                 <li><button onClick={() => navigate('/#doctors')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Our Doctors</button></li>
//                 <li><button onClick={() => navigate('/#services')} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Services</button></li>
//                 <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Patient Portal</button></li>
//               </ul>
//             </div>


//             {/* Contact */}
//             <div>
//               <h4 className="text-white font-bold mb-6">Contact Us</h4>
//               <ul className="space-y-4">
//                 <li className="flex items-start gap-3 text-gray-400 text-sm">
//                   <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
//                   <span>KM4 Area, Wadada Maka Al Mukarama,<br />Mogadishu, Somalia</span>
//                 </li>
//                 <li className="flex items-center gap-3 text-gray-400 text-sm">
//                   <Phone size={18} className="text-emerald-500 flex-shrink-0" />
//                   <span>+252 61 9157381</span>
//                 </li>
//                 <li className="flex items-center gap-3 text-gray-400 text-sm">
//                   <Mail size={18} className="text-emerald-500 flex-shrink-0" />
//                   <span>contact@smartclinic.com</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Open Hours */}
//             <div>
//               <h4 className="text-white font-bold mb-6">Opening Hours</h4>
//               <ul className="space-y-3">
//                 <li className="flex justify-between text-sm">
//                   <span className="text-gray-400">Monday - Sunday</span>
//                   <span className="text-emerald-400 font-medium">Open 24 Hours</span>
//                 </li>
//                 <li className="flex justify-between text-sm">
//                   <span className="text-gray-400">Emergency Services</span>
//                   <span className="text-emerald-400 font-medium">Available 24/7</span>
//                 </li>
//               </ul>
//             </div>

//           </div>

//           <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-gray-500 text-sm">© 2026 SmartClinic Hospital Management System. All rights reserved.</p>
//             <div className="flex gap-6 text-sm text-gray-500">
//               <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
//               <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PatientPortal;



import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, FileText, Receipt, User, Clock, ChevronRight, Activity,
  LogOut, Phone, ShieldCheck, Bell, Plus, ArrowUpRight, ArrowLeft,
  MapPin, Mail, LayoutDashboard
} from 'lucide-react';
import api from '../utils/api';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatter';
import { logout } from '../redux/slices/authSlice';

const PatientPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({ department: '', date: '', time: '09:00', reason: '' });
  const [requestStatus, setRequestStatus] = useState('idle');

  useEffect(() => {
    api.get('/dashboard/patient')
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        department: requestForm.department,
        date: requestForm.date,
        time: requestForm.time,
        message: requestForm.reason
      });
      setRequestStatus('success');
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

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased">

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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm transition-all text-left">
              <LayoutDashboard size={18} />
              My Portal
            </button>
            <button onClick={() => navigate('/appointments')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all text-left">
              <Calendar size={18} />
              My Appointments
            </button>
            <button onClick={() => navigate('/invoices')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all text-left">
              <Receipt size={18} />
              My Bills
            </button>
            <button onClick={() => navigate('/records')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-all text-left">
              <FileText size={18} />
              My Medical Records
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
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 relative transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">

          {/* Welcome Banner - Emerald Green Style */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-white/10 pointer-events-none">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <p className="text-md text-emerald-50 mt-2 max-w-xl font-medium">
                Halkan si toos ah uga maamulo ballamaha dhakhtarka, taariikhdaada caafimaad, iyo xisaabaadkaaga clinigga.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Left/Main Column: Stats Grid + Appointment Form */}
            <div className="lg:col-span-2 space-y-8">

              {/* Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Upcoming', value: appointments.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'History', value: data?.recordsCount || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Billing', value: data?.invoicesCount || 0, icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all">
                    <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={18} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
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
                          <input required type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" value={requestForm.date} onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })} />
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
                <button onClick={() => navigate('/appointments')} className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors">See All</button>
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
        </main>

      </div>
    </div>
  );
};

export default PatientPortal;