const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    energy: { type: String, default: "Energetic" },
    symptoms: { type: String, default: "None" },
    journal: { type: String } 
}, {timestamps: true});

module.exports = mongoose.model('Daily', dailySchema);