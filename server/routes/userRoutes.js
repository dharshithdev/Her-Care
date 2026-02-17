const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/userControl");
const { userLogIn } = require("../Controllers/userControl");

router.post('/register', registerUser);
router.post('/login', userLogIn);

module.exports = router; 