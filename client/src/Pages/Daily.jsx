import React, { useState, useEffect } from 'react';
import api from '../Utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "../Components/Footer";
import MainHeader from "../Components/MainHeader";
import { FiEdit3, FiCheck, FiSun, FiLoader, FiActivity, FiX, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence, color } from 'framer-motion';

const DailyCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const [isPregnant, setIsPregnant] = useState(() => {
      return localStorage.getItem('isPregnant') === 'true';
  });

  const moods = [
    { label: 'Calm', icon: '🧘', color: 'bg-blue-50', active: 'ring-blue-400 bg-blue-100' },
    { label: 'Energetic', icon: '⚡', color: 'bg-yellow-50', active: 'ring-yellow-400 bg-yellow-100' },
    { label: 'Sensitive', icon: '🌸', color: 'bg-rose-50', active: 'ring-rose-400 bg-rose-100' },
    { label: 'Focused', icon: '🧠', color: 'bg-indigo-50', active: 'ring-indigo-400 bg-indigo-100' },
    { label: 'Tired', icon: '😴', color: 'bg-slate-50', active: 'ring-slate-400 bg-slate-100' },
  ];

  const symptomsList = ["Cramps", "Bloating", "Headache", "Back Pain", "Clear Skin", "Cravings", "Nausea", "Insomnia"];

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return showToast("Please select your energy level!", "error");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        energy: selectedMood,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "None",
        journal: note
      };

      await api.post(`${process.env.REACT_APP_API_URL}/api/daily/mood`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast("Entry saved to your journal!");
      setTimeout(() => navigate('/daily'), 2000);
    } catch (error) {
      showToast("Connection error. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorShow = isPregnant ?  "text-violet-500" : "text-rose-500";
  const colorShow2 = isPregnant ?  "bg-violet-50" : "bg-rose-50";
  const borderShow = isPregnant ? "border-violet-200" : "border-rose-200";
  const primaryBg = isPregnant ? "bg-violet-600" : "bg-rose-500";
  const hoverBg = isPregnant ? "hover:bg-violet-700" : "hover:bg-rose-600";
  const shadowColor = isPregnant ? "hover:shadow-violet-900/20" : "hover:shadow-rose-900/20";
  return (
    <div className="min-h-screen bg-[#FDFCFD] flex flex-col">
      <MainHeader />
      
      {/* CUSTOM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 20, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-20 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className={`flex items-center gap-3 p-4 rounded-3xl shadow-2xl border ${
              toast.type === 'error' ? 'bg-rose-900 border-rose-800 text-white' : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              {toast.type === 'error' ? <FiInfo className="text-rose-400" /> : <FiCheck className="text-emerald-400" />}
              <p className="text-xs font-black uppercase tracking-widest flex-grow">{toast.message}</p>
              <button onClick={() => setToast({ ...toast, show: false })}><FiX /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-24 md:pt-36 pb-20 px-4 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="mb-8 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${colorShow2} rounded-full ${colorShow} text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-3 md:mb-4`}>
                <FiSun className="animate-pulse" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                Daily <span className={`${colorShow}`}>Check-in</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* LEFT SIDE: MOOD & SYMPTOMS */}
            <div className="lg:col-span-8 space-y-6 md:space-y-10">
              
              <section className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-10 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                  How is your energy?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                  {moods.map((mood) => (
                    <motion.button 
                      whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`${selectedMood === mood.label ? mood.active + ' ring-2 shadow-inner' : mood.color + ' bg-opacity-40'} 
                        p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-3 transition-all duration-300`}
                    >
                      <span className="text-3xl md:text-4xl">{mood.icon}</span>
                      <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-10 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  Physical Symptoms
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {symptomsList.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black transition-all border-2
                        ${selectedSymptoms.includes(s) 
                          ? `${colorShow2} ${borderShow} ${colorShow} shadow-md -translate-y-1` // Selected: Violet or Rose
                          : `bg-white border-slate-50 text-slate-400 hover:border-slate-200`    // Unselected: Neutral
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDE: JOURNAL & INSIGHT */}
            <div className="lg:col-span-4 h-full">
              <div className="sticky top-28 md:top-36 space-y-6 md:space-y-8">
                <section className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col min-h-[380px] md:min-h-[450px]">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <FiEdit3 className="text-rose-500" /> Journal
                  </h3>
                  <textarea 
                    placeholder="Note down any specifics about today..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full flex-grow bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-rose-50 outline-none resize-none placeholder:text-slate-300 text-slate-700 transition-all"
                  />
                  
                  <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full mt-6 py-5 rounded-[2rem] font-black text-sm md:text-base uppercase tracking-widest shadow-xl transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 ${
                    isSubmitting 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : `${primaryBg} ${hoverBg} text-white shadow-slate-200 ${shadowColor}`
                  }`}
                >
                  {isSubmitting ? (
                    <>Syncing... <FiLoader className="animate-spin" /></>
                  ) : (
                    <>Complete Check-in <FiCheck /></>
                  )}
                </button>
                </section>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DailyCheckIn;