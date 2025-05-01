const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/userControllers");
const { userLogIn } = require("../Controllers/userControllers");
const { updateProfile } = require("../Controllers/userControllers");
const { addAddress } = require("../Controllers/userControllers");
const protect = require("../Middleware/protect");

router.post('/register', registerUser);
router.post('/login', userLogIn);
router.put('/update', protect, updateProfile);
router.post('/add-address', protect, addAddress);

module.exports = router;