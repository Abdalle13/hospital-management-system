import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    message: { type: String, default: '' },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Optional, if they are logged in
  },
  { timestamps: true }
);

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);
export default AppointmentRequest;
