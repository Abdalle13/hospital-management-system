import Appointment from '../models/appointmentModel.js';
import Invoice from '../models/invoiceModel.js';
import AppointmentRequest from '../models/appointmentRequestModel.js';
import getOwnPatientId from '../utils/getOwnPatientId.js';
import sendEmail from '../utils/sendEmail.js';
import {
  requestReceivedEmail, appointmentConfirmedEmail, appointmentDeclinedEmail, appointmentCancelledEmail,
} from '../utils/emailTemplates.js';

// @desc    Request a public appointment
// @route   POST /api/appointments/public-request
export const requestPublicAppointment = async (req, res) => {
  try {
    const { name, phone, email, department, date, time, message, doctorId } = req.body;

    // Find patient if they are logged in (optional)
    let patientId = null;
    if (req.user && req.user.role === 'patient') {
      const Patient = (await import('../models/patientModel.js')).default;
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) patientId = patient._id;
    }

    // If the request targets a specific doctor (e.g. from their profile page),
    // validate against that doctor's real schedule and existing bookings.
    let doctor = null;
    if (doctorId) {
      const Doctor = (await import('../models/doctorModel.js')).default;
      doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

      const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      if (doctor.schedule?.days?.length && !doctor.schedule.days.includes(weekday)) {
        return res.status(400).json({
          message: `Dr. ${doctor.name} isn't available on ${weekday}s. Available days: ${doctor.schedule.days.join(', ')}.`,
        });
      }

      if (doctor.schedule?.startTime && doctor.schedule?.endTime &&
        (time < doctor.schedule.startTime || time >= doctor.schedule.endTime)) {
        return res.status(400).json({
          message: `Dr. ${doctor.name} is only available between ${doctor.schedule.startTime} and ${doctor.schedule.endTime}.`,
        });
      }

      const existing = await Appointment.findOne({
        doctor: doctor._id,
        date,
        time,
        status: { $ne: 'Cancelled' },
      });
      if (existing) {
        return res.status(409).json({
          message: `That time slot is already booked with Dr. ${doctor.name}. Please choose another time.`,
        });
      }
    }

    const request = await AppointmentRequest.create({
      name,
      phone,
      email,
      department,
      date,
      time,
      message,
      patient: patientId,
      doctor: doctor?._id,
    });

    sendEmail({ to: email, ...requestReceivedEmail({ name, department, date, time }) });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointment requests (Admin only)
// @route   GET /api/appointments/requests
export const getAppointmentRequests = async (req, res) => {
  try {
    const requests = await AppointmentRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the logged-in patient's own appointment requests
// @route   GET /api/appointments/requests/me
export const getMyAppointmentRequests = async (req, res) => {
  try {
    const patientId = await getOwnPatientId(req.user);
    const query = patientId ? { patient: patientId } : { email: req.user.email };
    const requests = await AppointmentRequest.find(query)
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment request status
// @route   PUT /api/appointments/requests/:id/status
export const updateAppointmentRequestStatus = async (req, res) => {
  try {
    const { status, doctorId } = req.body;
    const request = await AppointmentRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (status === 'Confirmed') {
      if (!doctorId) {
        return res.status(400).json({ message: 'Please select a doctor to confirm this appointment' });
      }

      const Doctor = (await import('../models/doctorModel.js')).default;
      const Patient = (await import('../models/patientModel.js')).default;

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

      let patient = request.patient ? await Patient.findById(request.patient) : null;
      if (!patient) patient = await Patient.findOne({ phone: request.phone });
      if (!patient) {
        patient = await Patient.create({
          name: request.name,
          phone: request.phone,
          email: request.email,
        });
      }

      const existing = await Appointment.findOne({
        doctor: doctor._id,
        date: request.date,
        time: request.time,
        status: { $ne: 'Cancelled' },
      });
      if (existing) {
        return res.status(409).json({ message: 'Doctor is already booked for this time slot' });
      }

      const appointment = await Appointment.create({
        patient: patient._id,
        doctor: doctor._id,
        date: request.date,
        time: request.time,
        reason: request.message,
        bookedBy: req.user._id,
      });

      request.appointment = appointment._id;
      request.patient = patient._id;

      const notifyEmail = request.email || patient.email;
      sendEmail({
        to: notifyEmail,
        ...appointmentConfirmedEmail({
          name: request.name, doctorName: doctor.name, specialization: doctor.specialization,
          date: request.date, time: request.time,
        }),
      });
    } else if (status === 'Cancelled') {
      sendEmail({ to: request.email, ...appointmentDeclinedEmail({ name: request.name, date: request.date, time: request.time }) });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (with filters)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    const { filter, patientId, doctorId, status } = req.query;
    let query = {};

    if (filter === 'today') {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(); end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else if (filter === 'week') {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (doctorId) query.doctor = doctorId;
    if (status) query.status = status;

    // If doctor role, only show their appointments
    if (req.user.role === 'doctor') {
      const Doctor = (await import('../models/doctorModel.js')).default;
      const doc = await Doctor.findOne({ userId: req.user._id });
      query.doctor = doc ? doc._id : null; // no linked Doctor record -> show nothing, not everything
    } else if (req.user.role === 'patient') {
      // Ignore any patientId the client sends — patients only ever see their own appointments.
      query.patient = await getOwnPatientId(req.user) || null;
    } else if (patientId) {
      query.patient = patientId;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time } = req.body;
    
    // Check for double booking
    const existing = await Appointment.findOne({ 
      doctor, 
      date, 
      time, 
      status: { $ne: 'Cancelled' } 
    });
    
    if (existing) {
      return res.status(409).json({ message: 'Doctor is already booked for this time slot' });
    }

    const appointment = await Appointment.create({ ...req.body, bookedBy: req.user._id });
    const populated = await appointment.populate([
      { path: 'patient', select: 'name phone email' },
      { path: 'doctor', select: 'name specialization' },
    ]);

    sendEmail({
      to: populated.patient?.email,
      ...appointmentConfirmedEmail({
        name: populated.patient?.name, doctorName: populated.doctor?.name, specialization: populated.doctor?.specialization,
        date: populated.date, time: populated.time,
      }),
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name consultationFee');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    if (status === 'Cancelled') {
      sendEmail({
        to: appointment.patient?.email,
        ...appointmentCancelledEmail({
          name: appointment.patient?.name, doctorName: appointment.doctor?.name,
          date: appointment.date, time: appointment.time,
        }),
      });
    }

    // Auto-create invoice when marked Completed
    if (status === 'Completed') {
      const existingInvoice = await Invoice.findOne({ appointment: appointment._id });
      if (!existingInvoice) {
        const fee = appointment.doctor?.consultationFee || 50;
        await Invoice.create({
          patient: appointment.patient._id,
          doctor: appointment.doctor._id,
          appointment: appointment._id,
          services: [{ name: 'Consultation Fee', amount: fee }],
          totalAmount: fee,
        });
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone email age gender bloodType')
      .populate('doctor', 'name specialization phone');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user.role === 'patient') {
      const ownId = await getOwnPatientId(req.user);
      if (!ownId || String(appointment.patient._id) !== String(ownId)) {
        return res.status(403).json({ message: 'Not authorized to view this appointment' });
      }
    } else if (req.user.role === 'doctor') {
      const Doctor = (await import('../models/doctorModel.js')).default;
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (!doc || String(appointment.doctor._id) !== String(doc._id)) {
        return res.status(403).json({ message: 'Not authorized to view this appointment' });
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
