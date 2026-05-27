import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: { type: String, required: true },
    prescription: [
      {
        medication: String,
        dosage: String,
        duration: String,
      },
    ],
    notes: { type: String, default: '' },
    followUpDate: { type: Date },
    vitalSigns: {
      bloodPressure: { type: String, default: '' },
      heartRate: { type: String, default: '' },
      temperature: { type: String, default: '' },
      weight: { type: String, default: '' },
    },
    attachments: [{
      url: String,
      name: String,
      fileId: String
    }],
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', recordSchema);
export default Record;
