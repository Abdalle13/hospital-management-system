import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Not required at the schema level — self-registered patients don't give
    // an age at signup (the public form stays minimal); they fill it in later
    // via their profile. Staff intake still enforces it via the form itself.
    age: { type: Number },
    // Not required at the schema level for the same reason as age — walk-in
    // records created without an interview (e.g. from a phone booking) may
    // not have it yet; the intake and self-registration forms only offer
    // Male/Female as real choices.
    gender: { type: String, enum: ['Male', 'Female'] },
    bloodType: {
      type: String,
      enum: ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      default: 'Unknown',
    },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, default: '' },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    allergies: [{ type: String }],
    notes: { type: String, default: '' },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
