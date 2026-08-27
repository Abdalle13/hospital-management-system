import Patient from '../models/patientModel.js';
import User from '../models/userModel.js';

// @desc    Get logged-in patient's own profile
// @route   GET /api/patients/me
export const getMyPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) patient = await Patient.findOne({ email: req.user.email });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in patient's own profile
// @route   PUT /api/patients/me
export const updateMyPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) patient = await Patient.findOne({ email: req.user.email });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const { age, gender, bloodType, phone, address, emergencyContact, allergies } = req.body;
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (bloodType !== undefined) patient.bloodType = bloodType;
    if (phone !== undefined) patient.phone = phone;
    if (address !== undefined) patient.address = address;
    if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
    if (allergies !== undefined) patient.allergies = allergies;

    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
export const getPatients = async (req, res) => {
  try {
    const { search, gender, bloodType } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    if (gender) query.gender = gender;
    if (bloodType) query.bloodType = bloodType;

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create patient
// @route   POST /api/patients
export const createPatient = async (req, res) => {
  try {
    const { password, ...patientData } = req.body;

    // A password means staff also want this patient to have portal login —
    // otherwise it's a walk-in record with no account, same as before.
    let userId;
    if (password) {
      if (!patientData.email) {
        return res.status(400).json({ message: 'Email is required to create a portal login' });
      }
      const userExists = await User.findOne({ email: patientData.email });
      if (userExists) return res.status(400).json({ message: 'A user with this email already exists' });

      const user = await User.create({
        name: patientData.name, email: patientData.email, password,
        phone: patientData.phone, role: 'patient',
      });
      userId = user._id;
    }

    const patient = await Patient.create({ ...patientData, userId, registeredBy: req.user._id });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
export const updatePatient = async (req, res) => {
  try {
    const { password, ...patientData } = req.body;
    const patient = await Patient.findByIdAndUpdate(req.params.id, patientData, {
      new: true, runValidators: true,
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (password) {
      if (!patient.userId) {
        return res.status(400).json({ message: 'This patient has no portal login account to update' });
      }
      const user = await User.findById(patient.userId);
      if (user) {
        user.password = password;
        await user.save();
      }
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
