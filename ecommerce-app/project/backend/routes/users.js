const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.address) user.address = { ...user.address, ...req.body.address };
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json(updated.toJSON());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/paypal-config', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

module.exports = router;
