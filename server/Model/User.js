const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  avgCycleLength: { type: Number, default: 28 }, 
  avgPeriodLength: { type: Number, default: 5 }  
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);