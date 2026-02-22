import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiTrendingUp, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import api from '../Utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { format, parseISO, addDays, isSameDay } from 'date-fns';

const PregnancyPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`${process.env.REACT_APP_API_URL}/api/track/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching pregnancy data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-white">No data available.</div>;

  const { prediction, currentPhase, avgCycleLength } = data;
  const fertileStartDate = parseISO(prediction.fertileWindow.start);
  const ovulationDate = parseISO(prediction.phases.ovulation.start);
  // Calculate the difference in days between today and ovulation
  const today = new Date();
  const daysUntilOvulation = Math.ceil((ovulationDate - today) / (1000 * 60 * 60 * 24));

  // A woman is fertile 5 days before ovulation + the day of ovulation itself
  const isFertile = daysUntilOvulation >= 0 && daysUntilOvulation <= 5;
  /*  
    highFertile = sunDays(format(prediction.phases.ovulation.start, 5)'yyyy-MM-dd')
  */

  const fertileDates = Array.from({ length: 6 }, (_, i) => addDays(fertileStartDate, i));

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      <MainHeader />

      <main className="flex-grow pt-32 pb-12 px-4 max-w-5xl mx-auto w-full">
        
        <header className="mb-10 text-left md:text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Pregnancy Insights</h1>
          <p className="text-gray-500 mt-2 font-medium">Personalized conception guide for your current cycle.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            {/* Fertile Window Row */}
            <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 order-1">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-gray-800 font-bold text-sm flex items-center gap-2">
                  <FiCalendar className="text-pink-500" /> Your Fertile Window
                </h3>
                <span className="text-[10px] bg-pink-50 text-pink-600 px-2 py-1 rounded-lg font-bold">6 DAYS TOTAL</span>
              </div>
              
              <div className="flex justify-between items-center gap-1 md:gap-4 px-1">
                {fertileDates.map((date, index) => {
                  const isOvulation = isSameDay(date, ovulationDate);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">
                        {format(date, 'EEE')}
                      </span>
                      <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-xs md:text-base transition-all
                        ${isOvulation 
                          ? 'bg-pink-500 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                        {format(date, 'd')}
                      </div>
                      {isOvulation && <div className="w-1 h-1 bg-pink-500 rounded-full mt-1"></div>}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Conception Odds Graph */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 order-2">
              <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500" /> Conception Probability Curve
              </h3>
              <div className="h-32 w-full bg-slate-50 rounded-2xl flex items-end justify-between px-4 pb-2 gap-1 overflow-hidden">
                {[30, 45, 70, 85, 95, 20, 5, 0].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={`w-full rounded-t-lg ${h > 90 ? 'bg-pink-400' : 'bg-indigo-200'}`}
                  ></motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">
                <span>Phase Start</span>
                <span className="text-pink-500">Ovulation Peak</span>
                <span>Phase End</span>
              </div>
            </div>

            {/* Current Status Card (Mobile Only) */}
            <div className="lg:hidden order-3 mt-2">
               <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                     <h3 className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">Current Status</h3>
                     <div className="text-3xl font-black mb-1">{isFertile ? 'HIGH' : 'LOW'}</div>
                     <p className="text-indigo-200 text-[10px]">
                       Chances of conceiving today based on your <span className="text-white font-bold">{currentPhase}</span> phase.
                     </p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-white/10 text-6xl font-black italic">!</div>
               </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 order-4 mt-4 lg:mt-0">
              <div className="bg-pink-50 p-4 md:p-5 rounded-2xl border border-pink-100">
                <h4 className="text-pink-700 font-bold text-[13px] md:text-sm mb-2">Getting Pregnant</h4>
                <p className="text-[11px] md:text-xs text-pink-600 leading-relaxed font-medium">
                  Sex during the 3 days leading up to and including ovulation offers the highest chance of conception.
                </p>
              </div>
              <div className="bg-blue-50 p-4 md:p-5 rounded-2xl border border-blue-100">
                <h4 className="text-blue-700 font-bold text-[13px] md:text-sm mb-2">Avoiding Pregnancy</h4>
                <p className="text-[11px] md:text-xs text-blue-600 leading-relaxed font-medium">
                  If you aren't planning to conceive, use protection especially during the fertile window marked above.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Desktop Only) */}
          <div className="space-y-6 hidden lg:block">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2 text-left">Current Status</h3>
                  <div className="text-4xl font-black mb-1 text-left">{isFertile ? 'HIGH' : 'LOW'}</div>
                  <p className="text-indigo-200 text-xs text-left">
                    Chances of conceiving today based on your <span className="text-white font-bold">{currentPhase}</span> phase.
                  </p>
               </div>
               <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl font-black italic">!</div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-bold text-sm mb-4 text-left italic">Fertility Signals</h3>
              <div className="space-y-3">
                {['Egg-white Mucus', 'Increased Libido', 'Breast Tenderness'].map((sign, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FiCheckCircle className="text-pink-500" />
                    <span className="text-xs font-medium text-gray-600 italic">{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/pregencymode')}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-bold text-sm transition-all shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Switch to Pregnancy Mode
            </button>
          </div>

          {/* Mobile Signals & Button */}
          <div className="lg:hidden space-y-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-bold text-sm mb-4 text-left italic">Fertility Signals</h3>
              <div className="space-y-3">
                {['Egg-white Mucus', 'Increased Libido', 'Breast Tenderness'].map((sign, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FiCheckCircle className="text-pink-500" />
                    <span className="text-xs font-medium text-gray-600 italic">{sign}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => navigate('/pregencymode')}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-bold text-sm transition-all shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Switch to Pregnancy Mode
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-2 p-4 bg-gray-100 rounded-2xl mt-8 clear-both relative z-0">
          <FiInfo className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gray-500 leading-normal">
            These dates are estimates based on your {avgCycleLength} day cycle. Factors like stress or illness can shift your ovulation day. For accuracy, consider using LH test strips.
          </p>
        </div>   
      </main>

      <Footer />
    </div>
  );
};

export default PregnancyPage;