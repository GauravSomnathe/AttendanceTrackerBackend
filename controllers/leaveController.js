const Leave = require('../models/Leave');

exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      user: req.user._id,
      startDate,
      endDate,
      reason
    });
    res.json({ message: 'Leave applied', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const leaves = await Leave.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    // ✅ Normalize the input to match enum
    const status = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1).toLowerCase();
    leave.status = status;

    await leave.save();

    res.json({ message: 'Leave updated', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
