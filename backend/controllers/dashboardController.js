import Patient from '../models/patientModel.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import Invoice from '../models/invoiceModel.js';
import MedicalRecord from '../models/recordModel.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// ... existing getDashboardSummary ...
export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      totalDoctors,
      appointmentsToday,
      recentAppointments,
      paidInvoices,
      monthlyRevenue,
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
    ]);

    // Build 12-month array
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueChart = months.map((name, idx) => {
      const found = monthlyRevenue.find((r) => r._id.month === idx + 1);
      return { name, revenue: found ? found.revenue : 0 };
    });

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        appointmentsToday,
        totalRevenue: paidInvoices[0]?.total || 0,
      },
      recentAppointments,
      revenueChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient dashboard
// @route   GET /api/dashboard/patient
export const getPatientDashboard = async (req, res) => {
  try {
    // Find patient profile linked by email or phone
    const patient = await Patient.findOne({ email: req.user.email });
    
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
