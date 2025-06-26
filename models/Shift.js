const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
  capacity: { type: Number, required: true },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }]
});

module.exports = mongoose.model('Shift', ShiftSchema);