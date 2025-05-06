const CravingOrder = require("../Model/Craving");
const Address = require("../Model/Address");
const cravingItems = require("../Model/Cravingitems");

const fetchOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {_id} = req.body;
        const productDetails = await cravingItems.findOne({_id});
        console.log(productDetails);
        if(!productDetails) {
            return res.status(400).json({message: "Product Not found"});
        }

        return res.status(201).json({message: "Product Datas fetched Successfully", product: productDetails});
    } catch (error) {
        console.log(`Cannot fetch data ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId, quantity, price, mode, addressId} = req.body;

        if(!productId || !quantity || !price || !mode || addressId) {
            return res.status(400).json({message: "Fill all the feilds"});
        }

        const findUser = await Address.findOne({userId});
        console.log(findUser);
        const addressIdObtained = findUser._id;
        const totalPrice = price * quantity;
        const newOrder = new CravingOrder({ 
            userId,
            productId,
            quantity,
            price,
            total : totalPrice,
            mode,
            addressId : addressIdObtained,
        });

        await newOrder.save();

        return res.status(201).json({message: "Order Placed Successfully"});
    } catch(error) {
        console.log("Error Occurehd ", error);
        return res.status(500).json({message: "Internal server Error"});
    }
}


const cancelOrder = async (req, res) => {
    try {
        const {_id} = req.body;
        const id = _id;
        const cancelOrder = await CravingOrder.findByIdAndUpdate(
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

module.exports = { placeOrder, cancelOrder, fetchOrder };