const mongoose = require('mongoose');

// Schema for participant data (both leader and team members)
const participantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  instituteName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  courseSpecialization: {
    type: String,
    required: true,
    trim: true
  },
  graduationYear: {
    type: String,
    required: true,
    trim: true
  },
  isAcesMember: {
    type: Boolean,
    default: false
  },
  receipt: {
    type: String, // Base64 string for image
    default: ''
  }
});


// Schema for the entire team
const teamSchema = new mongoose.Schema({
  teamSize: {
    type: Number,
    required: true,
    enum: [2, 3, 4]
  },
  teamName: {
    type: String,
    required: true,
    trim: true,
    unique: true // Ensure team names are unique
  },
  leader: participantSchema,
  teamMembers: [participantSchema],
  paymentScreenshot: {
    type: String, // Base64 string for image
    default: ''
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };