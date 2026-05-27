import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';


import {
  Activity, ArrowRight, ShieldCheck, HeartPulse,
  Users, Stethoscope, Microscope, TestTube,
  MapPin, Phone, Mail, Clock, Star, Quote, Calendar, User, ChevronRight, LogOut

} from 'lucide-react';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import api from '../utils/api';

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

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', department: '', date: '', time: '09:00' });
  const [bookingStatus, setBookingStatus] = useState(null);

  // Fetch doctors for showcase
  const navLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Doctors', href: '#doctors' },
    { name: 'Services', href: '#services' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const handlePatientPortal = () => {
    if (user && user.role === 'patient') {
      navigate('/portal');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  useEffect(() => {
    api.get('/doctors')
      .then(res => setFeaturedDoctors(res.data.slice(0, 3)))
      .catch(() => { });
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments/public-request', {
        name: bookingForm.name,
        phone: bookingForm.phone,
        department: bookingForm.department,
        date: bookingForm.date,
        time: bookingForm.time,
        message: 'Request from Landing Page'
      });
      setBookingStatus('success');
      setBookingForm({ name: '', phone: '', department: '', date: '', time: '09:00' });
      setTimeout(() => setBookingStatus(null), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const services = [
    { icon: Stethoscope, title: 'General Medicine', desc: 'Comprehensive care for common illnesses and preventive health.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Users, title: 'Pediatrics', desc: 'Specialized healthcare and immunizations for infants and children.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: HeartPulse, title: 'Cardiology', desc: 'Expert heart care, ECGs, and cardiovascular disease management.', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Microscope, title: 'Laboratory', desc: 'Advanced diagnostic testing with quick and accurate results.', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: TestTube, title: 'Pharmacy', desc: 'In-house pharmacy stocked with genuine and certified medicines.', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Activity, title: 'Emergency', desc: '24/7 urgent care and trauma management by expert teams.', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const testimonials = [
    { name: 'Sarah Ali', role: 'Patient', text: 'SmartClinic provides the best healthcare experience I have ever had. The doctors are highly professional and the facility is incredibly clean and modern.', rating: 5 },
    { name: 'Axmed Xasan', role: 'Bukaanka', text: 'Habka ballansashada online-ka ah waa mid aad u fudud oo nolosha sahlaya. Ma aanan sugin saf dheer. Dhaqtarka carruurta si wanaagsan ayuu u daryeelay gabadhayda. Aad ayaan ugu talinayaa!', rating: 5 },
    { name: 'Faadumo Nuur', role: 'Bukaanka', text: 'Natiijada baaritaankayga shaybaarka waxaan si toos ah uga helay portal-ka bukaanka. Degdegga iyo hufnaanta SmartClinic waa mid aan magaalada looga helin meel kale.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Activity size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartClinic</span>
          </Link>



          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">About Us</a>
            <a href="#doctors" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Our Doctors</a>
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Services</a>
            <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button onClick={handlePatientPortal} className="shadow-lg shadow-emerald-500/20">Go to Portal</Button>
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left z-10"
          >

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Modern healthcare, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                designed for you.
              </span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              SmartClinic provides world-class medical services with state-of-the-art facilities.
              Book appointments, access your records, and connect with top doctors instantly through our digital portal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base shadow-xl shadow-emerald-500/20" onClick={() => document.getElementById('appointment-widget').scrollIntoView({ behavior: 'smooth' })}>
                Book Appointment <ArrowRight size={18} className="ml-2" />
              </Button>
              {user ? (
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-base bg-white border-2 hover:bg-gray-50 text-emerald-600 border-emerald-100" onClick={() => navigate(user.role === 'patient' ? '/portal' : '/dashboard')}>
                  Go to Portal
                </Button>

              ) : (
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-base bg-white border-2 hover:bg-gray-50" onClick={() => navigate('/register')}>
                  Create Account
                </Button>
              )}
            </div>


            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-gray-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-4 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Patient" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm font-medium text-gray-900">Trusted by 10,000+ patients</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-[3rem] transform rotate-3 scale-105 opacity-10"></div>
            <img
              src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Medical Professionals"
              className="w-full rounded-[3rem] shadow-2xl object-cover aspect-[4/3] lg:aspect-square"
            />
            {/* Floating badge 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-8 sm:-left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-50"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Fully Certified</p>
                <p className="text-xs text-gray-500">ISO 9001:2015</p>
              </div>
            </motion.div>
            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -right-4 sm:-right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-50"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">24/7 Support</p>
                <p className="text-xs text-gray-500">Always here for you</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-3xl transform -translate-x-4 translate-y-4 -z-10 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Hospital Building"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                <div className="text-4xl font-extrabold text-emerald-600">15+</div>
                <div className="text-sm font-semibold text-gray-700 leading-tight">Years of<br />Excellence</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">About SmartClinic</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Dedicated to providing the best healthcare</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Founded in 2011, SmartClinic has grown into a leading healthcare institution recognized for excellence in patient care, cutting-edge technology, and a compassionate approach.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Our state-of-the-art facility brings together world-class specialists and advanced medical equipment under one roof, ensuring that every patient receives accurate diagnostics and effective treatments.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <p className="font-semibold text-gray-900">Certified Experts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Activity size={24} />
                </div>
                <p className="font-semibold text-gray-900">Modern Technology</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <HeartPulse size={24} />
                </div>
                <p className="font-semibold text-gray-900">Compassionate Care</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <p className="font-semibold text-gray-900">24/7 Availability</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Doctor Showcase */}
      <section id="doctors" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Medical Experts</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Meet Our Top Doctors</h3>
              <p className="text-gray-500 text-lg">Our team of experienced specialists is dedicated to providing you with the highest standard of care.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/doctors-list')}
            >
              View All Doctors
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredDoctors.length > 0 ? featuredDoctors.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  {/* Since we don't have doctor images in DB yet, use a placeholder */}
                  <img src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600">
                    Featured
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Dr. {doc.name}</h4>
                  <p className="text-emerald-600 font-medium text-sm mb-4">{doc.specialization}</p>
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase">Experience</p>
                      <p className="font-semibold text-gray-900">{doc.experience || '10+'} Yrs</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase">Patients</p>
                      <p className="font-semibold text-gray-900">1K+</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => document.getElementById('appointment-widget').scrollIntoView({ behavior: 'smooth' })}>Book Visit</Button>
                </div>
              </motion.div>
            )) : (
              // Fallback if DB doesn't return doctors yet
              [1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-50 rounded-3xl border border-gray-100 animate-pulse flex items-center justify-center">
                  <p className="text-gray-400">Loading Doctor Profile...</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50 relative border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Our Specialties</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Comprehensive Care Center</h3>
            <p className="text-gray-500 text-lg">We offer a wide range of specialized medical services utilizing the latest technology and treatment protocols.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, i) => (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
              >
                <div className={`w-16 h-16 ${srv.bg} ${srv.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <srv.icon size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{srv.title}</h4>
                <p className="text-gray-500 leading-relaxed mb-6">{srv.desc}</p>
                <a href="#" className={`inline-flex items-center text-sm font-semibold ${srv.color} hover:underline`}>
                  Learn more <ChevronRight size={16} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Widget & Testimonials Grid */}
      <section id="reviews" className="py-24 bg-emerald-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">

          {/* Testimonials */}
          <div>
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Patient Stories</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-10 leading-tight">Don't just take our word for it.</h3>

            <div className="space-y-6">
              {testimonials.map((test, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative"
                >
                  <Quote size={40} className="absolute top-4 right-4 text-emerald-500/20" />
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(test.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-emerald-50 text-lg leading-relaxed mb-6">"{test.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{test.name}</p>
                      <p className="text-emerald-300 text-xs">{test.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Appointment Widget */}
          <div id="appointment-widget" className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request an Appointment</h3>
            <p className="text-gray-500 mb-8">Fill out the form below and our reception team will call you to confirm your slot.</p>

            {bookingStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h4>
                <p className="text-gray-600">Thank you. Our receptionist will contact you shortly to confirm your exact appointment time.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input required type="text" className="input-field pl-10 bg-gray-50" placeholder="John Doe" value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input required type="tel" className="input-field pl-10 bg-gray-50" placeholder="061XXXXXXX" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Department</label>
                    <Select value={bookingForm.department} onChange={e => setBookingForm({ ...bookingForm, department: e.target.value })} required className="bg-gray-50">
                      <option value="">Select a specialty...</option>
                      {services.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Preferred Date</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="date" className="input-field pl-10 bg-gray-50" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Preferred Time</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="time" className="input-field pl-10 bg-gray-50" value={bookingForm.time} onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })} />
                      </div>
                    </div>
                  </div>

                </div>
                <Button type="submit" className="w-full py-4 text-base shadow-lg shadow-emerald-500/20 mt-4">Submit Request</Button>
                <p className="text-xs text-center text-gray-400 mt-4">By submitting, you agree to our Terms of Service & Privacy Policy.</p>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
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
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Home</button></li>
                <li><a href="#about" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">About Us</a></li>
                <li><a href="#doctors" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Our Doctors</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Services</a></li>
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
            <p className="text-gray-500 text-sm">© 2026 SmartClinic Hospital Management System. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
