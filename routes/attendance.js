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

    
//Validate if status updates are only after the shift ends or withinthe duration.
const shiftDetails = await Shift.findById(shift);
if (!shiftDetails) {
  return res.status(404).json({ error: 'Shift not found' });
}

const now = new Date();
const shiftStart = new Date(shiftDetails.startTime);
const shiftEnd = new Date(shiftDetails.endTime);


const isAfterShift = now > shiftEnd;
const isWithinWindow = now >= shiftStart && now <= shiftEnd;
if (!(isAfterShift || isWithinWindow)) {
  return res.status(403).json({
    error: 'Attendance can only be updated after the shift ends or within a specific time window',
  });
}

// prevent double booking of staff member on the same day.
   const dayStart = startOfDay(shiftStart);
    const dayEnd = endOfDay(shiftStart);
 const alreadyAssigned = await Attendance.findOne({
      staff,
      shift: { $ne: shift } 
    }).populate({
      path: 'shift',
      match: {
        startTime: {
          $gte: dayStart,
          $lte: dayEnd
        }
      }
    });

    if (alreadyAssigned?.shift) {
      return res.status(400).json({
        error: 'This staff is already assigned to another shift on the same day.',
      });
    }



 const sameDayAssignments = await Attendance.find({
      staff,
      shift: { $ne: shift }
    }).populate({
      path: 'shift',
      match: {
        startTime: { $gte: dayStart, $lte: dayEnd }
      }
    });

const conflictingShifts = sameDayAssignments.filter(a => a.shift);


    const record = await Attendance.findOneAndUpdate(
      { staff, shift },
      { status, comment },
      { upsert: true, new: true }
    );
     const response = { data: record };
    if (conflictingShifts.length > 0) {
      response.warning = `Warning: This staff is already assigned to ${conflictingShifts.length} other shift(s) on the same day.`;
    }
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