const mongoose = require("mongoose");

const Scategory = mongoose.Schema({
    categoryName: {type: String, required: true},
    categoryImage: {type: String, required: true},
    categoryDescription: {type: String, required: true}
});

module.exports = mongoose.model('Scategory', Scategory);