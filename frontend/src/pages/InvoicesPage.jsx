import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FilePlus, Search, Printer, Receipt, CheckCircle } from 'lucide-react';
import { fetchInvoices, payInvoice, createInvoice } from '../redux/slices/invoiceSlice';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { formatDate, formatCurrency } from '../utils/formatter';
import { exportToExcel, exportInvoicesToPDF } from '../utils/exportUtils';
import api from '../utils/api';

const INITIAL_FORM = {
  patient: '', doctor: '', services: [{ name: '', amount: '' }], totalAmount: 0,
};

const InvoicesPage = () => {
  const dispatch = useDispatch();
  const { list: invoices, loading } = useSelector((s) => s.invoices);
  const [filter, setFilter] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Add form state
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoices({ status: filter }));
  }, [dispatch, filter]);

  useEffect(() => {
    if (showAddModal) {
      api.get('/patients').then((r) => setPatients(r.data)).catch(() => {});
      api.get('/doctors').then((r) => setDoctors(r.data)).catch(() => {});
    }
  }, [showAddModal]);

  const openPay = (inv) => { setSelectedInv(inv); setShowPayModal(true); };

  const handlePay = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(payInvoice({ id: selectedInv._id, paymentMethod, paidAmount: selectedInv.totalAmount }));
    setSaving(false);
    setShowPayModal(false);
  };

  const addServiceRow = () => setForm({ ...form, services: [...form.services, { name: '', amount: '' }] });
  const removeServiceRow = (i) => setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) });
  const updateService = (i, field, val) => {
    const updated = [...form.services];
    updated[i] = { ...updated[i], [field]: val };
    const totalAmount = updated.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    setForm({ ...form, services: updated, totalAmount });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(createInvoice(form));
    setSaving(false);
    setShowAddModal(false);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="page-title">Billing & Invoices</h2><p className="page-subtitle">Manage patient billing and payments</p></div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportInvoicesToPDF(invoices)}>Export PDF</Button>
          <Button variant="secondary" onClick={() => exportToExcel(invoices, 'Invoices')}>Export Excel</Button>
          <Button onClick={() => setShowAddModal(true)}><FilePlus size={16} /> Create</Button>
        </div>
      </div>

      <div className="card p-4 flex gap-3">
        <select className="input-field sm:w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Invoices</option>
          <option>Unpaid</option><option>Paid</option><option>Partial</option>
        </select>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading invoices...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  {['Invoice ID','Patient','Date','Total','Status','Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">No invoices found</td></tr>
                ) : invoices.map((inv, i) => (
                  <tr key={inv._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{inv.patient?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(inv.createdAt)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-5 py-3.5"><Badge status={inv.paymentStatus} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {inv.paymentStatus === 'Unpaid' ? (
                          <Button size="sm" onClick={() => openPay(inv)}>Pay Now</Button>
                        ) : (
                          <button className="text-gray-400 hover:text-gray-600" title="Print"><Printer size={18} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pay Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Process Payment" size="sm">
        {selectedInv && (
          <form onSubmit={handlePay} className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-800 mb-1">Amount Due</p>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(selectedInv.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Details</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1 mb-4 border border-gray-100">
                <p>Patient: {selectedInv.patient?.name}</p>
                <p>Invoice: {selectedInv.invoiceNumber}</p>
              </div>
            </div>
            <Select id="pay-method" label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash</option><option>EVC Plus</option><option>Card</option><option>Insurance</option>
            </Select>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowPayModal(false)}>Cancel</Button>
              <Button type="submit" loading={saving}><CheckCircle size={16} /> Confirm Payment</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Invoice Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Invoice" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="inv-patient" label="Patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient...</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </Select>
            <Select id="inv-doctor" label="Doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
              <option value="">Select doctor...</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Services</p>
              <button type="button" onClick={addServiceRow} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.services.map((s, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input id={`s-name-${i}`} placeholder="Service description" value={s.name} onChange={(e) => updateService(i, 'name', e.target.value)} required />
                  </div>
                  <div className="w-24">
                    <Input id={`s-amt-${i}`} type="number" placeholder="Amount" value={s.amount} onChange={(e) => updateService(i, 'amount', e.target.value)} required />
                  </div>
                  {form.services.length > 1 && (
                    <button type="button" onClick={() => removeServiceRow(i)} className="text-red-400 hover:text-red-600 mt-2.5">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Total Amount</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(form.totalAmount)}</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Generate Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InvoicesPage;
