import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainHeader from "../../Components/ShopHeader";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?._id) throw new Error("User not logged in");

      const res = await axios.get("http://localhost:5000/api/sanitory/fetch-cart", {
        params: { userId: userData._id },
      });

      if (res.data.status) {
        setCartItems(res.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.message);
      toast.error("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      await axios.post("http://localhost:5000/api/sanitory/change-cart", {
        userId: userData._id,
        productId,
        quantity,
      });
      fetchCartItems();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Error updating quantity");
    }
  };

  const handleBuyNow = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?._id) {
        toast.error("Please login to place an order");
        return;
      }

      const addressId = "DEFAULT_ADDRESS_ID"; // Replace with actual address logic
      const mode = "Cash on Delivery";

      const res = await axios.post("http://localhost:5000/api/sanitory/place-order", {
        userId: userData._id,
        addressId,
        mode,
      });

      if (res.data.status) {
        toast.success("Order placed successfully!");
        setCartItems([]);
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  if (loading) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-pink-100 pt-40 px-6 pb-32 relative">
      <MainHeader />
      <ToastContainer position="bottom-center" autoClose={2500} />

      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cartItems.map((item, index) => {
            const product = item.product;
            const image = product?.productImage1;

            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center mb-3">
                  {image ? (
                    <img
                      src={`http://localhost:5000/Admin/ProductImages/${product.imageId}/${image}`}
                      alt={product.productName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-pink-600 mb-1">{product.productName}</h2>
                <p className="text-sm text-gray-600 mb-1">Brand: {product.brandName}</p>
                <p className="text-sm text-gray-700 mb-1">Price: ₹{product.price}</p>

                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-pink-200 text-pink-800 font-bold rounded"
                    onClick={() =>
                      updateQuantity(product._id, item.quantity > 1 ? item.quantity - 1 : 0)
                    }
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-pink-500 text-white font-bold rounded"
                    onClick={() => updateQuantity(product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-500">Total: ₹{product.price * item.quantity}</p>
              </div>
            );
          })}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 flex justify-center z-50">
          <button
            onClick={handleBuyNow}
            className="bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-pink-700 transition"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
