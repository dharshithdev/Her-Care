const express = require("express");
const router = express.Router();
const protect = require("../Middleware/protect");
const { cancelOrder } = require("../Controllers/sanitaryControl");
const { fetchOrder } = require("../Controllers/sanitaryControl");
const {getSanitoryProducts, getCategories} = require("../Controllers/sanitaryControl");
const {getProductDetails} = require("../Controllers/sanitaryControl");
const {addToCart} = require("../Controllers/sanitaryControl");
const {removeFromCart} = require("../Controllers/sanitaryControl");
const {changeCart} = require("../Controllers/sanitaryControl")
const {fetchFromCart} = require("../Controllers/sanitaryControl");
const {placeOrderFromCart} = require("../Controllers/sanitaryControl")

router.put('/sanitory-cancel', cancelOrder);
router.get('/sanitory-fetch', fetchOrder);
router.get('/sanitoty-products-order', fetchOrder);
router.get("/sanitory-products", getSanitoryProducts);
router.get("/product-detail", getProductDetails);
router.get("/categories", getCategories);
router.post("/add-cart", addToCart);
router.post("/remove-cart", removeFromCart);
router.post("/change-cart", changeCart);
router.get('/fetch-cart', fetchFromCart);
router.post('/place-order', placeOrderFromCart);

module.exports = router;  