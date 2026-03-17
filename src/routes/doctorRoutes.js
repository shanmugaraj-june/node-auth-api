const express = require('express');
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public — no auth needed to browse doctors
router.get('/',    getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;