import express from 'express';
import {
  getPatients, getPatient, createPatient, updatePatient, deletePatient,
  getMyPatientProfile, updateMyPatientProfile,
} from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/me')
  .get(getMyPatientProfile)
  .put(updateMyPatientProfile);

router.route('/')
  .get(authorize('admin', 'doctor', 'receptionist'), getPatients)
  .post(authorize('admin', 'receptionist'), createPatient);

router.route('/:id')
  .get(authorize('admin', 'doctor', 'receptionist'), getPatient)
  .put(authorize('admin', 'receptionist'), updatePatient)
  .delete(authorize('admin'), deletePatient);

export default router;
