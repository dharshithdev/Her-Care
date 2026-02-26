const mongoose = require('mongoose');

const Pregnant = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  lmpDate: {type: Date, required: true},
  dueDate: {type: Date, required: true},
  conceptionDate: {type: Date, required: true},
  status: {type: String, enum: ['active', 'completed', 'interrupted'], default: 'active'}
}, {timestamps: true});

module.exports = mongoose.model('Pregnant', Pregnant);