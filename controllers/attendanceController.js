const User = require('../models/User'); 
const Attendance = require('../models/Attendance');
const sendEmail = require('../utils/email'); // implement below

// helper to format date YYYY-MM-DD
const formatDate = (d) => new Date(d).toISOString().split('T')[0];

exports.markAttendance = async (req, res) => {
  const user = req.user;
  const date = formatDate(new Date());
  // prevent duplicate
  const exists = await Attendance.findOne({ user: user._id, date });
  if(exists) return res.status(400).json({ message:'Attendance already marked today.' });

  const punchIn = new Date();
  const [h,m] = process.env.LATE_TIME.split(':').map(Number);
  const lateCutoff = new Date();
  lateCutoff.setHours(h, m, 0, 0);

  const status = punchIn > lateCutoff ? 'Late' : 'Present';

  const attendance = await Attendance.create({
    user: user._id,
    date,
    punchIn,
    status
  });

  if(status === 'Late') {
    await User.findByIdAndUpdate(user._id, { $inc: { lateCount: 1 } });
    await sendEmail(user.email, 'You are marked Late', `Hi ${user.name}, you were late on ${date} (punchIn: ${punchIn.toLocaleTimeString()})`);
  }

  res.json({ message:'Attendance marked', attendance });
};

exports.punchOut = async (req, res) => {
  const att = await Attendance.findById(req.params.id);
  if(!att) return res.status(404).json({message:'Not found'});
  att.punchOut = new Date();
  await att.save();
  res.json({message:'Punched out', att});
};

exports.getMyAttendance = async (req,res) => {
  const data = await Attendance.find({ user: req.user._id }).sort({ date:-1 });
  res.json(data);
};

exports.getAllAttendance = async (req,res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  const data = await Attendance.find()
    // ✅ Include 'lateCount' in the populated fields
    .populate('user','name email role lateCount')
    .sort({ date:-1 });
  res.json(data);
};

exports.getLateEmployees = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    const lateRecords = await Attendance.find({ date, status: "Late" })
      .populate("user", "name email role lateCount");

    res.json(lateRecords);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
