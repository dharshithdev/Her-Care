const express = require("express");
const router = express.Router();
const protect = require("../Middleware/protect");
const { placeOrder } = require("../Controllers/sanitaryControl");
const { cancelOrder } = require("../Controllers/sanitaryControl");

router.post('/sanitory', protect, placeOrder);
router.put('/sanitory-cancel', protect, cancelOrder);

module.exports = router; 