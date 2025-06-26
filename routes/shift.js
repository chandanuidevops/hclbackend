const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');
const Staff = require('../models/Staff');

// Get all shifts 
router.get('/', async (req, res) => {
  try {
    const { date, type } = req.query;
    let filter = {};
    if (date) filter.date = new Date(date);
    if (type) filter.type = type;
    const shifts = await Shift.find(filter).populate('assignedStaff');
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new shift
router.post('/', async (req, res) => {
  try {
    const { date, type, capacity } = req.body;
    const shift = new Shift({ date, type, capacity, assignedStaff: [] });
    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign staff to a shift 
router.post('/:shiftId/assign', async (req, res) => {
  try {
    const { staffId } = req.body;
    const shift = await Shift.findById(req.params.shiftId);
    if (!shift) return res.status(404).json({ error: 'Shift not found' });

    const sameDayShifts = await Shift.find({
      date: shift.date,
      assignedStaff: staffId
    });
    if (sameDayShifts.length > 0) {
      return res.status(400).json({ error: 'Staff already assigned to a shift on this day' });
    }

    if (shift.assignedStaff.length >= shift.capacity) {
      return res.status(400).json({ error: 'Shift is full' });
    }

    shift.assignedStaff.push(staffId);
    await shift.save();
    res.json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove staff from a shift
router.post('/:shiftId/unassign', async (req, res) => {
  try {
    const { staffId } = req.body;
    const shift = await Shift.findById(req.params.shiftId);
    if (!shift) return res.status(404).json({ error: 'Shift not found' });

    shift.assignedStaff = shift.assignedStaff.filter(
      id => id.toString() !== staffId
    );
    await shift.save();
    res.json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a shift
router.delete('/:id', async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;