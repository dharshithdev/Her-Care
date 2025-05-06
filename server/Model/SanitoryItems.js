const mongoose = require("mongoose");

const sanitoryItemsSchema = mongoose.Schema({
    categoryId: {type: String, required: true},
    productName: {type: String, required: true},
    brandName: {type: String, required: true},
    price: {type: Number, required: true},
    productImage1: {type: String, required: true},
    productImage2: {type: String, required: true},
    productImage3: {type: String, required: true},
    description: {type: String, required: true},
    size: {type: String, enum: ['s', 'l', 'xl', 'xxl'], required: true, default: 'l'}
}, {timestamps: true});

module.exports = mongoose.model('SanitoryItems', sanitoryItemsSchema); 