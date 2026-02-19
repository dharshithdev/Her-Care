const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true }, // Matches Category name
    image: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('Product', productSchema    )