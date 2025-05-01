const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {type:String, required: true},
    address:{
        state:{type:String, required: false},
        pin:{type:String, required: false},
        landmark:{type:String, required: false},
    }
}, {timestamps: true});

module.exports = mongoose.model('Address', addressSchema);

