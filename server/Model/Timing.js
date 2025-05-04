const mongoose = require("mongoose");

const timingsScema = mongoose.Schema({
    doctorId : {type: String, required: true},
    daysNotAvail : {type: Date, required: true},
    timeAvail : {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Timings', timingsScema);