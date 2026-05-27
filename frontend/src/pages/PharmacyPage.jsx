import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, AlertTriangle, Pill } from 'lucide-react';
import { fetchMedicines, addMedicine, updateMedicine, deleteMedicine } from '../redux/slices/pharmacySlice';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { formatDate, formatCurrency } from '../utils/formatter';

const INITIAL_FORM = {
  name: '', category: 'Tablet', stock: 0, lowStockThreshold: 10, expiryDate: '', price: 0,
};

const PharmacyPage = () => {
  const dispatch = useDispatch();
  const { list: medicines, loading } = useSelector((s) => s.pharmacy);
  const [search, setSearch] = useState('');
  const [filterAlerts, setFilterAlerts] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchMedicines({ search, alert: filterAlerts ? 'true' : '' }));
  }, [dispatch, search, filterAlerts]);

  const openAdd = () => { setEditMed(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (m) => {
    setEditMed(m);
    setForm({ ...m, expiryDate: m.expiryDate ? m.expiryDate.split('T')[0] : '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editMed) await dispatch(updateMedicine({ id: editMed._id, ...form }));
    else await dispatch(addMedicine(form));
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this medicine?')) dispatch(deleteMedicine(id));
  };

  const isLowStock = (m) => m.stock <= m.lowStockThreshold;
  const isExpiringSoon = (m) => {
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);
    return new Date(m.expiryDate) <= thirtyDays;
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="page-title">Pharmacy & Inventory</h2><p className="page-subtitle">Manage clinic medicines and stock</p></div>
        <Button onClick={openAdd}><Plus size={16} /> Add Medicine</Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button
          onClick={() => setFilterAlerts(!filterAlerts)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filterAlerts ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <AlertTriangle size={15} className="inline mr-2 mb-0.5" />
          {filterAlerts ? 'Showing Alerts' : 'Show Alerts'}
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  {['Name','Category','Stock','Price','Expiry Date','Status','Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No medicines found.</td></tr>
                ) : medicines.map((m, i) => (
                  <tr key={m._id} className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <Pill size={14} />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{m.category}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{m.stock}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{formatCurrency(m.price)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{formatDate(m.expiryDate)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        {isLowStock(m) && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded w-max">Low Stock</span>}
                        {isExpiringSoon(m) && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded w-max">Expiring Soon</span>}
                        {!isLowStock(m) && !isExpiringSoon(m) && <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded w-max">Good</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(m._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMed ? 'Edit Medicine' : 'Add Medicine'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="m-name" label="Medicine Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select id="m-cat" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Tablet','Syrup','Injection','Ointment','Drops','Other'].map(c => <option key={c}>{c}</option>)}
            </Select>
            <Input id="m-price" label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="m-stock" label="Stock Quantity" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <Input id="m-low" label="Low Stock Alert" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} required />
          </div>
          <Input id="m-exp" label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editMed ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PharmacyPage;
