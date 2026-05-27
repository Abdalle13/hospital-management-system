import express from 'express';
import { getDashboardSummary, getPatientDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);
router.get('/patient', protect, getPatientDashboard);

export default router;
