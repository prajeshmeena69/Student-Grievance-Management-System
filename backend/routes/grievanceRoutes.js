const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/authMiddleware');

// POST /api/grievances - Create grievance
router.post('/', protect, async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const grievance = await Grievance.create({
      title,
      description,
      category,
      student: req.student._id
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances/search?title=xyz - Search grievances
router.get('/search', protect, async (req, res) => {
  const { title } = req.query;

  try {
    const grievances = await Grievance.find({
      student: req.student._id,
      title: { $regex: title, $options: 'i' }
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances - Get all grievances
router.get('/', protect, async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.student._id })
      .sort({ createdAt: -1 });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grievances/:id - Get single grievance
router.get('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check ownership
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/grievances/:id - Update grievance
router.put('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check ownership
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/grievances/:id - Delete grievance
router.delete('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check ownership
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Grievance.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;