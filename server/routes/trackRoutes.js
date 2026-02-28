const express = require('express');
const router = express.Router();
const { getTrackingData, logActualPeriod, startPregnancy, getPregencyTrackingData, removePregnancyMode 
        } = require('../Controllers/userControl');
const {protect} = require('../Middleware/protect'); // Ensure user is logged in

router.get('/data', protect, getTrackingData);
router.get('/pregency/data', protect, getPregencyTrackingData);
router.post('/log', protect, logActualPeriod);
router.post('/addpregnant', protect, startPregnancy);
router.post('/removepregnant', protect, removePregnancyMode);

module.exports = router; 