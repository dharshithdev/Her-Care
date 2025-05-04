const express = require("express");
const router = express.Router();
const {bookAppoinment} = require("../Controllers/appoinControl");
const protect = require("../Middleware/protect");

router.post('/book', protect, bookAppoinment);

module.exports = router;