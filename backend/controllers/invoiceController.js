import Invoice from '../models/invoiceModel.js';

// @desc    Get all invoices
// @route   GET /api/invoices
export const getInvoices = async (req, res) => {
  try {
    const { status, patientId } = req.query;
    let query = {};
    if (status) query.paymentStatus = status;
    if (patientId) query.patient = patientId;

    const invoices = await Invoice.find(query)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient', 'name phone email address')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date time reason');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create invoice manually
// @route   POST /api/invoices
export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    const populated = await invoice.populate([
      { path: 'patient', select: 'name phone' },
      { path: 'doctor', select: 'name specialization' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark invoice as paid
// @route   PUT /api/invoices/:id/pay
export const payInvoice = async (req, res) => {
  try {
    const { paymentMethod, paidAmount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.paymentStatus = 'Paid';
    invoice.paymentMethod = paymentMethod || 'Cash';
    invoice.paidAmount = paidAmount || invoice.totalAmount;
    invoice.paidAt = new Date();
    await invoice.save();

    const populated = await invoice.populate([
      { path: 'patient', select: 'name phone' },
      { path: 'doctor', select: 'name specialization' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
