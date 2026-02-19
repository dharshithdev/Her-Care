const Product = require('../Model/Product');
const Category = require('../Model/Category');
const Cart = require('../Model/Cart');

const getCategory = async (req, res) => {
    try{
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).json({message: "Category Not found"});
        }

        return res.status(200).json({category: categories});
    } catch(error) {
        console.log('Error : ', error.message);
        return res.status(500).json({message: "Internal server error "});
    }
}

const getProduct = async (req, res) => {
    try{
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({message: "Products Not found"});
        }

        return res.status(200).json({product: products});
    } catch(error) {
        console.log('Error : ', error.message);
        return res.status(500).json({message: "Internal server error "});
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId, action } = req.body; // action: 'add' or 'remove'
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            // Item exists, update quantity
            if (action === 'add') {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items[itemIndex].quantity -= 1;
                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            }
        } else if (action === 'add') {
            // New item
            cart.items.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Cart update failed" });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        res.status(200).json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
};

module.exports = {getCategory, getProduct, addToCart, getCart};