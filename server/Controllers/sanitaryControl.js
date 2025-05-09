const SanitoryOrder = require("../Model/Sanitory");
const sanitoryitems = require("../Model/SanitoryItems");
const Address = require("../Model/Address");
const mongoose = require("mongoose");

const fetchOrder = async (req, res) => { 
    try {
        const {_id} = req.body;
        if(!_id) {
            console.log(`Invalid ProductId`);
            return res.status(400).json({message: "Invalid Product ID"});
        };

        const foundItem = await sanitoryitems.findOne({_id});

        if(!foundItem) {
            return res.status(400).json({message: "No Such product"});
        }

        return res.status(200).json({product: foundItem});
    } catch(error) {
        console.log(`Error Occured while fetching ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId, quantity, price, mode, addressId} = req.body;

        if(!productId || !quantity || !price || !mode) {
            console.log(productId, quantity, price, mode);
            return res.status(400).json({message: "Please fill all the details"});
        }

        const total = price * quantity;
        console.log(userId);
        const findAddress = await Address.findOne({userId})
        
        if(!findAddress) {
            return res.status(400).json({message: "User Have no Saved Address"});
        }
        
        const newAddressId = findAddress._id;
        const newSanitoryOrder = new SanitoryOrder({
            userId,
            productId,
            quantity,
            price,
            total,
            mode,
            addressId : newAddressId
        });

        await newSanitoryOrder.save();

        return res.status(201).json({message: `Order Placed Successfully, Address Id : ${newAddressId}`});
    } catch(error) {
        console.log("Error Occured in Controller", error);
        return res.status(500).json({message: "Internal Server Eror"});
    }
};

const cancelOrder = async (req, res) => {
    try {
        const {_id} = req.body;
        const id = _id;
        const cancelOrder = await SanitoryOrder.findByIdAndUpdate(
            id,
            {status: "Cancelled"},
            {new : true}
        );
        if(!cancelOrder) {
            return res.status(400).json({message: "Something went wrong, Cancellation Failed"});
        }

        return res.status(200).json({message: "Order Cancelled", details: cancelOrder});
    } catch(error) {
        console.log("Something went wrong", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const trackOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if(!orderId) {
            return res.status(400).json({message: "Invalid Order ID"});
        }
    
        const trackedOrder = await sanitoryitems.find({_id: orderId});
        if(!trackOrder) {
            return res.status(400).json({message: "No data found for this order"});
        }

        return res.status(200).json({message: "Data Fetched Successfully", data: trackedOrder});
    } catch(error) {
        console.log(`Error Occured ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = { placeOrder, cancelOrder, fetchOrder };