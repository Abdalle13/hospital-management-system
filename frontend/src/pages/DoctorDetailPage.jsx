import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Clock, Star, Calendar } from 'lucide-react';
import { fetchDoctor } from '../redux/slices/doctorSlice';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatter';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: doctor, loading } = useSelector((s) => s.doctors);
  const { list: appointments } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchDoctor(id));
    dispatch(fetchAppointments({ doctorId: id }));
  }, [dispatch, id]);

  if (loading || !doctor) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/doctors')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Doctors
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl flex-shrink-0">
            {doctor.name?.[0]?.toUpperCase()}
          </div>
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
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Reason</th>
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {appointments.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">No appointments assigned</td></tr>
                : appointments.map((a, i) => (
                  <tr key={a._id} className={i % 2 === 0 ? '' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{a.patient?.name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(a.date)} {a.time}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 max-w-[150px] truncate">{a.reason || '—'}</td>
                    <td className="px-5 py-3"><Badge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
