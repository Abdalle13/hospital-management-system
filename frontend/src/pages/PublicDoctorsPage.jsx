import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Stethoscope, Clock, ShieldCheck, User, Phone, Mail, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const generateTimeSlots = (start, end, stepMinutes = 30) => {
  if (!start || !end) return [];
  const slots = [];
  let [h, m] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += stepMinutes;
    if (m >= 60) { m -= 60; h += 1; }
  }
  return slots;
};

const weekdayOf = (dateStr) => {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
};

const PublicDoctorsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', email: '', date: '', time: '' });
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const timeSlots = bookingDoctor ? generateTimeSlots(bookingDoctor.schedule?.startTime, bookingDoctor.schedule?.endTime) : [];
  const workingDays = bookingDoctor?.schedule?.days || [];
  const selectedWeekday = weekdayOf(bookingForm.date);
  const dateOnWrongDay = bookingForm.date && workingDays.length > 0 && !workingDays.includes(selectedWeekday);

  const openBooking = (doc) => {
    setBookingDoctor(doc);
    setBookingForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', date: '', time: doc.schedule?.startTime || '' });
    setBookingStatus('idle');
    setBookingError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (dateOnWrongDay) return;
    setBookingStatus('loading');
    setBookingError('');
    try {
      await api.post('/appointments/public-request', {
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        department: bookingDoctor.specialization,
        date: bookingForm.date,
        time: bookingForm.time,
        doctorId: bookingDoctor._id,
        message: `Requested doctor: Dr. ${bookingDoctor.name}`,
      });
      setBookingStatus('success');
    } catch (error) {
      setBookingStatus('error');
      setBookingError(error.response?.data?.message || 'Failed to send request. Please try again.');
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero / Search */}
      <section className="bg-emerald-600 pt-36 pb-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Our Medical Specialists</h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Find the right expert for your healthcare needs. We have a team of certified professionals across all specialties.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or specialty (e.g. Cardiology)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl text-gray-900 focus:ring-4 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-20">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredDoctors.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-4xl">
                      {doc.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 uppercase">
                    {doc.specialization}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Dr. {doc.name}</h4>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                    <Stethoscope size={14} className="text-emerald-500" />
                    {doc.specialization}
                  </p>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-50 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Clock size={14} />
                      {doc.experience || '10+'} Yrs Exp
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <ShieldCheck size={14} />
                      Verified
                    </div>
                  </div>

                  <Button
                    className="w-full py-2.5 rounded-xl text-sm"
                    onClick={() => openBooking(doc)}
                  >
                    Book Appointment
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">We couldn't find any medical specialist matching your search.</p>
            <Button variant="secondary" className="mt-6" onClick={() => setSearch('')}>Clear Search</Button>
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      <Modal isOpen={!!bookingDoctor} onClose={() => setBookingDoctor(null)} title={bookingDoctor ? `Book with Dr. ${bookingDoctor.name}` : ''} size="sm">
        {bookingStatus === 'success' ? (
          <div className="py-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Request Sent!</h4>
            <p className="text-gray-600 text-sm">Our reception team will contact you shortly to confirm your exact appointment time.</p>
            <Button className="mt-6 w-full" onClick={() => setBookingDoctor(null)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <p className="text-sm text-gray-500 -mt-1">{bookingDoctor?.specialization} · No account needed, our team will call to confirm.</p>
            {workingDays.length > 0 && (
              <p className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2">
                Available {workingDays.join(', ')} · {bookingDoctor.schedule.startTime}–{bookingDoctor.schedule.endTime}
              </p>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" className="input-field pl-10" placeholder="John Doe" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="tel" className="input-field pl-10" placeholder="061XXXXXXX" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email <span className="text-gray-400 font-normal">(optional, for confirmation)</span></label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Preferred Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="date" min={new Date().toISOString().split('T')[0]} className="input-field pl-10" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Preferred Time</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select required className="input-field pl-10" value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}>
                    {timeSlots.length === 0 && <option value="">No hours set</option>}
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {dateOnWrongDay && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                Dr. {bookingDoctor.name} doesn't work on {selectedWeekday}s. Pick one of: {workingDays.join(', ')}.
              </p>
            )}
            {bookingStatus === 'error' && <p className="text-xs text-red-500">{bookingError}</p>}
            <Button type="submit" loading={bookingStatus === 'loading'} disabled={dateOnWrongDay} className="w-full py-3 mt-2">Submit Request</Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PublicDoctorsPage;
