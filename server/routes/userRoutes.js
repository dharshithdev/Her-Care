const express = require("express");
const router = express.Router();
const { userLogIn, registerUser, getUserProfile, getUserOrders, getUserAppointments } = 
    require("../Controllers/userControl");
const {protect} = require('../Middleware/protect');

router.post('/register', registerUser);
router.post('/login', userLogIn);
router.get('/profile', protect, getUserProfile);
router.get('/my-orders', protect, getUserOrders);
router.get('/my-appointments', protect, getUserAppointments);

module.exports = router; 