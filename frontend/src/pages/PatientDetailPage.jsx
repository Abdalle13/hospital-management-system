import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MapPin, Heart, User, Calendar, FileText, Receipt } from 'lucide-react';
import { fetchPatient } from '../redux/slices/patientSlice';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import { fetchInvoices } from '../redux/slices/invoiceSlice';
import Badge from '../components/ui/Badge';
import { formatDate, formatCurrency } from '../utils/formatter';
import api from '../utils/api';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
    </div>
  </div>
);

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: patient, loading } = useSelector((s) => s.patients);
  const { list: appointments } = useSelector((s) => s.appointments);
  const { list: invoices } = useSelector((s) => s.invoices);
  const [records, setRecords] = React.useState([]);

  useEffect(() => {
    dispatch(fetchPatient(id));
    dispatch(fetchAppointments({ patientId: id }));
    dispatch(fetchInvoices({ patientId: id }));
    api.get(`/records/${id}`).then((r) => setRecords(r.data)).catch(() => {});
  }, [dispatch, id]);

  if (loading || !patient) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400 text-sm">Loading patient...</div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Patients
      </button>

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl flex-shrink-0">
            {patient.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <span className="badge-scheduled">{patient.bloodType}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><User size={13}/>{patient.age} yrs · {patient.gender}</span>
              <span className="flex items-center gap-1"><Phone size={13}/>{patient.phone}</span>
              {patient.email && <span className="flex items-center gap-1"><Mail size={13}/>{patient.email}</span>}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Personal Information</h3>
          <InfoItem icon={MapPin} label="Address" value={patient.address} />
          <InfoItem icon={Heart} label="Allergies" value={patient.allergies?.join(', ') || 'None'} />
          {patient.emergencyContact?.name && (
            <div className="pt-2 border-t border-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Emergency Contact</p>
              <InfoItem icon={User} label={patient.emergencyContact.relationship} value={`${patient.emergencyContact.name} · ${patient.emergencyContact.phone}`} />
            </div>
          )}
        </motion.div>

        {/* Appointments */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Calendar size={16} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-900">Appointment History</h3>
            <span className="ml-auto text-xs text-gray-400">{appointments.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50/60"><th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Doctor</th><th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Date</th><th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Status</th></tr></thead>
              <tbody>
                {appointments.length === 0 ? <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-gray-400">No appointments</td></tr>
                : appointments.map((a, i) => (
                  <tr key={a._id} className={i % 2 === 0 ? '' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3 text-sm text-gray-700">{a.doctor?.name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(a.date)} {a.time}</td>
                    <td className="px-5 py-3"><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Medical Records */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <FileText size={16} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Medical Records</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {records.length === 0 ? <p className="px-5 py-6 text-sm text-gray-400 text-center">No medical records yet</p>
            : records.map((r) => (
              <div key={r._id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{r.diagnosis}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Dr. {r.doctor?.name}</p>
                {r.prescription?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.prescription.map((rx, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{rx.medication} {rx.dosage}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Invoices */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Receipt size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Invoices</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {invoices.length === 0 ? <p className="px-5 py-6 text-sm text-gray-400 text-center">No invoices</p>
            : invoices.map((inv) => (
              <div key={inv._id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</p>
                  <p className="text-xs text-gray-400">{formatDate(inv.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(inv.totalAmount)}</p>
                  <Badge status={inv.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
