import React from 'react';
import { Calendar, Lightbulb, Activity, ShoppingCart } from 'lucide-react';
import thinkingGirl from "../Assets/thinkingGirl.png";
import cupGirl from "../Assets/cupGirl.png";
import Header from '../Components/Header';

const Index = () => {
    return (
        <div className="relative bg-[#FFE4EC] scroll-smooth">
            <Header />

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-[#FFC1CC] to-[#FFF0F5] relative overflow-hidden">
                <div className="container mx-auto px-12 flex items-center z-10">
                    <div className="w-1/2">
                        <h1 className="text-6xl font-extrabold text-[#D6336C] tracking-wide drop-shadow-md">Her-Care</h1>
                        <p className="mb-10 text-2xl leading-snug font-medium text-[#4B2C2C]">
                            Track your cycle,<br /> take control of your health.
                        </p>
                        <a href="#services">
                            <button className="bg-gradient-to-r from-[#FFB6B9] to-[#FF9AA2] hover:scale-105 hover:shadow-lg transition-all duration-300 text-black px-10 py-4 rounded-full text-xl font-semibold">
                                Start tracking
                            </button>
                        </a>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        <img
                            src={thinkingGirl}
                            alt="Thinking Girl"
                            className="h-[600px] object-contain"
                            style={{ transform: 'scale(1.1)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-[#FFE4EC] py-24 px-16 min-h-screen">
                <div className="mb-16 text-center">
                    <h2 className="text-5xl font-bold mb-6 text-[#4B2C2C]">
                        Our <span className="text-[#E57373]">Services</span>
                    </h2>
                    <p className="text-xl text-[#4B2C2C]">
                        Personalized care designed to support your health and well-being.
                    </p>
                </div>
                
                <div className="flex justify-center flex-wrap gap-10 mt-12">
                    {[ 
                        { icon: <Calendar className="h-16 w-16" />, label: 'Periods tracker' },
                        { icon: <Lightbulb className="h-16 w-16" />, label: 'Healthy tips' },
                        { icon: <Activity className="h-16 w-16" />, label: 'Consultation' },
                        { icon: <ShoppingCart className="h-16 w-16" />, label: 'Products' }
                    ].map(({ icon, label }, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform duration-300 w-60"
                        >
                            <div className="text-[#E57373] mb-4">{icon}</div>
                            <p className="text-lg font-medium text-[#4B2C2C]">{label}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* About Section */}
            <section id="about" className="bg-[#FFD1DC] py-32 px-16">
                <div className="flex items-center justify-between flex-wrap gap-10">
                    <div className="max-w-xl">
                        <h2 className="text-5xl font-bold mb-6 text-[#4B2C2C]">About Us</h2>
                        <p className="text-xl text-[#4B2C2C] mb-8 leading-relaxed">
                            Her-Care is a personalized platform designed to support you every step of the way.
                        </p>
                        <p className="text-xl text-[#4B2C2C] leading-relaxed">
                            We aim to make self-care easier, more personal, and truly empowering—because your health deserves real care.
                        </p>
                    </div>
                    <img
                        src={cupGirl}
                        alt="Happy Girl"
                        className="h-[500px] object-contain rounded-3xl shadow-2xl border-4 border-pink-300"
                    />
                </div>
            </section>
        </div>
    );
};

export default Index;
