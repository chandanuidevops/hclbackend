const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// Create a new slot
router.post('/addslot', async (req, res) => {
  try {
    const { time } = req.body;
    const slot = new Slot({ time });
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;