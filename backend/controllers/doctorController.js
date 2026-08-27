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
    const { name, email, phone, specialization, bio, consultationFee, schedule, image, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'A user with this email already exists' });

    // 2. Create User account for the doctor
    // Falls back to 'doctor123' if admin doesn't set one - admin should tell
    // the doctor whichever password ends up being used.
    const user = await User.create({
      name,
      email,
      password: password || 'doctor123',
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
      image,
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
    const { password, ...doctorData } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, doctorData, {
      new: true, runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // The Doctor profile and its login User are separate documents — keep
    // the login account's name/email/password in sync with what admin just
    // edited, otherwise the doctor can't actually log in with the new email.
    if (doctor.userId) {
      const user = await User.findById(doctor.userId);
      if (user) {
        if (doctorData.email && doctorData.email !== user.email) {
          const emailTaken = await User.findOne({ email: doctorData.email, _id: { $ne: user._id } });
          if (emailTaken) return res.status(400).json({ message: 'A user with this email already exists' });
          user.email = doctorData.email;
        }
        if (doctorData.name) user.name = doctorData.name;
        if (doctorData.phone) user.phone = doctorData.phone;
        if (password) user.password = password;
        await user.save();
      }
    }

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
