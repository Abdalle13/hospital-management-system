import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    bio: { type: String, default: '' },
    schedule: {
      days: [{ type: String }],
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
    },
    consultationFee: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
