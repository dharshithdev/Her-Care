import React from 'react';
import { Calendar, Lightbulb, Activity, ShoppingCart } from 'lucide-react';
import thinkingGirl from "../Assets/thinkingGirl.png";
import cupGirl from "../Assets/cupGirl.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FFDEE2]">

      {/* Hero Section */}
      <section className="h-screen px-16 py-24 flex relative">
        <div className="w-1/2 pt-20">
          <h1 className="text-6xl font-bold mb-4">HER-CARE</h1>
          <p className="mb-8 text-2xl leading-snug">
            Track your cycle,<br />
            take control of your health
          </p>
          <button className="bg-[#E5B0B0] text-black px-8 py-3 rounded-full text-lg">
            Start tracking
          </button>
        </div>
        <div className="absolute right-0 top-0 w-2/3 h-full overflow-hidden">
          <div className="absolute -right-32 top-0 w-full h-full bg-[#F8C4C4] rounded-bl-[300px]">
            <div className="absolute top-20 right-40">
              <span className="text-6xl">?</span>
            </div>
            <img 
              src={thinkingGirl} 
              alt="Woman thinking" 
              className="absolute bottom-0 right-40 h-[95%] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="h-screen px-8 py-24 bg-[#FFDEE2] flex flex-col items-center justify-center text-center">
        <div className="mb-12">
          <div className="text-sm font-bold mb-6 text-lg">HER-CARE</div>
          <h2 className="text-4xl font-medium mb-4">
            We offer a wide range<br />
            of <span className="text-[#E5A0A0]">services</span>
          </h2>
          <p className="text-lg max-w-2xl mb-16">
            Explore our range of personalized services designed<br />
            to support your health and well-being
          </p>
        </div>

        <div className="flex space-x-10">
          {[
            { icon: <Calendar className="h-14 w-14 text-black" />, label: 'Periods tracker' },
            { icon: <Lightbulb className="h-14 w-14 text-black" />, label: 'Healthy tips' },
            { icon: <Activity className="h-14 w-14 text-black" />, label: 'Consultation' },
            { icon: <ShoppingCart className="h-14 w-14 text-black" />, label: 'Products' }
          ].map(({ icon, label }, index) => (
            <div className="text-center" key={index}>
              <div className="w-32 h-32 bg-[#E5A0A0] rounded-lg flex items-center justify-center mb-4">
                {icon}
              </div>
              <p className="text-lg font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="h-screen px-8 py-24 relative bg-[#FFDEE2] flex items-center">
        <div className="relative z-10 max-w-xl">
          <div className="text-sm font-bold mb-6 text-lg">HER-CARE</div>
          <h2 className="text-4xl font-bold mb-10">ABOUT US</h2>

          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">Why people choose us?</h3>
            <p className="text-lg">
              Her-Care is a personalized platform designed to support you<br />
              every step of the way!
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Our goals</h3>
            <p className="text-lg">
              To make self-care easier, more personal and truly<br />
              empowering because your health deserves real care.
            </p>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-2/3 h-full overflow-hidden">
          <div className="absolute -right-32 bottom-0 w-full h-full bg-[#F8C4C4] rounded-tl-[300px]">
            <div className="absolute right-48 top-20 transform -scale-x-100">
              <svg width="200" height="200" viewBox="0 0 120 120" className="opacity-50">
                <path d="M60,10 Q90,40 90,80 Q60,110 30,80 Q10,40 60,10" fill="#FFC0CB" />
                <path d="M70,20 Q95,50 85,90 Q55,110 35,70 Q25,30 70,20" fill="#FFAAAA" />
                <path d="M65,15 Q100,45 90,85 Q60,105 40,75 Q20,35 65,15" fill="#FF9999" />
              </svg>
            </div>
            <img 
              src={cupGirl} 
              alt="Woman happy" 
              className="absolute top-10 right-28 h-[90%] object-contain transform -scale-x-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
