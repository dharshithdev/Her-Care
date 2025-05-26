const SanitoryOrder = require("../Model/Sanitory");
const sanitoryitems = require("../Model/SanitoryItems");
const SanitoryCategory = require("../Model/Sanitorycategory");
const Address = require("../Model/Address");
const Cart = require("../Model/Cart");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
    try {
        const {productId, userId} = req.body;

        const existingItem = await Cart.find({userId, productId});

        if(existingItem) {
            const _id = existingItem._id;
            const quantity = existingItem.quantity + 1;
            const updateQuantity = Cart.findByIdAndUpdate(
                _id,
                {quantity},
                {new: true}
            );

            if(updateQuantity) {
                return res.status(200).json({status: true});
            } else {
                return res.status(400).json({status: false, message: "Something went wrong"});
            }
        }

        const newCart = new Cart({
            productId,
            userId,
            quantity:1
        });

        newCart.save();

        if(newCart) {
            return res.status(200).json({status: true});
        }
    } catch(error) {
        return res.status(500).json({message: "Error occured"});
    }
}

const getProductDetails = async (req, res) => {
    try {
        const {id} = req.query;
        console.log(id);
        const details = await sanitoryitems.findOne({_id: id});
        if(details) {
            console.log(details);
           return res.status(200).json(details);
        }
    } catch(error) {
        return res.status(500).json({error: "Error Fetching Details"});
    }
}

const getCategories = async (req, res) => {
    try {
      const categories = await SanitoryCategory.find();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  };
  
const getSanitoryProducts = async (req, res) => {
    try {
      const { categoryId } = req.query;
      let products;
  
      if (categoryId) {
        products = await sanitoryitems.find({ categoryId });
      } else {
        products = await sanitoryitems.find();
      }
  
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
    }
  };

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

module.exports = { placeOrder, cancelOrder, fetchOrder, getCategories, getSanitoryProducts, getProductDetails, addToCart };