const mongoose = require("mongoose");

const CravingOrderSchema = new mongoose.Schema({
    userId: {type:String, required: true},
    productId: {type:String, required: true},
    quantity:{type:Number, required: true},
    price:{type:Number, required: true},
    total:{type:Number, required: true},
    mode:{type:String, required: true},
    addressId: {type:String, required: true},
    status:{type: String, required: true, default: "Order Placed"}
}, {timestamps: true});

module.exports = mongoose.model('CravingOrder', CravingOrderSchema); 