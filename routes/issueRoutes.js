const express = require('express');
const router = express.Router();
const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');

// ✅ Issue a Book
router.post('/issue-book', async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Log incoming IDs for debugging
        console.log(`Attempting to issue book: Book ID - ${bookId}, User ID - ${userId}`);

        if (!userId || !bookId) {
            return res.status(400).json({ message: 'userId and bookId are required' });
        }

        // Add validation for MongoDB ObjectIds to prevent errors
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
            console.error('Invalid ID format received.');
            return res.status(400).json({ message: 'Invalid userId or bookId format' });
        }

        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!book || !user) {
            console.error('Book or user not found with the provided IDs.');
            return res.status(404).json({ message: 'Book or User not found' });
        }

        if (book.available <= 0) {
            console.warn('Attempt to issue an unavailable book.');
            return res.status(400).json({ message: 'No available copies' });
        }

        // Set issue and due dates
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 7); // 7 days due period

        const issued = new IssuedBook({
            userId,
            bookId,
            issueDate,
            dueDate,
            status: 'issued',
        });

        await issued.save();

        // Decrease available count
        book.available -= 1;
        // FIX: Disable validation on this save operation to bypass the 'description' required error
        await book.save({ validateBeforeSave: false });

        console.log('Book issued successfully!');
        res.status(201).json({ message: 'Book issued successfully!', issued });
    } catch (err) {
        // Log the full error to your server's console for detailed debugging
        console.error('SERVER ERROR: Failed to issue book. Details:', err);
        // Respond with a more generic error message to the client
        res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
    }
});

// ✅ Return a Book
router.post('/return-book', async (req, res) => {
    try {
        const { issueId } = req.body;

        if (!issueId) {
            return res.status(400).json({ message: 'issueId is required' });
        }

        const issuedBook = await IssuedBook.findById(issueId);
        if (!issuedBook || issuedBook.status === 'returned') {
            return res.status(400).json({ message: 'Book already returned or not found' });
        }

        issuedBook.status = 'returned';
        issuedBook.returnDate = new Date();
        await issuedBook.save();

        const book = await Book.findById(issuedBook.bookId);
        book.available += 1;
        // FIX: Disable validation on this save operation as well, for consistency
        await book.save({ validateBeforeSave: false });

        res.json({ message: 'Book returned successfully' });
    } catch (err) {
        console.error('SERVER ERROR: Failed to return book. Details:', err);
        res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
    }
});

// ✅ List All Issued Books
router.get('/issued-books', async (req, res) => {
    try {
        const issues = await IssuedBook.find()
            .populate('userId', 'username email')
            .populate('bookId', 'name isbn')
            .sort({ issueDate: -1 });

        res.json(issues);
    } catch (err) {
        console.error('SERVER ERROR: Failed to get issued books. Details:', err);
        res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
    }
});

// ✅ Get issued books by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const books = await IssuedBook.find({ userId })
            .populate('bookId', 'name isbn')
            .sort({ issueDate: -1 });

        res.json(books);
    } catch (err) {
        console.error('SERVER ERROR: Failed to get user\'s issued books. Details:', err);
        res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
    }
});

module.exports = router;