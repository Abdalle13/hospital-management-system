import express from 'express';
import {
  getInvoices, getInvoice, createInvoice, payInvoice,
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(authorize('admin', 'receptionist'), createInvoice);

router.get('/:id', getInvoice);
router.put('/:id/pay', authorize('admin', 'receptionist'), payInvoice);

export default router;
