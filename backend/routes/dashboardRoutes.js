import express from 'express';
import { getDashboardSummary, getPatientDashboard } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, authorize('admin', 'doctor', 'receptionist'), getDashboardSummary);
router.get('/patient', protect, getPatientDashboard);

export default router;
