// src/Components/RelatedProducts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate to product details

const RelatedProducts = ({ currentCategoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentCategoryId) {
        setLoading(false);
        return; // No category to fetch related products for
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/sanitory/sanitory-products?categoryId=${currentCategoryId}`);

        // Filter out the current product and limit to a reasonable number (e.g., 5-10)
        const filteredProducts = res.data.filter(
          (p) => p._id !== currentProductId
        ).slice(0, 8); // Show up to 8 related products

        setRelatedProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentCategoryId, currentProductId]); // Re-fetch if category or current product ID changes

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { productId: productId } });
    // Important: Force a re-render/re-fetch of the Product page if navigating to a related product
    // by scrolling to top or ensuring Product.jsx useEffect is sensitive to productId changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading related products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (relatedProducts.length === 0) {
    return <div className="text-center text-gray-500">No related products found in this category.</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#D6336C] mb-6 text-center md:text-left">Related Products</h2>
      <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between text-left cursor-pointer
                       hover:shadow-xl hover:scale-105 transition transform duration-200 ease-in-out"
          >
            <img
              src={`http://localhost:5000/Admin/ProductImages/${product.imageId}/${product.productImage1}`}
              alt={product.productName}
              className="w-40 h-40 object-contain mb-4 self-center" // Slightly larger for individual display
            />
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-[#D6336C] mb-1">{product.productName}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.brandName}</p>
              <p className="text-pink-500 font-semibold">₹{product.price}</p>
            </div>
            {/* You might not need an Add to Cart button here, but if you do, include it */}
            {/* For simplicity, I'm omitting it here to avoid duplicating functionality/state in RelatedProducts */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;