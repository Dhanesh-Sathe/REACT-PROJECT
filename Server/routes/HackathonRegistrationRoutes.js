const express = require('express'); 
const router = express.Router();
const HackathonRegistration = require('../controllers/HackathonRegistartionController');

router.post('/api/register', HackathonRegistration);

module.exports = router;