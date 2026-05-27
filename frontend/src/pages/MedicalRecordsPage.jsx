import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePlus, Search, ChevronDown, ChevronUp, Printer, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';
import { formatDate } from '../utils/formatter';
import { IKContext, IKUpload } from 'imagekitio-react';

const IK_PUBLIC_KEY = 'your_imagekit_public_key_here'; // Replace with actual key
const IK_URL_ENDPOINT = 'your_imagekit_url_endpoint_here'; // Replace with actual endpoint
const AUTH_ENDPOINT = 'http://localhost:5000/api/upload/imagekit-auth'; // Adjust based on environment

const authenticator = async () => {
  try {
    const { data } = await api.get('/upload/imagekit-auth');
    return data;
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const INITIAL_FORM = {
  patient: '', doctor: '', appointment: '', diagnosis: '', notes: '', followUpDate: '',
  prescription: [{ medication: '', dosage: '', duration: '' }],
  vitalSigns: { bloodPressure: '', heartRate: '', temperature: '', weight: '' },
  attachments: [],
};

const MedicalRecordsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/patients').then((r) => setPatients(r.data)).catch(() => {});
    api.get('/doctors').then((r) => setDoctors(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPatient) { setRecords([]); return; }
    setLoading(true);
    api.get(`/records/${selectedPatient}`)
      .then((r) => setRecords(r.data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
    api.get('/appointments', { params: { patientId: selectedPatient } })
      .then((r) => setAppointments(r.data))
      .catch(() => {});
  }, [selectedPatient]);

  const addPrescriptionRow = () => setForm({ ...form, prescription: [...form.prescription, { medication: '', dosage: '', duration: '' }] });
  const removePrescriptionRow = (i) => setForm({ ...form, prescription: form.prescription.filter((_, idx) => idx !== i) });
  const updatePrescription = (i, field, val) => {
    const updated = [...form.prescription];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, prescription: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/records', { ...form, patient: form.patient || selectedPatient });
      setRecords([data, ...records]);
      setShowModal(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating record');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (res) => {
    setForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, { url: res.url, name: res.name, fileId: res.fileId }]
    }));
  };

  const canCreate = ['admin', 'doctor'].includes(user?.role);

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="page-title">Medical Records</h2><p className="page-subtitle">Chronological visit records per patient</p></div>
        {canCreate && <Button onClick={() => setShowModal(true)}><FilePlus size={16} /> New Record</Button>}
      </div>

      {/* Patient selector */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <select
          className="input-field flex-1"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">— Select a patient to view records —</option>
          {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>)}
        </select>
      </div>

      {/* Records */}
      {!selectedPatient ? (
        <div className="card py-16 text-center text-gray-400 text-sm">Select a patient above to view their medical history</div>
      ) : loading ? (
        <div className="card py-16 text-center text-gray-400 text-sm">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="card py-16 text-center text-gray-400 text-sm">No medical records found for this patient</div>
      ) : (
        <div className="space-y-3">
          {records.map((record, i) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                className="w-full flex items-start justify-between gap-4 p-5 hover:bg-gray-50/50 transition-colors text-left"
                onClick={() => setExpanded(expanded === record._id ? null : record._id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">Rx</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Dr. {record.doctor?.name} · {formatDate(record.createdAt)}</p>
                    {record.followUpDate && (
                      <p className="text-xs text-blue-600 mt-0.5">Follow-up: {formatDate(record.followUpDate)}</p>
                    )}
                  </div>
                </div>
                {expanded === record._id ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
              </button>

              {expanded === record._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 px-5 py-4 space-y-4 print-section"
                >
                  {/* Vital Signs */}
                  {Object.values(record.vitalSigns || {}).some(Boolean) && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Vital Signs</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[['Blood Pressure', record.vitalSigns?.bloodPressure], ['Heart Rate', record.vitalSigns?.heartRate], ['Temperature', record.vitalSigns?.temperature], ['Weight', record.vitalSigns?.weight]].filter(([,v]) => v).map(([label, value]) => (
                          <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-semibold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescription */}
                  {record.prescription?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Prescriptions</p>
                      <div className="space-y-1.5">
                        {record.prescription.map((rx, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{rx.medication}</span>
                            {rx.dosage && <span className="text-xs text-gray-500">· {rx.dosage}</span>}
                            {rx.duration && <span className="text-xs text-gray-500">· {rx.duration}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors no-print">
                      <Printer size={13} /> Print Record
                    </button>
                  </div>

                  {record.attachments?.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 no-print">
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Attachments</p>
                      <div className="flex gap-3 flex-wrap">
                        {record.attachments.map((att, i) => (
                          <a key={i} href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                            <FilePlus size={14} /> {att.name || 'View File'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* New Record Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Medical Record" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Select id="r-patient" label="Patient" value={form.patient || selectedPatient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient...</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </Select>
            <Select id="r-doctor" label="Doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
              <option value="">Select doctor...</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
            <Input id="r-diagnosis" label="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required className="col-span-2" />
            <Input id="r-followup" label="Follow-up Date" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} className="col-span-2 sm:col-span-1" />
          </div>

          {/* Vital Signs */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Vital Signs</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[['bloodPressure','BP'],['heartRate','Heart Rate'],['temperature','Temp'],['weight','Weight']].map(([key, label]) => (
                <Input key={key} id={`vs-${key}`} label={label} value={form.vitalSigns[key]} onChange={(e) => setForm({ ...form, vitalSigns: { ...form.vitalSigns, [key]: e.target.value } })} placeholder="—" />
              ))}
            </div>
          </div>

          {/* Prescriptions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Prescriptions</p>
              <button type="button" onClick={addPrescriptionRow} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">+ Add Row</button>
            </div>
            <div className="space-y-2">
              {form.prescription.map((rx, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-end">
                  <Input id={`rx-med-${i}`} label={i === 0 ? 'Medication' : ''} value={rx.medication} onChange={(e) => updatePrescription(i, 'medication', e.target.value)} placeholder="Drug name" />
                  <Input id={`rx-dos-${i}`} label={i === 0 ? 'Dosage' : ''} value={rx.dosage} onChange={(e) => updatePrescription(i, 'dosage', e.target.value)} placeholder="500mg 2x daily" />
                  <div className="flex gap-2">
                    <Input id={`rx-dur-${i}`} label={i === 0 ? 'Duration' : ''} value={rx.duration} onChange={(e) => updatePrescription(i, 'duration', e.target.value)} placeholder="7 days" />
                    {form.prescription.length > 1 && (
                      <button type="button" onClick={() => removePrescriptionRow(i)} className={`text-red-400 hover:text-red-600 flex-shrink-0 ${i === 0 ? 'mt-6' : ''}`}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Textarea id="r-notes" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Additional clinical notes..." />

          {/* Attachments Upload */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments (X-ray, Lab Reports)</p>
            <IKContext 
              publicKey={IK_PUBLIC_KEY} 
              urlEndpoint={IK_URL_ENDPOINT} 
              authenticator={authenticator}
            >
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                <IKUpload
                  fileName="record-attachment"
                  onSuccess={handleUploadSuccess}
                  onError={(err) => alert('Upload failed: ' + err.message)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </IKContext>
            {form.attachments.length > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                {form.attachments.map((att, i) => (
                  <span key={i} className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle size={12}/> {att.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicalRecordsPage;
