const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/protect');
const {fetchDoctor} = require('../Controllers/appointmentControl');

router.get('/get-doctors', protect, fetchDoctor);
router.get('/get-doctors/:id', protect, fetchDoctor);

module.exports = router;