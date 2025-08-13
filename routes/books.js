const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Add a new book
router.post('/', async (req, res) => {
    const { name, isbn, category, author, description, price, quantity, image } = req.body;
    try {
        const newBook = new Book({ name, isbn, category, author,  description, price, quantity, available: quantity, image });
        await newBook.save();
        res.json({ message: 'Book added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a book by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received update request for ID:', req.params.id); 
    const { name, isbn, category, author, description, price, quantity, image } = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { name, isbn, category, author, description, price, quantity, available: quantity, image },
            { new: true }
        );
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Borrow a book - new route to decrement the quantity by 1
router.put('/borrow/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);

        // Check if the book exists
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the book is available (quantity > 0)
        if (book.quantity <= 0) {
            return res.status(400).json({ message: 'This book is unavailable' });
        }

        // Decrement the quantity and update availability
        book.quantity -= 1;
        if (book.quantity === 0) {
            book.available = 0;  // Mark the book as unavailable if quantity reaches 0
        }

        // Save the updated book
        await book.save();
        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;