const express = require("express");
const router = express.Router();
const {bookAppoinment} = require("../Controllers/appoinControl");
const {cancelAppoinment} = require("../Controllers/appoinControl");
const {changeDate} = require("../Controllers/appoinControl");
const {protect} = require("../Middleware/protect");

router.post('/book', protect, bookAppoinment);
router.put('/cancel', protect, cancelAppoinment);
router.put('/change', protect, changeDate);

module.exports = router;