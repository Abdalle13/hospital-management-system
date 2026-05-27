import express from 'express';
import {
  getMedicines, addMedicine, updateMedicine, deleteMedicine
} from '../controllers/pharmacyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMedicines)
  .post(authorize('admin', 'doctor', 'receptionist'), addMedicine);

router.route('/:id')
  .put(authorize('admin', 'doctor', 'receptionist'), updateMedicine)
  .delete(authorize('admin'), deleteMedicine);

export default router;
