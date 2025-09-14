const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const projectCount = await Project.countDocuments({ userId: req.userId });
    const recentProjects = await Project.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title productName mascot updatedAt');

    res.json({
      user: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt,
        lastLogin: user.lastLogin,
        usageCount: user.usageCount
      },
      stats: {
        totalProjects: projectCount,
        totalGenerations: user.usageCount
      },
      recentProjects
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;