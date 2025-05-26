const mongoose = require("mongoose");

const ScategorySchema = mongoose.Schema({
    imageId: {type: String, required: true},
    categoryName: {type: String, required: true},
    categoryImage: {type: String, required: true},
    categoryDescription: {type: String, required: true}
});

module.exports = mongoose.model('sanitorycategory', ScategorySchema);