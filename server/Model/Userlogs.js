const mongoose = require("mongoose");

const userlogSchema = mongoose.Schema({
    userId: {type: String, required: true},
    logInTime : {type: Date, required: true},
    logOutTime : {type: Date, required: true, default: "Pending"}
}, {timestamps: true});

module.exports = mongoose.Model('Userlog', userlogSchema);