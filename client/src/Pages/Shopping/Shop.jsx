import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MainHeader from "../../Components/ShopHeader";
import { useNavigate } from "react-router-dom";

const SanitaryShop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // State for toast message
  const [toastType, setToastType] = useState(null); // 'success' or 'error'

  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sanitory/categories");
      console.log('Categories fetched:', res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const url = selectedCategoryId
        ? `http://localhost:5000/api/sanitory/sanitory-products?categoryId=${selectedCategoryId}`
        : "http://localhost:5000/api/sanitory/sanitory-products";
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, selectedCategoryId]);

  const handleProductClick = (productId) => {
    // This navigation path is correct for passing ID via URL param
    navigate(`/product/${productId}`, { state: { productId: productId } });
  };

  const handleAddToCart = async (productId) => {
    let userId = null;
    try {
        console.log('In here');
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userId = userData._id;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }

    if (!userId) {
      setToastMessage("Please log in to add items to cart.");
      setToastType("error");
      setTimeout(() => setToastMessage(null), 3000); // Clear message after 3 seconds
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/sanitory/add-cart", {
        productId: productId,
        userId: userId,
      });

      if (res.data.status) { // Assuming your backend returns { status: true } on success
        setToastMessage("Product added to cart!");
        setToastType("success");
      } else {
        setToastMessage("Failed to add product to cart.");
        setToastType("error");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setToastMessage("Error adding to cart. Please try again.");
      setToastType("error");
    } finally {
      setTimeout(() => setToastMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div className="bg-pink-100 min-h-screen pt-40 px-6 pb-20">
      <MainHeader />

      {/* Toast Message Display */}
      {toastMessage && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50
            ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toastMessage}
        </div>
      )}

      {/* Category scroll - Centered, Circular Images, Fixed Height, and Hidden Scrollbar */}
      <div className="flex items-start justify-center overflow-x-auto gap-6 mb-10 px-2 scrollbar-hide">
        {/* All button */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`flex-shrink-0 min-w-[90px] w-[90px] h-[140px] flex flex-col items-center text-center p-2 rounded-lg transition transform duration-200 ease-in-out
            ${selectedCategoryId === null ? "bg-pink-200 shadow-md scale-105" : "bg-white hover:scale-105 hover:shadow-md"}`}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 border-2 border-transparent">
            <span className="text-sm font-semibold text-gray-700">All</span>
          </div>
          <p className="text-xs mt-2 text-gray-700 font-semibold">All Products</p>
        </button>

        {/* Category buttons */}
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategoryId(cat._id)}
            className={`flex-shrink-0 min-w-[90px] w-[90px] h-[140px] flex flex-col items-center text-center p-2 rounded-lg transition transform duration-200 ease-in-out
              ${selectedCategoryId === cat._id ? "bg-pink-200 shadow-md scale-105" : "bg-white hover:scale-105 hover:shadow-md"}`}
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                selectedCategoryId === cat._id ? "border-[#D6336C]" : "border-gray-300"
              }`}
            >
              <img
                src={`http://localhost:5000/Admin/CategoryImages/${cat.categoryImage}`}
                alt={cat.categoryName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs mt-2 text-gray-700 font-semibold w-full">{cat.categoryName}</p>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between text-left cursor-pointer
                       hover:shadow-xl hover:scale-105 transition transform duration-200 ease-in-out"
          >
            {/* Product Image */}
            <img
              src={`http://localhost:5000/Admin/ProductImages/${product.imageId}/${product.productImage1}`}
              alt={product.productName}
              className="w-32 h-32 object-contain mb-4 self-center"
            />

            {/* Product Details (left-aligned) */}
            <div className="flex-grow">
              <h2 className="text-lg font-bold text-[#D6336C] mb-1">{product.productName}</h2>
              <p className="text-sm text-gray-500 mb-1">{product.brandName}</p>
              <p className="text-pink-500 font-semibold mb-3">₹{product.price}</p>
            </div>

            {/* Add to Cart Button */}
            <div className="w-full flex justify-end">
              <button
                // Crucial: Use e.stopPropagation() to prevent the parent product div's onClick from firing
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                className="bg-pink-400 text-white w-10 h-10 rounded-md text-xl hover:bg-pink-500 transition"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SanitaryShop;