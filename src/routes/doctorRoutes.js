const express = require('express');
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');
const { getDoctorSlots } = require('../controllers/appointmentController'); // ← add
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public — no auth needed to browse doctors
router.get('/',    getAllDoctors);
router.get('/:id', getDoctorById); 
router.get('/:id/slots', getDoctorSlots); // ← add — public, no auth needed

module.exports = router;