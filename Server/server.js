const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const HackathonRegistration = require('./routes/HackathonRegistrationRoutes');
const connectDB = require('./config/dbConnection');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// MongoDB connection
connectDB();

// Routes
app.use(HackathonRegistration);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});