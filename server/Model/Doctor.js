const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true},
    gender : {type: Number, required: true},
    phone : {type: Number, required: false},
    specilization : {type: String, required: true},
    experience : {type: String, required: false, default : "1+ Years"}
}, {timestamps: true});

module.exports = mongoose.model('Doctor', doctorSchema);