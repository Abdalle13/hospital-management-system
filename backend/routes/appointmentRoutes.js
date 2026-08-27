import express from 'express';
import {
  getAppointments, createAppointment, updateAppointmentStatus, getAppointment,
  requestPublicAppointment, getAppointmentRequests, updateAppointmentRequestStatus, getMyAppointmentRequests
} from '../controllers/appointmentController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';
import { publicRequestLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route for appointment requests — stays open to anonymous callers,
// but optionalAuth links it to the logged-in patient when there is one.
router.post('/public-request', publicRequestLimiter, optionalAuth, requestPublicAppointment);

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('admin', 'receptionist', 'doctor'), createAppointment);

// Admin/Receptionist routes to see and manage requests
router.get('/requests', authorize('admin', 'receptionist'), getAppointmentRequests);
router.put('/requests/:id/status', authorize('admin', 'receptionist'), updateAppointmentRequestStatus);

// Logged-in patient's own pending/past requests
router.get('/requests/me', authorize('patient'), getMyAppointmentRequests);




router.get('/:id', getAppointment);
router.put('/:id/status', authorize('admin', 'doctor', 'receptionist'), updateAppointmentStatus);

export default router;
