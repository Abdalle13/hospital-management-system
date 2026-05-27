import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, Search, ChevronDown, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchAppointments, createAppointment, updateAppointmentStatus } from '../redux/slices/appointmentSlice';
import { fetchPatients } from '../redux/slices/patientSlice';
import { fetchDoctors } from '../redux/slices/doctorSlice';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatter';
import api from '../utils/api';

const INITIAL_FORM = { patient: '', doctor: '', date: '', time: '09:00', reason: '' };

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const { list: appointments, loading } = useSelector((s) => s.appointments);
  const { list: patients } = useSelector((s) => s.patients);
  const { list: doctors } = useSelector((s) => s.doctors);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [viewMode, setViewMode] = useState('appointments'); // 'appointments' or 'requests'

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await api.get('/appointments/requests');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'appointments') {
      dispatch(fetchAppointments({ filter: filter === 'all' ? '' : filter, status: statusFilter }));
    } else {
      fetchRequests();
    }
  }, [dispatch, filter, statusFilter, viewMode]);

  useEffect(() => {
    dispatch(fetchPatients({}));
    dispatch(fetchDoctors({}));
  }, [dispatch]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(createAppointment(form));
    setSaving(false);
    setShowModal(false);
    setForm(INITIAL_FORM);
  };

  const handleStatus = async (id, status) => {
    await dispatch(updateAppointmentStatus({ id, status }));
  };

  const openDetail = (apt) => { setSelectedApt(apt); setShowDetailModal(true); };

  const filterBtns = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
  ];

  const handleRequestStatus = async (id, status) => {
    try {
      await api.put(`/appointments/requests/${id}/status`, { status });
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="page-title">{viewMode === 'appointments' ? 'Appointments' : 'Visit Requests'}</h2>
          <p className="page-subtitle">{viewMode === 'appointments' ? `${appointments.length} appointments` : `${requests.length} pending requests`}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'requests' ? 'primary' : 'secondary'} onClick={() => setViewMode(viewMode === 'appointments' ? 'requests' : 'appointments')}>
            {viewMode === 'appointments' ? 'View Requests' : 'View Appointments'}
          </Button>
          <Button onClick={() => setShowModal(true)}><CalendarPlus size={16} /> Book Appointment</Button>
        </div>
      </div>

      {/* Filters (Only for Appointments) */}
      {viewMode === 'appointments' && (
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {filterBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <select className="input-field sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Scheduled</option><option>Completed</option><option>Cancelled</option>
          </select>
        </div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        {loading || loadingRequests ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            {viewMode === 'appointments' ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    {['Patient','Doctor','Date','Time','Reason','Status','Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No appointments found</td></tr>
                  ) : appointments.map((apt, i) => (
                    <tr key={apt._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{apt.patient?.name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm text-gray-800">{apt.doctor?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{apt.doctor?.specialization}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{formatDate(apt.date)}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{apt.time}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[120px] truncate">{apt.reason || '—'}</td>
                      <td className="px-5 py-3.5"><Badge status={apt.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetail(apt)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye size={15} /></button>
                          {apt.status === 'Scheduled' && (
                            <>
                              <button onClick={() => handleStatus(apt._id, 'Completed')} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Mark Completed"><CheckCircle size={15} /></button>
                              <button onClick={() => handleStatus(apt._id, 'Cancelled')} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Cancel"><XCircle size={15} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    {['Name','Phone','Department','Date','Time','Message','Status','Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No requests found</td></tr>
                  ) : requests.map((req, i) => (
                    <tr key={req._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{req.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{req.phone}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{req.department}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{formatDate(req.date)}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{req.time}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[200px] truncate">{req.message || '—'}</td>
                      <td className="px-5 py-3.5"><Badge status={req.status} /></td>

                      <td className="px-5 py-3.5">
                        {req.status === 'Pending' && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleRequestStatus(req._id, 'Confirmed')} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Confirm"><CheckCircle size={15} /></button>
                            <button onClick={() => handleRequestStatus(req._id, 'Cancelled')} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Reject"><XCircle size={15} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>


      {/* Book Appointment Modal (Existing) */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Book New Appointment" size="md">
        <form onSubmit={handleBook} className="space-y-4">
          <Select id="apt-patient" label="Patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
            <option value="">Select patient...</option>
            {patients.map((p) => <option key={p._id} value={p._id}>{p.name} — {p.phone}</option>)}
          </Select>
          <Select id="apt-doctor" label="Doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
            <option value="">Select doctor...</option>
            {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input id="apt-date" label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input id="apt-time" label="Time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          </div>
          <Textarea id="apt-reason" label="Reason for Visit" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Chief complaint or reason..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Book Appointment</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal (Existing) */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Appointment Details" size="sm">
        {selectedApt && (
          <div className="space-y-4">
            {[
              ['Patient', selectedApt.patient?.name],
              ['Doctor', `${selectedApt.doctor?.name} (${selectedApt.doctor?.specialization})`],
              ['Date', formatDate(selectedApt.date)],
              ['Time', selectedApt.time],
              ['Reason', selectedApt.reason || '—'],
              ['Status', null],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs font-medium text-gray-400 uppercase">{label}</span>
                {label === 'Status' ? <Badge status={selectedApt.status} /> : <span className="text-sm font-medium text-gray-900">{value}</span>}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
