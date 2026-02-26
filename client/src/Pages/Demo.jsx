import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiTrendingUp, FiCheckCircle, FiCalendar, FiLoader, FiHeart, FiX } from 'react-icons/fi';
import api from '../Utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { format, parseISO, addDays, isSameDay } from 'date-fns';

const PregnancyPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State for Custom Modal
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatusAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        // Check if user is already pregnant
        const statusRes = await api.get(`${process.env.REACT_APP_API_URL}/api/track/pregency/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statusRes.data && statusRes.data.isPregnant) {
          navigate('/pregencymode');
          return;
        }

        const res = await api.get(`${process.env.REACT_APP_API_URL}/api/track/data`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    checkStatusAndFetchData();
  }, [navigate]);

  const handleConfirmSwitch = async () => {
    setIsSwitching(true);
    setShowConfirm(false);
    try {
      const token = localStorage.getItem('token');
      await api.post(`${process.env.REACT_APP_API_URL}/api/track/addpregnant`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('isPregnant', 'true');
      navigate('/track');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to switch.");
      setIsSwitching(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <FiLoader className="animate-spin text-pink-500" size={30} />
    </div>
  );
  
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-white">No data available.</div>;

  const { prediction, currentPhase, avgCycleLength } = data;
  const fertileStartDate = parseISO(prediction.fertileWindow.start);
  const ovulationDate = parseISO(prediction.phases.ovulation.start);
  const today = new Date();
  const daysUntilOvulation = Math.ceil((ovulationDate - today) / (1000 * 60 * 60 * 24));
  const isFertile = daysUntilOvulation >= 0 && daysUntilOvulation <= 5;
  const fertileDates = Array.from({ length: 6 }, (_, i) => addDays(fertileStartDate, i));

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col relative">
      <MainHeader />

      {/* CUSTOM CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                <FiHeart size={32} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Congratulations?</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Switching to Pregnancy Mode will pause your cycle predictions and begin tracking your baby's development milestones.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmSwitch}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors"
                >
                  Yes, Start Tracking
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Not yet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32 pb-12 px-4 max-w-5xl mx-auto w-full">
        <header className="mb-10 text-left md:text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Conception Insights</h1>
          <p className="text-gray-500 mt-2 font-medium">Personalized guide for your current {avgCycleLength}-day cycle.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fertile Window Row */}
            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-gray-800 font-bold text-sm flex items-center gap-2">
                  <FiCalendar className="text-pink-500" /> Your Fertile Window
                </h3>
                <span className="text-[10px] bg-pink-50 text-pink-600 px-3 py-1 rounded-lg font-bold">6 DAYS TOTAL</span>
              </div>
              
              <div className="flex justify-between items-center gap-1 md:gap-4 px-1">
                {fertileDates.map((date, index) => {
                  const isOvulation = isSameDay(date, ovulationDate);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">{format(date, 'EEE')}</span>
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-sm md:text-lg transition-all
                        ${isOvulation ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                        {format(date, 'd')}
                      </div>
                      {isOvulation && <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2"></div>}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Conception Odds Graph */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500" /> Conception Probability Curve
              </h3>
              <div className="h-32 w-full bg-slate-50 rounded-2xl flex items-end justify-between px-4 pb-2 gap-1 overflow-hidden">
                {[30, 45, 70, 85, 95, 20, 5, 0].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={`w-full rounded-t-lg ${h > 90 ? 'bg-pink-400' : 'bg-indigo-200'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">
                <span>Phase Start</span>
                <span className="text-pink-500">Ovulation Peak</span>
                <span>Phase End</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100">
                <h4 className="text-pink-700 font-bold text-sm mb-2">Getting Pregnant</h4>
                <p className="text-xs text-pink-600/80 leading-relaxed font-medium">
                  Sex during the 3 days leading up to ovulation offers the highest chance of conception.
                </p>
              </div>
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="text-blue-700 font-bold text-sm mb-2">Avoiding Pregnancy</h4>
                <p className="text-xs text-blue-600/80 leading-relaxed font-medium">
                  Use protection especially during the fertile window marked above to prevent pregnancy.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-2">Current Status</h3>
                  <div className="text-5xl font-black mb-1">{isFertile ? 'HIGH' : 'LOW'}</div>
                  <p className="text-indigo-200 text-xs">
                    Chances of conceiving today based on your <span className="text-white font-bold">{currentPhase}</span> phase.
                  </p>
               </div>
               <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl font-black italic">!</div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-bold text-sm mb-4 italic">Fertility Signals</h3>
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
              onClick={() => setShowConfirm(true)}
              disabled={isSwitching}
              className={`w-full text-white py-6 rounded-[2.5rem] font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2
                ${isSwitching ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:-translate-y-1 active:scale-95'}`}
            >
              {isSwitching ? <FiLoader className="animate-spin" /> : 'Switch to Pregnancy Mode'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 p-4 bg-gray-100 rounded-2xl mt-8">
          <FiInfo className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gray-500 leading-normal">
            Estimates based on your cycle data. Biological factors can shift ovulation. For accuracy, consider using LH test strips.
          </p>
        </div> 
      </main>
      <Footer />
    </div>
  );
};

export default PregnancyPage;