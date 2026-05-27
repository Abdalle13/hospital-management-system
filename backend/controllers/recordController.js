import Record from '../models/recordModel.js';

// @desc    Get records by patient
// @route   GET /api/records/:patientId
export const getRecordsByPatient = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date time')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create medical record
// @route   POST /api/records
export const createRecord = async (req, res) => {
  try {
    const record = await Record.create(req.body);
    const populated = await record.populate([
      { path: 'doctor', select: 'name specialization' },
      { path: 'appointment', select: 'date time' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single record
// @route   GET /api/records/detail/:id
export const getRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id)
      .populate('patient', 'name age gender bloodType')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date time reason');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update record
// @route   PUT /api/records/:id
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('doctor', 'name specialization');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
