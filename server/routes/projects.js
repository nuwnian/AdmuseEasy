const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('-__v');
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save project
router.post('/', [auth, [
  body('title').trim().isLength({ min: 1 }),
  body('productName').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('targetAudience').trim().isLength({ min: 1 }),
  body('mascot').isIn(['capybara', 'hamster', 'parrot', 'panda'])
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, productName, description, targetAudience, mascot, generatedCopy } = req.body;

    const project = new Project({
      userId: req.userId,
      title,
      productName,
      description,
      targetAudience,
      mascot,
      generatedCopy
    });

    await project.save();

    res.status(201).json({
      message: 'Project saved successfully',
      project
    });
  } catch (error) {
    console.error('Save project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', [auth, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('productName').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('targetAudience').optional().trim().isLength({ min: 1 }),
  body('mascot').optional().isIn(['capybara', 'hamster', 'parrot', 'panda'])
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;