import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiActivity, FiZap, FiCamera, FiInfo, FiCheckCircle, FiHeart } from 'react-icons/fi';
import { differenceInDays, format } from 'date-fns';
import MainHeader from '../Components/MainHeader';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/axiosConfig';
import Footer from '../Components/Footer';

const MyBaby = () => {
    const [pregData, setPregData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const navigate = useNavigate();

    const VIOLET_PRIMARY = "#7c3aed"; 
    const VIOLET_LIGHT = "#f5f3ff"; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get(`${process.env.REACT_APP_API_URL}/api/track/pregency/data`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPregData(res.data);
            } catch (err) {
                console.error("Error fetching pregnancy data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

      const handleSwitchMode = async () => {
    setIsSwitching(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Light')
      const res = await api.post(`${process.env.REACT_APP_API_URL}/api/track/removepregnant`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        localStorage.setItem('isPregnant', 'false');
        navigate('/track');
      }
    } catch (err) {
      console.error("Error switching to pregnancy mode", err);
      alert(err.response?.data?.message || "Failed to switch to pregnancy mode. Please try again.");
    } finally {
      setIsSwitching(false);
      setShowConfirmModal(false);
    }
  };

    if (loading || !pregData) {
        return <div className="min-h-screen flex items-center justify-center font-black text-violet-600 animate-pulse text-xl tracking-tighter">Syncing Baby's World...</div>;
    }

    const lmpDate = new Date(pregData.prediction.phases.menstrual.start);
    const dueDate = new Date(pregData.prediction.dueDate);
    const today = new Date();
    const currentDays = differenceInDays(today, lmpDate);
    const currentWeek = Math.floor(currentDays / 7) + 1;

    // --- Dynamic Milestone Logic ---
    const getVitals = (week) => {
        const vitals = [];
        if (week >= 6) vitals.push({ icon: <FiActivity />, label: "Heartbeat", value: "110-160 BPM", desc: "Heart is beating!" });
        if (week >= 8) vitals.push({ icon: <FiZap />, label: "Development", value: "Neural Tube", desc: "Brain & Spine forming." });
        if (week >= 10) vitals.push({ icon: <FiCheckCircle />, label: "Limbs", value: "Tiny Fingers", desc: "Webbing is disappearing." });
        if (week >= 16) vitals.push({ icon: <FiZap />, label: "Movement", value: "First Flutters", desc: "Baby is moving limbs." });
        
        if (vitals.length === 0) {
            vitals.push({ icon: <FiInfo />, label: "Status", value: "Implantation", desc: "Settling into the womb." });
            vitals.push({ icon: <FiInfo />, label: "Growth", value: "Cell Division", desc: "Creating life's foundation." });
        }
        return vitals;
    };

    const scans = [
        { title: "Dating Ultrasound", startWeek: 8, endWeek: 12, type: "Confirmation" },
        { title: "Nuchal Translucency", startWeek: 11, endWeek: 13, type: "Screening" },
        { title: "Anatomy Scan", startWeek: 18, endWeek: 22, type: "Detailed Scan" },
        { title: "Glucose Test", startWeek: 24, endWeek: 28, type: "Blood Test" },
        { title: "GBS Screening", startWeek: 35, endWeek: 37, type: "Routine Swab" }
    ];

    const trimesterStats = [
        { name: "1st Trimester", total: 91, elapsed: currentDays },
        { name: "2nd Trimester", total: 98, elapsed: currentDays - 91 },
        { name: "3rd Trimester", total: 91, elapsed: currentDays - 189 },
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans">
            <MainHeader />
      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative z-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart size={30} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Switch to Normal?</h3>
              <p className="text-gray-500 text-sm mb-8">This will pause your current pregnancy predictions and start your periods tracking journey.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSwitchMode}
                  disabled={isSwitching}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
                >
                  {isSwitching ? 'Updating...' : 'Yes'}
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
            <main className="flex-grow pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto w-full space-y-12">
                
                {/* SECTION 1: Pie Charts */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trimesterStats.map((tri, i) => {
                        const progress = Math.min(Math.max(tri.elapsed, 0), tri.total);
                        const percentage = Math.round((progress / tri.total) * 100);
                        return (
                            <div key={i} className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col items-center">
                                <div className="h-60 w-60 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[{v: progress}, {v: tri.total - progress}]}
                                                innerRadius={80}
                                                outerRadius={100}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="v"
                                                stroke="none"
                                            >
                                                <Cell fill={VIOLET_PRIMARY} cornerRadius={12} />
                                                <Cell fill={VIOLET_LIGHT} />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-900">{percentage}%</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trimester {i+1}</span>
                                    </div>
                                </div>
                                <h4 className="mt-4 font-black text-slate-400 text-xs uppercase tracking-widest">{tri.name}</h4>
                            </div>
                        );
                    })}
                </section>

                {/* KEY DATES BAR: Horizontal on Desktop, Grid on Mobile */}
                <section className="bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-2xl">
                    <div className="grid grid-cols-2 md:flex md:flex-row md:justify-between gap-8 md:gap-4 items-center">
                        <DateItem label="Conceived" date={format(new Date(pregData.prediction.fertileWindow.start), 'MMM dd')} />
                        <div className="hidden md:block w-px h-10 bg-slate-800"></div>
                        <DateItem label="LMP Date" date={format(lmpDate, 'MMM dd')} />
                        <div className="hidden md:block w-px h-10 bg-slate-800"></div>
                        <DateItem label="Due Date" date={format(dueDate, 'MMM dd, yyyy')} />
                        <div className="hidden md:block w-px h-10 bg-slate-800"></div>
                        <DateItem label="Pregnancy Age" date={`${currentWeek}w ${currentDays % 7}d`} highlight />
                    </div>
                </section>

                {/* SECTION 2: Baby Vitals */}
                <section className="space-y-10 pt-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Baby's World: Week {currentWeek}</h2>
                        <p className="text-slate-400 font-medium italic">"Every day is a new milestone for your little one."</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        {/* Visualization Card */}
                        <div className="w-full lg:w-1/3 aspect-square max-w-[350px] bg-white rounded-[4rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                            <motion.div 
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                                transition={{ repeat: Infinity, duration: 8 }}
                                className="text-violet-100"
                            >
                                <FiCamera size={120} />
                            </motion.div>
                            <span className="absolute bottom-10 font-black text-[11px] text-violet-400 uppercase tracking-widest">Growth Visualization</span>
                        </div>

                        {/* Vitals Feed */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                            {getVitals(currentWeek).map((vital, idx) => (
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    key={idx} 
                                    className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5"
                                >
                                    <div className="p-4 bg-violet-50 text-violet-600 rounded-3xl">{vital.icon}</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{vital.label}</p>
                                        <p className="font-black text-slate-900 text-xl">{vital.value}</p>
                                        <p className="text-xs text-slate-500 font-medium">{vital.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Smart Roadmap */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-1 w-10 bg-violet-600 rounded-full"></div>
                        <h3 className="text-2xl font-black text-slate-900">Medical Roadmap</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {scans.map((scan, idx) => {
                            const isCompleted = currentWeek > scan.endWeek;
                            const isUpcoming = currentWeek >= scan.startWeek && currentWeek <= scan.endWeek;

                            return (
                                <div key={idx} className={`p-6 rounded-[2.5rem] border transition-all ${
                                    isCompleted ? 'bg-emerald-50 border-emerald-100' : 
                                    isUpcoming ? 'bg-white border-violet-200 shadow-lg ring-2 ring-violet-50' : 
                                    'bg-white border-slate-100 opacity-60'
                                }`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            isCompleted ? 'bg-emerald-500 text-white' : 
                                            isUpcoming ? 'bg-violet-600 text-white animate-pulse' : 
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                            {isCompleted ? <FiCheckCircle size={20} /> : <FiCalendar size={20} />}
                                        </div>
                                        <h4 className={`font-black text-sm ${isCompleted ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                                            {scan.title}
                                        </h4>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Week {scan.startWeek}—{scan.endWeek}
                                        </p>
                                        {isUpcoming && <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">Active</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </main>
            <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
    <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
            <h4 className="text-slate-900 font-black text-lg">Changed your mind?</h4>
            <p className="text-slate-500 text-sm font-medium">Switching back will resume your regular period cycle tracking.</p>
        </div>
        <button 
            onClick={() => setShowConfirmModal(true)}
            className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-black text-sm transition-all hover:border-red-100 hover:text-red-600 active:scale-95 shadow-sm"
        >
            <span className="relative z-10 flex items-center gap-2">
                <FiZap className="group-hover:animate-pulse" />
                Switch to Normal Mode
            </span>
            {/* Subtle background reveal on hover */}
            <div className="absolute inset-0 bg-red-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
    </div>
</section>
            <Footer /> 
        </div>
    );
};

const DateItem = ({ label, date, highlight }) => (
    <div className="flex flex-col gap-1 items-center md:items-start">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{label}</span>
        <span className={`text-base md:text-xl font-black ${highlight ? 'text-violet-400' : 'text-white'}`}>{date}</span>
    </div>
);

export default MyBaby;