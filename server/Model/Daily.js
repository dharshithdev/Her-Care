const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
    userId: { type: String },
    energy: { type: String },
    symptoms: { type: String },
    journal: { type: String } 
}, {timestamps: true});

module.exports = mongoose.model('Daily', dailySchema);