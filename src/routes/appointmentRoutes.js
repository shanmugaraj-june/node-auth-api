
const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
   getDoctorAppointments,    
  updateAppointmentStatus,   
} = require('../controllers/appointmentController');
const { authenticate ,authorize } = require('../middleware/auth');

const router = express.Router();

// All appointment routes require a valid JWT
router.post('/',       authenticate, bookAppointment);
router.get('/my',      authenticate, getMyAppointments);
router.delete('/:id',  authenticate, cancelAppointment); 

// Doctor-only routes
router.get('/doctor',           authenticate, authorize('doctor'), getDoctorAppointments);
router.patch('/:id/status',     authenticate, authorize('doctor'), updateAppointmentStatus);

module.exports = router;