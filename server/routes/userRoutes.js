const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/userControl");
const { userLogIn } = require("../Controllers/userControl");
const { updateProfile } = require("../Controllers/userControl");
const { addAddress } = require("../Controllers/userControl");
const { updateAddress } = require("../Controllers/userControl");
const { fetchUserData } = require("../Controllers/userControl");
const protect = require("../Middleware/protect");

router.post('/register', registerUser);
router.post('/login', userLogIn);
router.put('/update-profile', protect, updateProfile);
router.post('/add-address', protect, addAddress);
router.put('/update-address', protect, updateAddress);
router.get('/fetch-data', fetchUserData);

module.exports = router;