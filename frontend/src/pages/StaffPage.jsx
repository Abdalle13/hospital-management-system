import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Trash2, ShieldCheck, Mail, Phone, Power } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'receptionist', password: '' });
  const [saving, setSaving] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      setStaff(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/staff', formData);
      fetchStaff();
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', role: 'receptionist', password: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating staff member');
    }
    setSaving(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/staff/${id}`, { isActive: !currentStatus });
      fetchStaff();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await api.delete(`/staff/${id}`);
        fetchStaff();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting staff member');
      }
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-500 text-sm">Manage Admins and Receptionists accounts</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Add Staff Member
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search staff by name or email..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Staff List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">Loading staff members...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">No staff members found.</div>
        ) : filteredStaff.map((member, i) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${!member.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {member.name[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 truncate max-w-[150px]">{member.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${member.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => toggleStatus(member._id, member.isActive)}
                  className={`p-2 rounded-lg transition-colors ${member.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                  title={member.isActive ? 'Deactivate' : 'Activate'}
                >
                  <Power size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(member._id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={14} className="text-gray-400" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={14} className="text-gray-400" />
                {member.phone}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Staff Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
          <Input 
            label="Phone Number" 
            required 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
          />
          <Select 
            label="System Role" 
            value={formData.role} 
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="receptionist">Receptionist</option>
            <option value="admin">Administrator</option>
          </Select>
          <Input 
            label="Initial Password" 
            type="password" 
            placeholder="Defaults to staff123 if empty"
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffPage;
