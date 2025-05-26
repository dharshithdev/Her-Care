const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productId: {type: String, required: true},
    userId: {type: String, required: true},
    quantity: {type: Number, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);