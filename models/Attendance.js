const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD (easier for per-day queries)
  punchIn: { type: Date },
  punchOut: { type: Date },
  status: { type: String, enum: ['Present','Late','Absent'], default: 'Present' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
