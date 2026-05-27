import User from '../models/userModel.js';

// @desc    Get all staff (Admins and Receptionists)
// @route   GET /api/staff
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'receptionist'] } }).sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff member
// @route   POST /api/staff
export const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (role === 'doctor' || role === 'patient') {
      return res.status(400).json({ message: 'Invalid role for this endpoint. Use specific creation routes.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password: password || 'staff123',
      phone,
      role
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff status
// @route   PUT /api/staff/:id
export const updateStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    user.role = req.body.role || user.role;
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
export const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await user.deleteOne();
    res.json({ message: 'Staff member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
