const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/protect');
const {dailyMood} = require('../Controllers/dailyController');

router.post('/mood', protect, dailyMood);

module.exports = router;