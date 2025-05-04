const express = require("express");
const router = express.Router();
const protect = require("../Middleware/protect");
const {placeOrder} = require("../Controllers/craveControl");
const {cancelOrder} = require("../Controllers/craveControl");

router.post("/cravings", protect, placeOrder);
router.put("/cravings-cancel", protect, cancelOrder);

module.exports = router;