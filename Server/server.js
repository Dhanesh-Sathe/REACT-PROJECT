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

// Registration endpoint
// app.post('/api/register', async (req, res) => {
//   try {
//     const { leader, teamMembers, teamSize, teamName, paymentScreenshot } = req.body;
    
//     // Validate required fields
//     if (!leader || !teamMembers || !teamSize || !teamName || !paymentScreenshot) {
//       return res.status(400).json({ 
//         message: 'Missing required information. Please ensure all fields including payment are filled.' 
//       });
//     }

//     // Check if team name already exists
//     const existingTeam = await Team.findOne({ teamName });
//     if (existingTeam) {
//       return res.status(400).json({ 
//         message: 'Team name already exists. Please choose a different name.' 
//       });
//     }
    
//     // Create and save the team document
//     const team = new Team({
//       teamSize,
//       teamName,
//       leader,
//       teamMembers,
//       paymentScreenshot,
//       registrationStatus: 'pending'
//     });
    
//     const savedTeam = await team.save();
    
//     res.status(201).json({
//       message: 'Team registered successfully. Your registration is pending verification.',
//       teamId: savedTeam._id
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ 
//         message: 'Validation error. Please check all required fields.' 
//       });
//     }
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });

// Get all team registrations
// app.get('/api/registrations', async (req, res) => {
//   try {
//     const teams = await Team.find({});
//     res.status(200).json(teams);
//   } catch (error) {
//     console.error('Error fetching registrations:', error);
//     res.status(500).json({ message: 'Server error fetching registrations' });
//   }
// });

// // Get a specific team registration by ID
// app.get('/api/registrations/:id', async (req, res) => {
//   try {
//     const team = await Team.findById(req.params.id);
//     if (!team) {
//       return res.status(404).json({ message: 'Team not found' });
//     }
//     res.status(200).json(team);
//   } catch (error) {
//     console.error('Error fetching team:', error);
//     res.status(500).json({ message: 'Server error fetching team' });
//   }
// });

// Verify payment and update registration status
// app.patch('/api/registrations/:id/verify', async (req, res) => {
//   try {
//     const { verificationStatus } = req.body;
//     if (!['verified', 'rejected'].includes(verificationStatus)) {
//       return res.status(400).json({ message: 'Invalid verification status' });
//     }

//     const team = await Team.findById(req.params.id);
//     if (!team) {
//       return res.status(404).json({ message: 'Team not found' });
//     }

//     team.payment.verificationStatus = verificationStatus;
//     team.payment.verificationDate = new Date();
//     team.registrationStatus = verificationStatus === 'verified' ? 'approved' : 'rejected';

//     await team.save();

//     res.status(200).json({
//       message: `Team registration ${verificationStatus}`,
//       team
//     });
//   } catch (error) {
//     console.error('Error updating verification status:', error);
//     res.status(500).json({ message: 'Server error updating verification status' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});