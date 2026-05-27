import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Search, Trash2, Eye, Edit, Filter } from 'lucide-react';
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../redux/slices/patientSlice';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatter';

const INITIAL_FORM = {
  name: '', age: '', gender: 'Male', bloodType: 'O+', phone: '', email: '',
  address: '', emergencyContact: { name: '', phone: '', relationship: '' }, allergies: '', notes: '',
};

const PatientsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: patients, loading } = useSelector((s) => s.patients);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterBlood, setFilterBlood] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients({ search, gender: filterGender, bloodType: filterBlood }));
  }, [dispatch, search, filterGender, filterBlood]);

  const openAdd = () => { setEditPatient(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditPatient(p);
    setForm({ ...p, allergies: p.allergies?.join(', ') || '', emergencyContact: p.emergencyContact || {} });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, allergies: form.allergies ? form.allergies.split(',').map((a) => a.trim()) : [] };
    if (editPatient) await dispatch(updatePatient({ id: editPatient._id, ...payload }));
    else await dispatch(createPatient(payload));
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient? This action cannot be undone.')) {
      dispatch(deletePatient(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="page-title">Patients</h2><p className="page-subtitle">{patients.length} registered patients</p></div>
        <Button onClick={openAdd}><UserPlus size={16} /> Add Patient</Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search by name, email or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-36" value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
          <option value="">All Genders</option>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <select className="input-field sm:w-36" value={filterBlood} onChange={(e) => setFilterBlood(e.target.value)}>
          <option value="">All Blood Types</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading patients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  {['Patient','Age','Gender','Blood Type','Phone','Registered','Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No patients found. Add your first patient.</td></tr>
                ) : patients.map((p, i) => (
                  <tr key={p._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                          {p.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.age}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.gender}</td>
                    <td className="px-5 py-3.5"><span className="badge-scheduled">{p.bloodType}</span></td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.phone}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/patients/${p._id}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={15} /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPatient ? 'Edit Patient' : 'Register New Patient'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="p-name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2" />
            <Input id="p-age" label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
            <Select id="p-gender" label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </Select>
            <Select id="p-blood" label="Blood Type" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })}>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b}>{b}</option>)}
            </Select>
            <Input id="p-phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input id="p-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="col-span-2" />
            <Input id="p-address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="col-span-2" />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-3">
              <Input id="ec-name" label="Name" value={form.emergencyContact?.name || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} />
              <Input id="ec-phone" label="Phone" value={form.emergencyContact?.phone || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} />
              <Input id="ec-rel" label="Relationship" value={form.emergencyContact?.relationship || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relationship: e.target.value } })} />
            </div>
          </div>
          <Input id="p-allergies" label="Allergies (comma separated)" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Penicillin, Sulfa..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editPatient ? 'Update Patient' : 'Register Patient'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsPage;
