import React, { useState, useEffect } from 'react';
import api from '../Utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
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

    const subtotal = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = Math.round(subtotal + shipping);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-rose-500">Checking your bag...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <MainHeader />
            
            <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold mb-8 transition-colors">
                    <FiArrowLeft /> Back to Shop
                </button>

                <h1 className="text-4xl font-black text-slate-900 mb-10">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* ITEMS LIST */}
                    <div className="lg:col-span-7 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <motion.div 
                                    layout
                                    key={item.productId._id}
                                    className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-100"
                                >
                                    <img src={item.productId.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800">{item.productId.name}</h3>
                                        <p className="text-rose-500 font-black">₹{item.productId.price} <span className="text-slate-400 text-xs font-medium">x {item.quantity}</span></p>
                                    </div>
                                    <div className="font-black text-slate-900 pr-2">
                                        ₹{item.productId.price * item.quantity}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <FiShoppingBag className="mx-auto text-4xl text-slate-300 mb-4" />
                                <p className="text-slate-400 font-bold">Your cart is empty.</p>
                            </div>
                        )}
                    </div>

                    {/* SUMMARY SIDEBAR */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl sticky top-32">
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
                                <div className="flex justify-between text-2xl font-black">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <button
                                disabled={cartItems.length === 0 || isPlacing}
                                onClick={handlePlaceOrder}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                                    isPlacing || cartItems.length === 0
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-900/20'
                                }`}
                            >
                                {isPlacing ? "Processing..." : "Place Order Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            <AnimatePresence>
                {orderSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-12 rounded-[4rem] text-center max-w-sm"
                        >
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                <FiCheck />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Success!</h2>
                            <p className="text-slate-500 font-medium">Your wellness essentials are on the way. Thank you!...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CartPage;