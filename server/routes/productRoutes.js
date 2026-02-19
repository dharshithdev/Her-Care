const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/protect'); // Ensure user is logged in
const {getProduct, getCategory, addToCart, getCart, placeOrder} = require('../Controllers/productControl');

router.get('/categories', protect, getCategory);
router.get('/products', protect, getProduct);
router.post('/cart/update', protect, addToCart);
router.get('/cart', protect, getCart);
router.post('/place-order', protect, placeOrder);

module.exports = router;