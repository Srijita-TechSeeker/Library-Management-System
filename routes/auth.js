const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
  const { email, username, password, userType } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      email,
      username,
      password,
      userType,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error occurred during registration: ", error.message);  // Log the error message
    res.status(500).json({ message: 'Server error', error: error.message });  // Send error message back
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      user: {
        id: user._id,
        userType: user.userType,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;

        // ✅ This includes the full user object in the response
        res.json({
          token,
          userType: user.userType,
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            userType: user.userType
          }
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
