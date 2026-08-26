import Patient from '../models/patientModel.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import Invoice from '../models/invoiceModel.js';
import MedicalRecord from '../models/recordModel.js';
import AppointmentRequest from '../models/appointmentRequestModel.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// Each staff role gets a genuinely different payload — a doctor has no
// business reason to see clinic revenue, and a receptionist cares about
// today's front-desk queue, not headcount trends.
export const getDashboardSummary = async (req, res) => {
  try {
    if (req.user.role === 'doctor') return getDoctorDashboardSummary(req, res);
    if (req.user.role === 'receptionist') return getReceptionistDashboardSummary(req, res);
    return getAdminDashboardSummary(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalPatients,
      totalDoctors,
      appointmentsToday,
      recentAppointments,
      paidInvoices,
      monthlyRevenue,
      patientsThisMonth,
      patientsLastMonth,
      doctorsAddedThisMonth,
      revenueThisMonthAgg,
      revenueLastMonthAgg,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today, $lte: todayEnd } }),
      Appointment.find()
        .populate('patient', 'name')
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 })
        .limit(5),
      Invoice.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Invoice.aggregate([
        {
          $match: {
            paymentStatus: 'Paid',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
      Patient.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Patient.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Doctor.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      Invoice.aggregate([
        { $match: { paymentStatus: 'Paid', createdAt: { $gte: startOfThisMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Invoice.aggregate([
        { $match: { paymentStatus: 'Paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    // Build 12-month array
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueChart = months.map((name, idx) => {
      const found = monthlyRevenue.find((r) => r._id.month === idx + 1);
      return { name, revenue: found ? found.revenue : 0 };
    });

    const pctChange = (curr, prev) => {
      if (!prev) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        appointmentsToday,
        totalRevenue: paidInvoices[0]?.total || 0,
      },
      trends: {
        patientsPct: pctChange(patientsThisMonth, patientsLastMonth),
        doctorsAddedThisMonth,
        revenuePct: pctChange(revenueThisMonthAgg[0]?.total || 0, revenueLastMonthAgg[0]?.total || 0),
      },
      recentAppointments,
      revenueChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorDashboardSummary = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.json({
        stats: { myPatients: 0, appointmentsToday: 0, upcoming: 0, completedThisMonth: 0 },
        recentAppointments: [],
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [myPatients, appointmentsToday, upcoming, completedThisMonth, recentAppointments] = await Promise.all([
      Appointment.distinct('patient', { doctor: doctor._id }).then((ids) => ids.length),
      Appointment.countDocuments({ doctor: doctor._id, date: { $gte: today, $lte: todayEnd } }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'Scheduled', date: { $gte: today } }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'Completed', date: { $gte: startOfThisMonth } }),
      Appointment.find({ doctor: doctor._id })
        .populate('patient', 'name')
        .populate('doctor', 'name specialization')
        .sort({ date: -1 })
        .limit(5),
    ]);

    res.json({
      stats: { myPatients, appointmentsToday, upcoming, completedThisMonth },
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReceptionistDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalPatients, appointmentsToday, pendingRequests, unpaidInvoices, recentAppointments] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today, $lte: todayEnd } }),
      AppointmentRequest.countDocuments({ status: 'Pending' }),
      Invoice.countDocuments({ paymentStatus: { $in: ['Unpaid', 'Partial'] } }),
      Appointment.find()
        .populate('patient', 'name')
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      stats: { totalPatients, appointmentsToday, pendingRequests, unpaidInvoices },
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient dashboard
// @route   GET /api/dashboard/patient
export const getPatientDashboard = async (req, res) => {
  try {
    // Find patient profile linked by userId, falling back to email for legacy records
    let patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) patient = await Patient.findOne({ email: req.user.email });

    if (!patient) {
      return res.json({
        recentAppointments: [],
        recordsCount: 0,
        invoicesCount: 0,
      });
    }

    const [recentAppointments, recordsCount, invoicesCount] = await Promise.all([
      Appointment.find({ patient: patient._id })
        .populate('doctor', 'name specialization')
        .sort({ date: -1 })
        .limit(5),
      MedicalRecord.countDocuments({ patient: patient._id }),
      Invoice.countDocuments({ patient: patient._id }),
    ]);

    res.json({
      recentAppointments,
      recordsCount,
      invoicesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
