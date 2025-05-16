const mongoose = require("mongoose");

const cycleSchema = mongoose.Schema({
    userId:{type: String, required: true},
    cycleLength:{type: Number, required: true, default: 28},
    menstrualLength:{type: Number, required: true, default: 28},
    follicularLength:{type: Number, required: true, default: 28},
    ovulationLength:{type: Number, required: true, default: 28},
    lutealLength:{type: Number, required: true, default: 28},
    flow1:{type: Number, required: false, default: 4},
    flow2:{type: Number, required: false, default: 5},
    flow3:{type: Number, required: false, default: 3},
    flow4:{type: Number, required: false, default: 2},
    flow5:{type: Number, required: false, default: 1},
    recentDate1: {type: String, required: true},
    recentDate2: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Cycle', cycleSchema);