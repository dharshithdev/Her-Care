import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiShoppingBag, FiCalendar, FiChevronRight, FiLogOut } from 'react-icons/fi';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import axios from 'axios';

const Account = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                // In a real app, use Promise.all for faster loading 
                const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, config);
                setUser(userRes.data);
                
                const orderRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/my-orders`, config);
                setOrders(orderRes.data);

                const appointRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/my-appointments`, config);
                setAppointments(appointRes.data);
            } catch (err) {
                console.error("Error fetching account data", err.message);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans">
            <MainHeader />
            
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">My Account<span className="text-rose-500">.</span></h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Sidebar: Profile Info & Security */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 text-3xl font-bold">
                                    {user?.name?.charAt(0) || <FiUser />}
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{user?.name || "Loading..."}</h2>
                                <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-500 transition-all"
                                >
                                    <FiLogOut /> Log Out
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <FiLock className="text-rose-500" /> Security
                                </h3>
                                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm flex justify-between items-center group">
                                    Change Password <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Main Content: Orders & Appointments */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Appointments Section */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <FiCalendar className="text-indigo-500" /> Upcoming Appointments
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {appointments.length > 0 ? appointments.map(app => (
                                        <div key={app._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-900">{app.serviceName}</p>
                                                <p className="text-sm text-slate-500">{new Date(app.date).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">Confirmed</span>
                                        </div>
                                    )) : (
                                        <p className="text-slate-400 italic">No upcoming appointments.</p>
                                    )}
                                </div>
                            </section>

                            {/* Orders Section */}
                            <section>
                                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <FiShoppingBag className="text-rose-500" /> Recent Orders
                                </h3>
                                <div className="space-y-4">
                                    {orders.length > 0 ? orders.map(order => (
                                        <div key={order._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-900">Order #{order._id.slice(-6)}</p>
                                                <p className="text-sm text-slate-500">{order.items.length} Items • ${order.totalPrice}</p>
                                            </div>
                                            <span className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase">Delivered</span>
                                        </div>
                                    )) : (
                                        <p className="text-slate-400 italic">No orders yet.</p>
                                    )}
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Account;