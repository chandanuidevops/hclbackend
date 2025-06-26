const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  time: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Slot', SlotSchema);