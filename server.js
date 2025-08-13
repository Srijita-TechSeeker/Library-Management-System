const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToMongo = require('./db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to database
connectToMongo();

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issue', issueRoutes);


// Define a port
const PORT = process.env.PORT || 5009;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
