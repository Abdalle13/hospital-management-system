import Appointment from '../models/appointmentModel.js';
import Invoice from '../models/invoiceModel.js';
import AppointmentRequest from '../models/appointmentRequestModel.js';

// @desc    Request a public appointment
// @route   POST /api/appointments/public-request
export const requestPublicAppointment = async (req, res) => {
  try {
    const { name, phone, department, date, time, message } = req.body;
    
    // Find patient if they are logged in (optional)
    let patientId = null;
    if (req.user && req.user.role === 'patient') {
      const Patient = (await import('../models/patientModel.js')).default;
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) patientId = patient._id;
    }

    const request = await AppointmentRequest.create({
      name,
      phone,
      department,
      date,
      time,
      message,
      patient: patientId
    });


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

// @desc    Update appointment request status
// @route   PUT /api/appointments/requests/:id/status
export const updateAppointmentRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AppointmentRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

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

    if (patientId) query.patient = patientId;
    if (doctorId) query.doctor = doctorId;
    if (status) query.status = status;

    // If doctor role, only show their appointments
    if (req.user.role === 'doctor') {
      const Doctor = (await import('../models/doctorModel.js')).default;
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (doc) query.doctor = doc._id;
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
      { path: 'patient', select: 'name phone' },
      { path: 'doctor', select: 'name specialization' },
    ]);
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
      .populate('patient', 'name')
      .populate('doctor', 'name consultationFee');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

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
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
