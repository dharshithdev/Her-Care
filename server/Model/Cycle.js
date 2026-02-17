const mongoose = require("mongoose");

const cycleSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional: for tracking flow duration
  isPredicted: { type: Boolean, default: false } // To distinguish between user-input and estimates
}, {timestamps: true});
 
module.exports = mongoose.model('Cycle', cycleSchema);