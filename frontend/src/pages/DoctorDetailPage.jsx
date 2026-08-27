import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Clock, Star, Calendar, Edit, Trash2 } from 'lucide-react';
import { fetchDoctor, updateDoctor, deleteDoctor } from '../redux/slices/doctorSlice';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';
import ImageUpload from '../components/ui/ImageUpload';
import { formatDate } from '../utils/formatter';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPECIALIZATIONS = ['Cardiology', 'Dermatology', 'General Medicine', 'Gynecology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology'];

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { current: doctor, loading } = useSelector((s) => s.doctors);
  const { list: appointments } = useSelector((s) => s.appointments);
  const isAdmin = user?.role === 'admin';
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctor(id));
    dispatch(fetchAppointments({ doctorId: id }));
  }, [dispatch, id]);

  const openEdit = () => { setForm({ ...doctor }); setShowEdit(true); };

  const toggleDay = (day) => {
    const days = form.schedule.days.includes(day)
      ? form.schedule.days.filter((d) => d !== day)
      : [...form.schedule.days, day];
    setForm({ ...form, schedule: { ...form.schedule, days } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(updateDoctor({ id: doctor._id, ...form }));
    setSaving(false);
    setShowEdit(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove Dr. ${doctor.name}? This cannot be undone.`)) {
      await dispatch(deleteDoctor(doctor._id));
      navigate('/doctors');
    }
  };

  if (loading || !doctor) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/doctors')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Back to Doctors
        </button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={openEdit}><Edit size={14} /> Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover object-top flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl flex-shrink-0">
              {doctor.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
            <p className="text-sm text-emerald-600 font-medium mb-2">{doctor.specialization}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Phone size={13}/>{doctor.phone}</span>
              {doctor.email && <span className="flex items-center gap-1"><Mail size={13}/>{doctor.email}</span>}
              {doctor.consultationFee > 0 && <span className="flex items-center gap-1"><Star size={13}/>Consultation: ${doctor.consultationFee}</span>}
            </div>
          </div>
        </div>
        {doctor.bio && <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{doctor.bio}</p>}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-emerald-500" /><h3 className="text-sm font-semibold text-gray-900">Schedule</h3></div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {doctor.schedule?.days?.map((d) => (
              <span key={d} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">{d}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{doctor.schedule?.startTime} – {doctor.schedule?.endTime}</p>
        </motion.div>

        {/* Appointments */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Calendar size={16} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Patient Appointments</h3>
            <span className="ml-auto text-xs text-gray-400">{appointments.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50/60">
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Patient</th>
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Date & Time</th>
                <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Reason</th>
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {appointments.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">No appointments assigned</td></tr>
                : appointments.map((a, i) => (
                  <tr key={a._id} className={i % 2 === 0 ? '' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{a.patient?.name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(a.date)} {a.time}</td>
                    <td className="hidden sm:table-cell px-5 py-3 text-sm text-gray-500 max-w-[150px] truncate">{a.reason || '—'}</td>
                    <td className="px-5 py-3"><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Doctor" size="lg">
        {form && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload label="Doctor Photo" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <div className="grid grid-cols-2 gap-4">
              <Input id="dd-name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2" />
              <Select id="dd-spec" label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}>
                {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
              </Select>
              <Input id="dd-fee" label="Consultation Fee ($)" type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
              <Input id="dd-phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input id="dd-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Textarea id="dd-bio" label="Bio / Notes" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Working Days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button type="button" key={day} onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.schedule?.days?.includes(day) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="dd-start" label="Start Time" type="time" value={form.schedule?.startTime || '09:00'} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, startTime: e.target.value } })} />
              <Input id="dd-end" label="End Time" type="time" value={form.schedule?.endTime || '17:00'} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, endTime: e.target.value } })} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowEdit(false)}>Cancel</Button>
              <Button type="submit" loading={saving}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDetailPage;
