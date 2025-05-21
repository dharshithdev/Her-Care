const mongoose = require("mongoose");

const cycleSchema = mongoose.Schema({
    userId:{type: String, required: true},
    cycleLength:{type: Number, required: true, default: 28},
    menstrualLength:{type: Number, required: true, default: 5},
    follicularLength:{type: Number, required: true, default: 10},
    ovulationLength:{type: Number, required: true, default: 1},
    lutealLength:{type: Number, required: true, default: 14},
    regularity:{type:String, enum:["regular", "irregular"], default:"regular"},
    unexpected:{type: Boolean, default: false, default: false},
    recentDay: {type: Date, required: true},
    expectedDate: {type: Date, required: true},
    month:{type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Cycle', cycleSchema);