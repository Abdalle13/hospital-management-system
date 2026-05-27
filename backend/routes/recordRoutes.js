import express from 'express';
import {
  getRecordsByPatient, createRecord, getRecord, updateRecord,
} from '../controllers/recordController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/detail/:id', getRecord);
router.get('/:patientId', getRecordsByPatient);
router.post('/', authorize('admin', 'doctor'), createRecord);
router.put('/:id', authorize('admin', 'doctor'), updateRecord);

export default router;
