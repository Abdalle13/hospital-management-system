import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Mail, Clock, CreditCard, Save } from 'lucide-react';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    hospitalName: '', address: '', phone: '', email: '',
    workingHours: { start: '', end: '' }, currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((r) => setSettings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/settings', settings);
      setSettings(data);
      alert('Settings updated successfully');
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <h2 className="page-title">Hospital Settings</h2>
        <p className="page-subtitle">Manage global configuration for your hospital</p>
      </div>

      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <Building2 size={18} className="text-emerald-500" />
            <h3 className="text-base font-semibold text-gray-900">General Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="s-name" label="Hospital Name" value={settings.hospitalName} onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })} className="col-span-2" />
            <Input id="s-phone" label="Phone Number" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            <Input id="s-email" label="Contact Email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            <Input id="s-address" label="Address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="col-span-2" />
          </div>
        </div>

        {/* Operational */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <Clock size={18} className="text-blue-500" />
            <h3 className="text-base font-semibold text-gray-900">Operational Hours & Finance</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input id="s-start" label="Opening Time" type="time" value={settings.workingHours?.start} onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, start: e.target.value } })} />
            <Input id="s-end" label="Closing Time" type="time" value={settings.workingHours?.end} onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, end: e.target.value } })} />
            <Input id="s-cur" label="Currency" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} placeholder="USD, EUR..." />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={saving} size="lg"><Save size={18} /> Save Settings</Button>
        </div>
      </motion.form>
    </div>
  );
};

export default SettingsPage;
