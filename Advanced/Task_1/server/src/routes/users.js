const express = require('express');
const { User } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { validateProfileUpdate, validateUUID, validatePagination } = require('../middleware/validation');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', verifyToken, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', verifyToken, validateProfileUpdate, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'address', 'city', 'country'];
    const updates = {};

    // Only include allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update user
    await req.user.update(updates);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const { theme, language, notifications } = req.body;
    
    const preferences = {
      ...req.user.preferences,
      ...(theme && { theme }),
      ...(language && { language }),
      ...(notifications !== undefined && { notifications })
    };

    await req.user.update({ preferences });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences
      }
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Preferences update failed'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', verifyToken, validateUUID('id'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

module.exports = router;
