import Doctor from '../models/doctorModel.js';
import User from '../models/userModel.js';

// @desc    Get all doctors
// @route   GET /api/doctors
export const getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor (Admin only)
// @route   POST /api/doctors
export const createDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, bio, consultationFee, schedule } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'A user with this email already exists' });

    // 2. Create User account for the doctor
    // Default password is 'doctor123' - Admin should tell this to the doctor
    const user = await User.create({
      name,
      email,
      password: 'doctor123',
      phone,
      role: 'doctor'
    });

    // 3. Create Doctor profile linked to the user
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      bio,
      consultationFee,
      schedule,
      userId: user._id
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
