
const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All appointment routes require a valid JWT
router.post('/',       authenticate, bookAppointment);
router.get('/my',      authenticate, getMyAppointments);
router.delete('/:id',  authenticate, cancelAppointment);

module.exports = router;