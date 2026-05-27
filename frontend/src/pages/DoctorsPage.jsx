import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Search, Trash2, Eye, Edit, Clock } from 'lucide-react';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from '../redux/slices/doctorSlice';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SPECIALIZATIONS = ['Cardiology','Dermatology','General Medicine','Gynecology','Neurology','Oncology','Orthopedics','Pediatrics','Psychiatry','Radiology','Surgery','Urology'];

const INITIAL_FORM = {
  name: '', specialization: 'General Medicine', phone: '', email: '',
  bio: '', consultationFee: '', schedule: { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], startTime: '09:00', endTime: '17:00' },
};

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: doctors, loading } = useSelector((s) => s.doctors);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctors({ search, specialization: filterSpec }));
  }, [dispatch, search, filterSpec]);

  const openAdd = () => { setEditDoctor(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (d) => { setEditDoctor(d); setForm({ ...d }); setShowModal(true); };

  const toggleDay = (day) => {
    const days = form.schedule.days.includes(day)
      ? form.schedule.days.filter((d) => d !== day)
      : [...form.schedule.days, day];
    setForm({ ...form, schedule: { ...form.schedule, days } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editDoctor) await dispatch(updateDoctor({ id: editDoctor._id, ...form }));
    else await dispatch(createDoctor(form));
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this doctor?')) dispatch(deleteDoctor(id));
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="page-title">Doctors</h2><p className="page-subtitle">{doctors.length} registered doctors</p></div>
        <Button onClick={openAdd}><UserPlus size={16} /> Add Doctor</Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-48" value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}>
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-gray-400 text-sm">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-gray-400 text-sm">No doctors found.</div>
        ) : doctors.map((doc, i) => (
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="card card-hover p-5"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                {doc.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                <p className="text-xs text-emerald-600 font-medium">{doc.specialization}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-4 flex-wrap">
              {doc.schedule?.days?.slice(0, 5).map((d) => (
                <span key={d} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{d.slice(0, 3)}</span>
              ))}
              {doc.schedule?.startTime && (
                <span className="text-xs text-gray-400 flex items-center gap-1 ml-1">
                  <Clock size={11} />{doc.schedule.startTime}–{doc.schedule.endTime}
                </span>
              )}
            </div>
            {doc.consultationFee > 0 && (
              <p className="text-xs text-gray-500 mb-3">Consultation: <span className="font-semibold text-gray-800">${doc.consultationFee}</span></p>
            )}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/doctors/${doc._id}`)} className="flex-1 justify-center"><Eye size={14} /> View</Button>
              <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Edit size={15} /></button>
              <button onClick={() => handleDelete(doc._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editDoctor ? 'Edit Doctor' : 'Add New Doctor'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="d-name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2" />
            <Select id="d-spec" label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}>
              {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Input id="d-fee" label="Consultation Fee ($)" type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
            <Input id="d-phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input id="d-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Textarea id="d-bio" label="Bio / Notes" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
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
            <Input id="d-start" label="Start Time" type="time" value={form.schedule?.startTime || '09:00'} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, startTime: e.target.value } })} />
            <Input id="d-end" label="End Time" type="time" value={form.schedule?.endTime || '17:00'} onChange={(e) => setForm({ ...form, schedule: { ...form.schedule, endTime: e.target.value } })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editDoctor ? 'Update Doctor' : 'Add Doctor'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;
