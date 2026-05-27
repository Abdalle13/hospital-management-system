import express from 'express';
import {
  getAppointments, createAppointment, updateAppointmentStatus, getAppointment,
  requestPublicAppointment, getAppointmentRequests, updateAppointmentRequestStatus
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for appointment requests
router.post('/public-request', requestPublicAppointment);

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('admin', 'receptionist', 'doctor'), createAppointment);

// Admin/Receptionist routes to see and manage requests
router.get('/requests', authorize('admin', 'receptionist'), getAppointmentRequests);
router.put('/requests/:id/status', authorize('admin', 'receptionist'), updateAppointmentRequestStatus);




router.get('/:id', getAppointment);
router.put('/:id/status', authorize('admin', 'doctor', 'receptionist'), updateAppointmentStatus);

export default router;
