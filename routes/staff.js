const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const staffController = require('../controllers/staffController');


router
  .route('/search')
  .get(staffController.getAllStaffs)


// Get all staff 
router.get('/', async (req, res) => {
  try {
    const { name, role } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (role) filter.role = role;
    const staffList = await Staff.find(filter);
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new staff
router.post('/addstaff', async (req, res) => {
  console.log(req.body)
  try {
    const { name, staffId, role, shiftPreference, contactNumber } = req.body;
    const staff = new Staff({ name, staffId, role, shiftPreference, contactNumber });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update staff
router.put('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete staff
router.delete('/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;