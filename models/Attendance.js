const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  status: { type: String, enum: ['present', 'absent', 'sick leave', 'on leave'], required: true },
  comment: { type: String }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);