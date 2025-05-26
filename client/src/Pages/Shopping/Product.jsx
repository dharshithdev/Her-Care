// src/pages/Product.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import MainHeader from "../../Components/ShopHeader";
import RelatedProducts from "../../Components/Related"; // <--- Import the new component

const Product = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  const location = useLocation();
  const { productId: idFromParams } = useParams();

  const productId = location.state?.productId || idFromParams;

  useEffect(() => {
    if (!productId) {
      setError("Product ID not found.");
      setLoading(false);
      return;
    }

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/sanitory/product-detail?id=${productId}`);
        setProduct(res.data);
        if (res.data.productImage1) {
          setMainImage(res.data.productImage1);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details. " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleThumbnailClick = (imageName) => {
    setMainImage(imageName);
  };

  const handleAddToCart = async () => {
    let userId = null;
    try {
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
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (!product || !product._id) {
      setToastMessage("Product data not loaded yet.");
      setToastType("error");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/sanitory/add-cart", {
        productId: product._id,
        userId: userId,
      });

      if (res.data.status) {
        setToastMessage("Product added to cart!");
        setToastType("success");
      } else {
        setToastMessage("Failed to add product to cart.");
        setToastType("error");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.response?.data?.message || "Error adding to cart. Please try again.";
      setToastMessage(errorMessage);
      setToastType("error");
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-40 px-6 pb-20 flex justify-center items-center">Loading ...</div>;
  }

  if (error) {
    return <div className="min-h-screen pt-40 px-6 pb-20 flex justify-center items-center text-red-600">Error: {error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen pt-40 px-6 pb-20 flex justify-center items-center">Product not found.</div>;
  }

  const productImages = [
    product.productImage1,
    product.productImage2,
    product.productImage3
  ].filter(Boolean);

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

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[#D6336C] mb-4">{product.productName}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Main Product Image and Thumbnails */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="w-full max-w-lg h-[450px] bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden mb-4">
              {mainImage ? (
                <img
                  src={`http://localhost:5000/Admin/ProductImages/${product.imageId}/${mainImage}`}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">No Image Available</div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                {productImages.map((imgName, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 overflow-hidden rounded-lg cursor-pointer border-2
                                ${mainImage === imgName ? 'border-pink-500 shadow-md' : 'border-gray-300 hover:border-pink-300'}`}
                    onClick={() => handleThumbnailClick(imgName)}
                  >
                    <img
                      src={`http://localhost:5000/Admin/ProductImages/${product.imageId}/${imgName}`}
                      alt={`${product.productName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-6">
            <p className="text-xl text-gray-700 mb-2">Brand: {product.brandName}</p>
            <p className="text-2xl text-pink-600 font-semibold mb-4">₹{product.price}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-gray-500 mb-2">Size: {product.size}</p>
            <button
              onClick={handleAddToCart}
              className="bg-pink-500 text-white px-6 py-3 rounded-md text-lg hover:bg-pink-600 transition mt-4"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* --- NEW: Related Products Section --- */}
        {/* Only render if product is loaded and has a category ID */}
        {product.categoryId && (
          <RelatedProducts
            currentCategoryId={product.categoryId}
            currentProductId={product._id}
          />
        )}
        {/* --- END NEW --- */}
      </div>
    </div>
  );
};

export default Product;