import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, default: 'MediCare Hospital' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
    workingHours: {
      start: { type: String, default: '08:00' },
      end: { type: String, default: '20:00' },
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
