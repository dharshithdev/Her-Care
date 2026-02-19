import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [activeCategoryId, setActiveCategoryId] = useState("All"); // Now tracking by ID
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [prodRes, catRes, cartRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/shop/products', config),
                    axios.get('http://localhost:5000/api/shop/categories', config),
                    axios.get('http://localhost:5000/api/shop/cart', config)
                ]);

                setProducts(prodRes.data.product || []);
                // Add an ID of "All" to the first category
                setCategories([{ _id: "All", name: "All", icon: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" }, ...(catRes.data.category || [])]);
                
                const cartObj = {};
                cartRes.data.items?.forEach(item => {
                    cartObj[item.productId._id || item.productId] = item.quantity;
                });
                setCart(cartObj);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateQuantity = async (productId, action) => {
        setCart(prev => {
            const newQty = (prev[productId] || 0) + (action === 'add' ? 1 : -1);
            if (newQty <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQty };
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/shop/cart/update', 
                { productId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) { console.error("Sync Error", err); }
    };

    // FILTER LOGIC: Now comparing IDs
    const filteredProducts = products.filter(p => 
        activeCategoryId === "All" ? true : p.categoryId === activeCategoryId
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white italic font-black text-rose-500">
            LOADING WELLNESS...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <MainHeader />
            
            <div className="max-w-[1500px] mx-auto pt-32 px-6 pb-24">
                
                {/* STORY-STYLE CATEGORIES */}
                <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveCategoryId(cat._id)}
                            className="flex flex-col items-center gap-4 group min-w-[90px]"
                        >
                            <div className={`w-20 h-20 rounded-full p-1 border-2 transition-all duration-300 ${
                                activeCategoryId === cat._id ? 'border-rose-500 scale-110 shadow-xl' : 'border-slate-100 group-hover:border-rose-200'
                            }`}>
                                <img src={cat.icon} alt={cat.name} className="w-full h-full rounded-full object-cover bg-white" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                activeCategoryId === cat._id ? 'text-rose-500' : 'text-slate-400'
                            }`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product._id}
                                className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-50 flex flex-col hover:shadow-2xl transition-all group"
                            >
                                <div className="h-52 rounded-[2rem] overflow-hidden mb-5 bg-slate-50">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-1">{product.name}</h3>
                                <p className="text-rose-500 font-black text-xl mb-6">₹{product.price}</p>

                                <div className="mt-auto flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-100">
                                    <button 
                                        onClick={() => updateQuantity(product._id, 'remove')}
                                        className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="font-black text-slate-900">{cart[product._id] || 0}</span>
                                    <button 
                                        onClick={() => updateQuantity(product._id, 'add')}
                                        className="w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg hover:bg-rose-500 transition-colors"
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* FLOATING CART SUMMARY */}
            <AnimatePresence>
                {Object.keys(cart).length > 0 && (
                    <motion.div 
                        initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 bg-slate-900 text-white px-10 py-5 rounded-full shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center gap-8 z-50 min-w-[320px] justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <FiShoppingBag className="text-rose-400 text-xl" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[10px] uppercase font-black opacity-50">Items in Bag</span>
                                <span className="font-bold">{Object.values(cart).reduce((a, b) => a + b, 0)} Products</span>
                            </div>
                        </div>
                        <button className="bg-rose-500 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-rose-400 shadow-lg shadow-rose-900/20">
                            Checkout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default ProductsPage;