const express = require("express");
const router = express.Router();
const protect = require("../Middleware/protect");
const {placeOrder} = require("../Controllers/craveControl");
const {cancelOrder} = require("../Controllers/craveControl");
const {fetchOrder} = require("../Controllers/craveControl");

router.post("/cravings", protect, placeOrder);
router.put("/cravings-cancel", protect, cancelOrder);
router.get("/cravings-fetch", protect, fetchOrder);

module.exports = router;