const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued',
  },
  dueDate: { type: Date },
});

module.exports = mongoose.model('IssuedBook', issuedBookSchema);
