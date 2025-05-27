const SanitoryOrder = require("../Model/Sanitory");
const sanitoryitems = require("../Model/SanitoryItems");
const SanitoryCategory = require("../Model/Sanitorycategory");
const Address = require("../Model/Address");
const Cart = require("../Model/Cart");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
    try {
        const {productId, userId, quantity} = req.body;

        const existingItem = await Cart.findOne({userId, productId});

        if(existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
            await existingItem.save();
            return res.status(200).json({ status: true, message: "Cart item quantity updated." });
        } else {
            const newCart = new Cart({
                productId,
                userId,
                quantity: quantity // Use the quantity sent from frontend (should be 1 for initial add)
            });
            await newCart.save();
            return res.status(200).json({ status: true, message: "Product added to cart." });
        }
    } catch(error) {
        return res.status(500).json({message: "Error occured"});
    }
}

const removeFromCart = async (req, res) => {
    try {
      const { productId, userId } = req.body;
      const item = await Cart.findOne({ productId, userId });
  
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart." });
      }
  
      if (item.quantity > 1) {
        item.quantity -= 1;
        await item.save();
        return res.status(200).json({ status: true, message: "Quantity reduced." });
      } else {
        await Cart.deleteOne({ _id: item._id });
        return res.status(200).json({ status: true, message: "Item removed from cart." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error while removing item." });
    }
  };
  
const changeCart = async (req, res) => {
    console.log("Inside change")
    const {productId, userId, quantity} = req.body;
    console.log(quantity);
    const findItem = await Cart.findOne({productId, userId});
    console.log(findItem);
    
    if(findItem) {
        if (quantity == 0) {
            const deleteItem = await Cart.deleteOne({productId, userId});
    } else {
        findItem.quantity = quantity;
        findItem.save();
    }
    } else {
        const newItem = new Cart({
            userId,
            productId,
            quantity,
        });
        await newItem.save();
    }

    if(findItem || deleteItem || newItem) {
        return res.status(200).json({status: true});
    } else {
        return res.status(200).json({status: false});
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

module.exports = { placeOrder, cancelOrder, fetchOrder, getCategories, getSanitoryProducts, getProductDetails, addToCart, removeFromCart, changeCart };