const mongoose = require("mongoose");

const appoinmentSchema = mongoose.Schema({
    doctorId : {type: String, required: true},
    patientId : {type: String, required: true},
    dateSelected : {type: String, required: true},
    timeSelected : {type: String, required: true},
    status : {type: String, required: true, default: "Appoinment Fixed"}
}, {timestamps: true});

module.exports = mongoose.model('Appoinment', appoinmentSchema);