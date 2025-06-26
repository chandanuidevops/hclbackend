const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  shiftPreference: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
  contactNumber: { type: String, required: true }
});

module.exports = mongoose.model('Staff', StaffSchema);