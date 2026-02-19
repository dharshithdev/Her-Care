import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState({}); // { productId: quantity }
    const [activeCategoryId, setActiveCategoryId] = useState("All");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [prodRes, catRes, cartRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/shop/products`, config),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/shop/categories`, config),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/shop/cart`, config)
                ]);

                setProducts(prodRes.data.product || []);
                setCategories([
                    { _id: "All", name: "All", icon: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" }, 
                    ...(catRes.data.category || [])
                ]);
                
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
        // Optimistic UI update
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
            await axios.post(`${process.env.REACT_APP_API_URL}/api/shop/cart/update`, 
                { productId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) { console.error("Sync Error", err); }
    };

    const filteredProducts = products.filter(p => 
        activeCategoryId === "All" ? true : p.categoryId === activeCategoryId
    );

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full mb-4" 
            />
            <p className="text-rose-500 font-black tracking-widest text-xs uppercase italic">HerCare Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFF]">
            <MainHeader />
            
            <div className="max-w-[1500px] mx-auto pt-28 md:pt-36 px-4 md:px-6 pb-24">
                
                {/* CENTERED BUBBLE CATEGORIES */}
                <div className="flex justify-start md:justify-center overflow-x-auto pb-10 gap-6 md:gap-10 no-scrollbar px-4">
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveCategoryId(cat._id)}
                            className="flex flex-col items-center gap-3 group min-w-[70px] md:min-w-[90px] outline-none"
                        >
                            <motion.div 
                                whileTap={{ scale: 0.9 }}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-full p-1 border-2 transition-all duration-300 flex items-center justify-center ${
                                    activeCategoryId === cat._id 
                                    ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-100' 
                                    : 'border-slate-100 bg-white group-hover:border-rose-200'
                                }`}
                            >
                                <img 
                                    src={cat.icon} 
                                    alt={cat.name} 
                                    className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover" 
                                />
                            </motion.div>
                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                                activeCategoryId === cat._id ? 'text-rose-600' : 'text-slate-400 group-hover:text-slate-600'
                            }`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product._id}
                                className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-3 md:p-5 shadow-sm border border-slate-50 flex flex-col hover:shadow-xl transition-all group"
                            >
                                <div className="aspect-square rounded-[1.4rem] md:rounded-[2rem] overflow-hidden mb-3 md:mb-5 bg-slate-50">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                </div>
                                
                                <h3 className="font-bold text-slate-800 text-sm md:text-lg mb-0.5 md:mb-1 px-1 line-clamp-1 italic">
                                    {product.name}
                                </h3>
                                <p className="text-rose-500 font-black text-md md:text-xl mb-4 md:mb-6 px-1">
                                    ₹{product.price}
                                </p>

                                <div className="mt-auto flex items-center justify-between bg-slate-50 rounded-xl md:rounded-2xl p-1 md:p-2 border border-slate-100">
                                    <button 
                                        onClick={() => updateQuantity(product._id, 'remove')}
                                        className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-white rounded-lg md:rounded-xl shadow-sm text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <FiMinus size={14} />
                                    </button>
                                    <span className="font-black text-slate-900 text-xs md:text-base">
                                        {cart[product._id] || 0}
                                    </span>
                                    <button 
                                        onClick={() => updateQuantity(product._id, 'add')}
                                        className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-slate-900 text-white rounded-lg md:rounded-xl shadow-md hover:bg-rose-500 transition-colors"
                                    >
                                        <FiPlus size={14} />
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
                        initial={{ y: 100, x: '-50%' }} 
                        animate={{ y: 0, x: '-50%' }}
                        exit={{ y: 100, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 bg-slate-900 text-white px-6 md:px-10 py-4 md:py-5 rounded-3xl md:rounded-full shadow-2xl flex items-center gap-6 md:gap-8 z-50 w-[92%] md:w-auto justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FiShoppingBag className="text-rose-400 text-xl md:text-2xl" />
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-[9px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                                    {Object.values(cart).reduce((a, b) => a + b, 0)}
                                </span>
                            </div>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-[10px] uppercase font-black opacity-50 tracking-tighter">Wellness Bag</span>
                                <span className="font-bold text-sm">
                                    {Object.values(cart).reduce((a, b) => a + b, 0)} Items
                                </span>
                            </div>
                        </div>
                        
                        <div className="sm:hidden font-black text-xs uppercase tracking-widest text-rose-100">
                           {Object.values(cart).reduce((a, b) => a + b, 0)} Selected
                        </div>

                        {/* FIXED REDIRECT LOGIC BELOW */}
                        <button 
                            onClick={() => navigate('/cart')} 
                            className="bg-rose-500 px-6 md:px-8 py-2.5 md:py-3 rounded-2xl md:rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-rose-400 shadow-lg active:scale-95 transition-all"
                        >
                            Checkout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProductsPage;