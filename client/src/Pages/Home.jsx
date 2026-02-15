import React from 'react';
import { useNavigate } from 'react-router-dom';
// Using FiZap for "Tips" and FiUser for "Consultation" based on your available exports
import { FiCalendar, FiZap, FiUser, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import thinkingGirl from "../Assets/thinkingGirl.png";
import cupGirl from "../Assets/cupGirl.png";
import Header from '../Components/Header';
import Footer from "../Components/Footer";

const Index = () => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-[#F8FAFC] scroll-smooth font-sans text-slate-800">
            <Header />

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] -ml-24 -mb-24 opacity-60" />

                <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center z-10 pt-20">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <span className="inline-block py-2 px-4 rounded-full bg-rose-50 text-rose-500 font-bold text-xs uppercase tracking-widest mb-6">
                            Smart Wellness for Women
                        </span>
                        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                            Her-Care<span className="text-rose-500">.</span>
                        </h1>
                        <p className="mb-10 text-xl lg:text-2xl leading-relaxed font-medium text-slate-500 max-w-lg">
                            Track your cycle, sync with your body, and take control of your daily health journey.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button 
                                onClick={() => navigate('/explore')}
                                className="bg-slate-900 hover:bg-rose-500 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl shadow-slate-200 flex items-center gap-3 group"
                            >
                                Start tracking <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 flex justify-center lg:justify-end mt-16 lg:mt-0 relative">
                        <img
                            src={thinkingGirl}
                            alt="Thinking Girl"
                            className="h-[500px] lg:h-[650px] object-contain relative z-0 drop-shadow-2xl"
                            style={{ transform: 'scale(1.05)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-[#F8FAFC] py-32 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 text-slate-900 tracking-tight">
                            Personalized <span className="text-rose-500">Services</span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[ 
                            { icon: <FiCalendar />, label: 'Period Tracker', color: 'bg-rose-50 text-rose-500' },
                            { icon: <FiZap />, label: 'Health Tips', color: 'bg-amber-50 text-amber-500' },
                            { icon: <FiUser />, label: 'Consultation', color: 'bg-indigo-50 text-indigo-500' },
                            { icon: <FiShoppingCart />, label: 'Essentials Shop', color: 'bg-emerald-50 text-emerald-500' }
                        ].map(({ icon, label, color }, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 group cursor-default"
                            >
                                <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    {icon}
                                </div>
                                <p className="text-xl font-black text-slate-800 mb-2">{label}</p>
                                <p className="text-slate-400 text-sm font-medium">Empowering data to help you live better every day.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-slate-900 py-32 px-6 lg:px-16 rounded-[4rem] mx-4 lg:mx-8 mb-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -ml-48 -mt-48" />
                
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                    <div className="lg:w-1/2 text-white">
                        <span className="text-rose-400 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Our Mission</span>
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tight">Your health deserves <span className="text-rose-500">real care.</span></h2>
                        <p className="text-lg lg:text-xl text-slate-400 mb-8 leading-relaxed font-medium">
                            Her-Care is more than an app; it's a personalized platform designed to support you every step of the way.
                        </p>
                    </div>
                    
                    <div className="lg:w-5/12">
                        <img
                            src={cupGirl}
                            alt="Happy Girl"
                            className="relative z-10 w-full object-contain rounded-[3rem] shadow-2xl border-8 border-white/5"
                        />
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Index;