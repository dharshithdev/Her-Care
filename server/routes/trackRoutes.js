const express = require('express');
const router = express.Router();
const { getTrackingData, logActualPeriod } = require('../Controllers/userControl');
const {protect} = require('../Middleware/protect'); // Ensure user is logged in

router.get('/data', protect, getTrackingData);
router.post('/log', protect, logActualPeriod);

module.exports = router;