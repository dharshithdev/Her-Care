import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from "../Components/Footer";
import MainHeader from "../Components/MainHeader";
import { FiEdit3, FiCheck, FiCalendar, FiSun, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DailyCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const moods = [
    { label: 'Calm', icon: '🧘', color: 'bg-blue-50', active: 'ring-blue-400 bg-blue-100' },
    { label: 'Energetic', icon: '⚡', color: 'bg-yellow-50', active: 'ring-yellow-400 bg-yellow-100' },
    { label: 'Sensitive', icon: '🌸', color: 'bg-rose-50', active: 'ring-rose-400 bg-rose-100' },
    { label: 'Focused', icon: '🧠', color: 'bg-indigo-50', active: 'ring-indigo-400 bg-indigo-100' },
    { label: 'Tired', icon: '😴', color: 'bg-slate-50', active: 'ring-slate-400 bg-slate-100' },
  ];

  const symptomsList = ["Cramps", "Bloating", "Headache", "Back Pain", "Clear Skin", "Cravings", "Nausea", "Insomnia"];

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return alert("Please select your energy level first!");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        energy: selectedMood,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "None",
        journal: note
      };

      await axios.post('http://localhost:5000/api/daily/mood', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Entry saved successfully!");
      navigate('/dashboard'); // Or wherever you'd like
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to save entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] flex flex-col">
      <MainHeader />
      
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-rose-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-3 md:mb-4">
                <FiSun className="animate-pulse" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Daily <span className="text-rose-500">Check-in</span>
              </h2>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-slate-900 font-black text-lg">Sarah Jenkins</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* Left Col: Mood & Symptoms */}
            <div className="lg:col-span-8 space-y-6 md:space-y-10">
              
              {/* Mood Selector */}
              <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                  How is your energy?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                  {moods.map((mood) => (
                    <button 
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`${selectedMood === mood.label ? mood.active + ' ring-2 shadow-inner' : mood.color + ' bg-opacity-40'} 
                        p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95`}
                    >
                      <span className="text-3xl md:text-4xl">{mood.icon}</span>
                      <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Symptom Chips */}
              <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  Physical Symptoms
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {symptomsList.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-black transition-all border-2
                        ${selectedSymptoms.includes(s) 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg translate-y-[-2px]' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/30'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Col: Notes & Save */}
            <div className="lg:col-span-4 h-full">
              <div className="sticky top-28 md:top-32 space-y-6 md:space-y-8">
                <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col min-h-[350px] md:min-h-[400px]">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <FiEdit3 className="text-rose-500" /> Journal
                  </h3>
                  <textarea 
                    placeholder="Write a private note about your day..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full flex-grow bg-slate-50 border-none rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-sm font-medium focus:ring-4 focus:ring-rose-50 outline-none resize-none placeholder:text-slate-300 text-slate-700 transition-all"
                  />
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full mt-6 md:mt-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-base md:text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95 ${
                      isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-rose-500 text-white shadow-slate-200 hover:shadow-rose-200'
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Entry"} <FiCheck className="text-xl group-hover:rotate-12 transition-transform" />
                  </button>
                </section>

                {/* Insight Widget */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] md:rounded-[2.5rem] text-white relative overflow-hidden group">
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <FiActivity className="text-indigo-200" />
                        <span className="text-indigo-200 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Phase Insight</span>
                     </div>
                     <h4 className="text-base md:text-lg font-bold leading-tight mb-2">You're in your Follicular Phase.</h4>
                     <p className="text-indigo-100 text-[10px] md:text-xs font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        Your estrogen is rising. It's a great time to start new projects or high-intensity workouts.
                     </p>
                  </div>
                  <FiCalendar className="text-7xl md:text-9xl text-white/5 absolute -right-4 -bottom-4 rotate-12" />
                </div>
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