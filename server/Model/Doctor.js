const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, default: "Gynecologist & Obstetrician" },
    location: { type: String, required: true },
    about: { type: String },
    image: { type: String }, // URL to the image
    availableDays: [{ type: String }], 
});

module.exports = mongoose.model('Doctor', doctorSchema);