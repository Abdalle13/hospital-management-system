import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
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
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Optional, set when requested from a specific doctor's profile
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }, // Set once confirmed into a real appointment
  },
  { timestamps: true }
);

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);
export default AppointmentRequest;
