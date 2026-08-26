import express from 'express';
import {
  getInvoices, getInvoice, createInvoice, payInvoice,
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'receptionist', 'patient'), getInvoices)
  .post(authorize('admin', 'receptionist'), createInvoice);

router.get('/:id', authorize('admin', 'receptionist', 'patient'), getInvoice);
router.put('/:id/pay', authorize('admin', 'receptionist'), payInvoice);

export default router;
