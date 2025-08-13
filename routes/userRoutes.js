const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all users (excluding admins)
router.get("/", async (req, res) => {
  const users = await User.find({ userType: "user" }); // filter out admins
  res.json(users);
});

// Add a new user
router.post("/add", async (req, res) => {
  try {
    const { email, username, name, role, password } = req.body;

    if (!email || !username || !name || !role || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      email,
      username,
      name,
      role,
      userType: role, // make role also act as userType if needed
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted." });
});

module.exports = router;
