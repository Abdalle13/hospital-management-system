import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import {
  Activity, ArrowRight, ShieldCheck, HeartPulse,
  Users, Stethoscope, Microscope, TestTube,
  Phone, Mail, Clock, Star, Quote, Calendar, User, ChevronRight, Check,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', email: '', department: '', date: '', time: '09:00' });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [activeService, setActiveService] = useState(null);

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
        email: bookingForm.email,
        department: bookingForm.department,
        date: bookingForm.date,
        time: bookingForm.time,
        message: 'Request from Landing Page'
      });
      setBookingStatus('success');
      setBookingForm({ name: '', phone: '', email: '', department: '', date: '', time: '09:00' });
      setTimeout(() => setBookingStatus(null), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const services = [
    {
      icon: Stethoscope, title: 'General Medicine', desc: 'Comprehensive care for common illnesses and preventive health.', color: 'text-emerald-500', bg: 'bg-emerald-50',
      details: 'Our general medicine team handles everyday health concerns and long-term preventive care — from colds and infections to chronic condition management like diabetes and hypertension.',
      included: ['Routine check-ups & physical exams', 'Chronic disease management', 'Preventive screenings & vaccinations', 'Referrals to specialists when needed'],
    },
    {
      icon: Users, title: 'Pediatrics', desc: 'Specialized healthcare and immunizations for infants and children.', color: 'text-blue-500', bg: 'bg-blue-50',
      details: 'Dedicated pediatric care covering your child\'s growth and development from infancy through adolescence, in a comfortable, child-friendly environment.',
      included: ['Newborn & well-child visits', 'Immunization schedules', 'Growth & development tracking', 'Treatment for common childhood illnesses'],
    },
    {
      icon: HeartPulse, title: 'Cardiology', desc: 'Expert heart care, ECGs, and cardiovascular disease management.', color: 'text-red-500', bg: 'bg-red-50',
      details: 'Our cardiology specialists diagnose and manage heart conditions using modern diagnostic equipment, from routine screening to ongoing care for cardiovascular disease.',
      included: ['ECG & cardiac diagnostics', 'Hypertension & cholesterol management', 'Heart disease risk assessment', 'Ongoing cardiovascular monitoring'],
    },
    {
      icon: Microscope, title: 'Laboratory', desc: 'Advanced diagnostic testing with quick and accurate results.', color: 'text-purple-500', bg: 'bg-purple-50',
      details: 'Our in-house lab delivers accurate diagnostic results quickly, so your doctor can start the right treatment without unnecessary delay.',
      included: ['Blood panels & chemistry tests', 'Urinalysis & microbiology', 'Rapid results shared via your portal', 'Doctor-ordered specialty testing'],
    },
    {
      icon: TestTube, title: 'Pharmacy', desc: 'In-house pharmacy stocked with genuine and certified medicines.', color: 'text-amber-500', bg: 'bg-amber-50',
      details: 'Fill your prescriptions on-site right after your appointment — our pharmacy stocks certified medication and tracks inventory to avoid stockouts.',
      included: ['On-site prescription fulfillment', 'Certified, quality-checked medicines', 'Guidance from licensed pharmacists', 'Stock availability tracking'],
    },
    {
      icon: Activity, title: 'Emergency', desc: '24/7 urgent care and trauma management by expert teams.', color: 'text-rose-500', bg: 'bg-rose-50',
      details: 'Our emergency team is available around the clock for urgent medical needs, staffed and equipped to stabilize and treat time-critical conditions.',
      included: ['24/7 availability, every day of the year', 'Trauma & urgent care management', 'Rapid triage by experienced staff', 'Direct coordination with specialists'],
    },
  ];

  const testimonials = [
    { name: 'Sarah Ali', role: 'Patient', text: 'SmartClinic provides the best healthcare experience I have ever had. The doctors are highly professional and the facility is incredibly clean and modern.', rating: 5 },
    { name: 'Axmed Xasan', role: 'Bukaanka', text: 'Habka ballansashada online-ka ah waa mid aad u fudud oo nolosha sahlaya. Ma aanan sugin saf dheer. Dhaqtarka carruurta si wanaagsan ayuu u daryeelay gabadhayda. Aad ayaan ugu talinayaa!', rating: 5 },
    { name: 'Faadumo Nuur', role: 'Bukaanka', text: 'Natiijada baaritaankayga shaybaarka waxaan si toos ah uga helay portal-ka bukaanka. Degdegga iyo hufnaanta SmartClinic waa mid aan magaalada looga helin meel kale.', rating: 5 },
    { name: 'James Mwangi', role: 'Patient', text: 'From booking to billing, everything just works. I could see my invoice and pay it the same day my doctor marked the visit complete.', rating: 5 },
    { name: 'Hodan Cabdi', role: 'Bukaanka', text: 'Waxaan ka helay ballan degdeg ah markii ay ilmahaygu qandho qabsatay. Kooxda dhakhaatiirta aad bay u naxariista badan yihiin.', rating: 5 },
    { name: 'Michael Osei', role: 'Patient', text: 'The pharmacy on-site saved me a second trip across town. Prescription was ready before I even left the consultation room.', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
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
              className="hidden sm:flex absolute top-10 -left-8 md:-left-12 bg-white p-4 rounded-2xl shadow-xl items-center gap-4 border border-gray-50"
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
              className="hidden sm:flex absolute bottom-10 -right-4 md:-right-8 bg-white p-4 rounded-2xl shadow-xl items-center gap-4 border border-gray-50"
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
                  {doc.image ? (
                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-5xl">
                      {doc.name?.[0]?.toUpperCase()}
                    </div>
                  )}
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
                <button onClick={() => setActiveService(srv)} className={`inline-flex items-center text-sm font-semibold ${srv.color} hover:underline`}>
                  Learn more <ChevronRight size={16} className="ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Stories */}
      <section id="reviews" className="py-24 bg-emerald-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Patient Stories</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Don't just take our word for it.</h3>
          </div>
        </div>

        {/* Infinite marquee — full-bleed, pauses on hover */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-emerald-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-emerald-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-max animate-marquee">
            {[...testimonials, ...testimonials].map((test, i) => (
              <div
                key={i}
                className="w-[340px] sm:w-[380px] flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative flex flex-col"
              >
                <Quote size={40} className="absolute top-4 right-4 text-emerald-500/20" />
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(test.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-emerald-50 leading-relaxed mb-6 flex-1">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{test.name}</p>
                    <p className="text-emerald-300 text-xs">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Widget */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="appointment-widget" className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl border border-gray-100">
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
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email <span className="text-gray-400 font-normal">(optional, for confirmation)</span></label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" className="input-field pl-10 bg-gray-50" placeholder="you@example.com" value={bookingForm.email} onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })} />
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
                        <input required type="date" min={new Date().toISOString().split('T')[0]} className="input-field pl-10 bg-gray-50" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} />
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
                <p className="text-xs text-center text-gray-400 mt-4">
                  By submitting, you agree to our{' '}
                  <Link to="/terms-of-service" className="underline hover:text-gray-600">Terms of Service</Link> &{' '}
                  <Link to="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Service Detail Modal */}
      <Modal isOpen={!!activeService} onClose={() => setActiveService(null)} title={activeService?.title || ''} size="md">
        {activeService && (
          <div className="space-y-5">
            <div className={`w-14 h-14 ${activeService.bg} ${activeService.color} rounded-2xl flex items-center justify-center`}>
              <activeService.icon size={28} />
            </div>
            <p className="text-gray-600 leading-relaxed">{activeService.details}</p>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What's included</p>
              <ul className="space-y-2.5">
                {activeService.included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check size={16} className={`${activeService.color} flex-shrink-0 mt-0.5`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className="w-full mt-2"
              onClick={() => {
                setActiveService(null);
                setBookingForm((f) => ({ ...f, department: activeService.title }));
                document.getElementById('appointment-widget')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book This Service
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LandingPage;
