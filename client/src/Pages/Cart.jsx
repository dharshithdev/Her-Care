import React, { useState, useEffect } from 'react';
import api from '../Utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { FiArrowLeft, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`${process.env.REACT_APP_API_URL}/api/shop/cart`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data.items || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    // --- MATH FIX START ---
    // Calculate raw numbers first
    const subtotalNum = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
    const shippingNum = subtotalNum > 0 ? 50 : 0;
    const totalNum = subtotalNum + shippingNum;

    // Convert to fixed strings for display to prevent decimal glitches
    const subtotal = subtotalNum.toFixed(2);
    const shipping = shippingNum.toFixed(2);
    const total = totalNum.toFixed(2);
    // --- MATH FIX END ---

    const handlePlaceOrder = async () => {
        setIsPlacing(true);
        try {
            const token = localStorage.getItem('token');
            await api.post(`${process.env.REACT_APP_API_URL}/api/shop/place-order`, {}, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderSuccess(true);
            setTimeout(() => navigate('/shop'), 3000);
        } catch (err) {
            alert("Ordering failed. Please try again.");
            setIsPlacing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-bold text-rose-500 bg-white">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                Checking your bag...
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <MainHeader />
            
            {/* Main content container with flex-grow to push footer down */}
            <main className="flex-1 max-w-6xl mx-auto w-full pt-28 sm:pt-32 px-4 sm:px-6 pb-20">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold mb-6 transition-colors group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Shop
                </button>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* ITEMS LIST */}
                    <div className="lg:col-span-7 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <motion.div 
                                    layout
                                    key={item.productId._id}
                                    className="bg-white p-4 rounded-2xl sm:rounded-3xl flex items-center gap-4 shadow-sm border border-slate-100"
                                >
                                    <img 
                                        src={item.productId.image || 'https://via.placeholder.com/150'} 
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover" 
                                        alt={item.productId.name} 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 truncate text-sm sm:text-base">{item.productId.name}</h3>
                                        <p className="text-rose-500 font-black text-sm">
                                            ₹{item.productId.price} 
                                            <span className="text-slate-400 text-xs font-medium ml-2">x {item.quantity}</span>
                                        </p>
                                    </div>
                                    <div className="font-black text-slate-900 pr-2 text-sm sm:text-base">
                                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-200">
                                <FiShoppingBag className="mx-auto text-4xl text-slate-300 mb-4" />
                                <p className="text-slate-400 font-bold">Your cart is empty.</p>
                                <button 
                                    onClick={() => navigate('/shop')}
                                    className="mt-4 text-rose-500 font-bold hover:underline"
                                >
                                    Browse Products
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SUMMARY SIDEBAR */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-xl lg:sticky lg:top-32">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between opacity-70">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between opacity-70">
                                    <span>Shipping</span>
                                    <span>₹{shipping}</span>
                                </div>
                                <div className="h-[1px] bg-white/10 my-4" />
                                <div className="flex justify-between text-xl sm:text-2xl font-black">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <button
                                disabled={cartItems.length === 0 || isPlacing}
                                onClick={handlePlaceOrder}
                                className={`w-full py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                                    isPlacing || cartItems.length === 0
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-900/20 active:scale-95'
                                }`}
                            >
                                {isPlacing ? "Processing..." : "Place Order Now!"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* SUCCESS MODAL */}
            <AnimatePresence>
                {orderSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] text-center max-w-sm"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                <FiCheck />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Success!</h2>
                            <p className="text-slate-500 font-medium">Your wellness essentials are on the way. Thank you!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CartPage;