const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const Shift = require('../models/Shift');



// Get attendance records
router.get('/', async (req, res) => {
  try {
    const { staffId, shiftId, status } = req.query;
    let filter = {};
    if (staffId) filter.staff = staffId;
    if (shiftId) filter.shift = shiftId;
    if (status) filter.status = status;
    const records = await Attendance.find(filter)
      .populate('staff')
      .populate('shift');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { staff, shift, status, comment } = req.body;
    const record = await Attendance.findOneAndUpdate(
      { staff, shift },
      { status, comment },
      { upsert: true, new: true }
    );
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;