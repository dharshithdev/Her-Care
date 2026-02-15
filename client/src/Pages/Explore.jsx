import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiShoppingBag, FiCpu, FiArrowRight } from "react-icons/fi";
// Keep your image imports
import calander from "../Assets/calander.png";
import doctor from "../Assets/doctor.png";
import luna from "../Assets/luna.png";
import shopping from "../Assets/shopping.png";
import MainHeader from "../Components/MainHeader";

const Explore = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const services = [
    {
      title: "Track Cycle",
      desc: "Monitor your rhythm and health phases.",
      path: "/track",
      img: calander,
      color: "rose",
      icon: <FiCalendar />
    },
    {
      title: "Consultation",
      desc: "Connect with specialized health experts.",
      path: "/appointments",
      img: doctor,
      color: "indigo",
      icon: <FiUser />
    },
    {
      title: "Wellness Shop",
      desc: "Curated products for your wellbeing.",
      path: "/shop",
      img: shopping,
      color: "rose",
      icon: <FiShoppingBag />
    },
    {
      title: "Luna AI",
      desc: "Your 24/7 intelligent health companion.",
      path: "/luna", // Assuming path
      img: luna,
      color: "slate",
      icon: <FiCpu />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <MainHeader />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Welcome back.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Where would you like to start your wellness journey today?
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(service.path)}
              className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-100 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center text-center"
            >
              {/* Subtle Background Glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-${service.color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Image Container */}
              <div className="relative z-10 w-40 h-40 mb-8 bg-slate-50 rounded-[2rem] flex items-center justify-center p-6 group-hover:scale-110 transition-transform duration-500">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Text Content */}
              <div className="relative z-10 flex-1">
                <div className={`inline-flex items-center justify-center p-2 rounded-lg bg-${service.color}-50 text-${service.color}-500 mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                  {service.desc}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="relative z-10 w-full pt-4 border-t border-slate-50 flex items-center justify-center text-rose-500 font-bold text-xs uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                Explore <FiArrowRight className="ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner (Optional Magic Touch) */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="relative z-10 max-w-lg text-center lg:text-left">
            <h2 className="text-3xl font-black mb-4 tracking-tight">Your health data is safe.</h2>
            <p className="text-slate-400 font-medium">
              We use medical-grade encryption to ensure your personal journey stays private and secure.
            </p>
          </div>
          <button className="relative z-10 bg-rose-500 hover:bg-rose-600 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-lg shadow-rose-900/20 active:scale-95">
            View Privacy Report
          </button>
          
          {/* Abstract Glows for the dark card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        </div>
      </main>
    </div>
  );
};

export default Explore;