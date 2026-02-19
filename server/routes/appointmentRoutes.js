const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/protect');
const {fetchDoctor, bookAppointment, cancelAppointment} = require('../Controllers/appointmentControl');

router.get('/get-doctors', protect, fetchDoctor);
router.get('/get-doctors/:id', protect, fetchDoctor);
router.post('/book-appointment', protect, bookAppointment);
router.post('/cancel-appointment/:id', protect, cancelAppointment);

module.exports = router;