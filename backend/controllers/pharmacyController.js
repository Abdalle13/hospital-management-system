import Medicine from '../models/medicineModel.js';

// @desc    Get all medicines (with alerts)
// @route   GET /api/pharmacy
export const getMedicines = async (req, res) => {
  try {
    const { search, alert } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const medicines = await Medicine.find(query).sort({ name: 1 });

    if (alert === 'true') {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const filtered = medicines.filter(
        (m) => m.stock <= m.lowStockThreshold || new Date(m.expiryDate) <= thirtyDaysFromNow
      );
      return res.json(filtered);
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new medicine
// @route   POST /api/pharmacy
export const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/pharmacy/:id
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/pharmacy/:id
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
