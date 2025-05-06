const mongoose = require("mongoose");

const cravingItemsSchema =  mongoose.Schema({
    categoryId: {type: String, required: true},
    productName: {type: String, required: true},
    price: {type: Number, required: true},
    productImage1: {type: String, required: true},
    productImage2: {type: String, required: true},
    productImage3: {type: String, required: true},
    description: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('CravingItems', cravingItemsSchema);