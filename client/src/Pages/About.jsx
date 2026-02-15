import React from 'react';
import { FiHeart, FiShield, FiGlobe, FiTarget, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import cupGirl from "../Assets/cupGirl.png";
import thinkingGirl from "../Assets/thinkingGirl.png"; // Using this for variety
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const AboutUs = () => {
  const values = [
    {
      icon: <FiHeart className="text-rose-500" />,
      title: "Empathy First",
      desc: "We build for real experiences, understanding that every cycle and every body is unique."
    },
    {
      icon: <FiShield className="text-indigo-500" />,
      title: "Privacy by Design",
      desc: "Your health data is sacred. We use medical-grade encryption to keep your journey private."
    },
    {
      icon: <FiGlobe className="text-emerald-500" />,
      title: "Inclusion",
      desc: "Wellness is for everyone. Our platform is designed to be accessible and supportive for all."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-x-hidden">
      <Header />

      {/* 1. HERO SECTION: The Narrative */}
      <section className="pt-40 pb-24 px-6 lg:px-16 bg-white relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-50/50 -skew-x-12 transform origin-top translate-x-20 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-500 text-xs font-bold uppercase tracking-widest mb-6">
                <FiCheckCircle /> Our Narrative
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                Health with <br />
                <span className="text-rose-500">Intention.</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-10 max-w-lg">
                Her-Care was born from a simple realization: women’s health technology shouldn't just be a calendar—it should be a companion that understands your rhythm.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200" />
                    ))}
                </div>
                <p className="text-sm font-bold text-slate-400">Trusted by <span className="text-slate-900">10k+ users</span> worldwide</p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-10 bg-gradient-to-tr from-rose-100 to-indigo-100 rounded-full blur-[80px] opacity-50" />
              <img 
                src={cupGirl} 
                alt="Visionary" 
                className="w-full relative z-10 rounded-[4rem] shadow-2xl border-[12px] border-white transform hover:rotate-2 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE NEW MISSION: Modern & Light */}
      <section className="py-20 px-6 lg:px-16 relative">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-indigo-200">
            {/* Soft decorative glows instead of pure black */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white text-3xl mb-10 border border-white/10">
                    <FiTarget />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-8 tracking-tight max-w-3xl">
                    "To empower every individual to navigate their health with <span className="text-rose-400 font-serif italic">confidence, dignity,</span> and total ease."
                </h2>
                <div className="h-1 w-24 bg-rose-500 rounded-full" />
                <p className="mt-8 text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Our North Star</p>
            </div>
        </div>
      </section>

      {/* 3. VALUES: The Foundation */}
      <section className="py-32 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Core <span className="text-rose-500 text-6xl">.</span></h2>
                <p className="text-slate-500 font-medium max-w-md">The non-negotiable principles that guide every single line of code we write.</p>
            </div>
            <button className="text-rose-500 font-black flex items-center gap-2 hover:gap-4 transition-all">
                Read our transparency report <FiArrowRight />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="group bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-rose-100 transition-all duration-500 hover:-translate-y-2">
                <div className="text-4xl mb-8 bg-slate-50 w-20 h-20 rounded-[1.5rem] flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors duration-500">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE STATS: Trust & Community */}
      <section className="pb-32 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto bg-white rounded-[4rem] p-12 lg:p-20 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-sm">
            {/* Background Image of Thinking Girl used as a subtle texture */}
            <div className="absolute right-0 bottom-0 w-1/3 opacity-5 hidden lg:block">
                <img src={thinkingGirl} alt="" />
            </div>
           
          <div className="text-center lg:text-left relative z-10">
            <h2 className="text-4xl font-black mb-4 text-slate-900">Ready to sync?</h2>
            <p className="text-slate-500 text-lg font-medium max-w-sm">Join the community of women who have reclaimed their health data.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 items-center relative z-10">
            <div className="text-center">
              <p className="text-5xl font-black text-rose-500 tracking-tighter">98%</p>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-2">Prediction Accuracy</p>
            </div>
            <div className="hidden sm:block w-[1px] h-16 bg-slate-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">24/7</p>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-2">AI Expert Support</p>
            </div>
            <button className="bg-rose-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-slate-900 transition-all flex items-center gap-3 shadow-xl shadow-rose-200">
              Get Started Now <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
        <Footer />
    </div>
  );
};

export default AboutUs;