const mongoose = require("mongoose");

const Ccategory = mongoose.Schema({
    categoryName: {type: String, required: true},
    categoryImage: {type: String, required: true},
    categoryDescription: {type: String, required: true}
});

module.exports = mongoose.model('Scategory', Ccategory);