const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  name: {                 // New field for full name
    type: String,
    required: false,
  },
  role: {                 // New field: student / faculty
    type: String,
    enum: ['student', 'faculty'],
    required: false,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
