const mongoose = require("mongoose");

const ScategorySchema = mongoose.Schema({
    categoryName: {type: String, required: true},
    categoryImage: {type: String, required: true},
    categoryDescription: {type: String, required: true}
});

module.exports = mongoose.model('Sanitorycategory', ScategorySchema);