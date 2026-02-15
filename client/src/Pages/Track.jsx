import React, { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { FiCalendar, FiDroplet, FiActivity } from 'react-icons/fi';
import MainHeader from '../Components/MainHeader';
import Footer from "../Components/Footer";

const getNextNDates = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = -7; i < n; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const lineData = [
  { name: "Day 1", value: 45 }, { name: "Day 2", value: 60 },
  { name: "Day 3", value: 35 }, { name: "Day 4", value: 30 }, { name: "Day 5", value: 10 },
];

const barData = [
  { name: "Jan", value: 23 }, { name: "Feb", value: 24 },
  { name: "Mar", value: 25 }, { name: "Apr", value: 24 },
  { name: "May", value: 25 }, { name: "Jun", value: 26 },
];

const phases = [
  { name: "Menstrual", value: 3, total: 5 },
  { name: "Follicular", value: 4, total: 10 },
  { name: "Ovulation", value: 1, total: 1 },
  { name: "Luteal", value: 7, total: 14 },
];

const TrackPage = () => {
  const scrollRef = useRef(null);
  const today = new Date();
  const dates = getNextNDates(14);
  const currentPhase = "Luteal";

  const phaseColors = {
    Menstrual: "#FDA4AF", Follicular: "#FDA4AF",
    Ovulation: "#FDA4AF", Luteal: "#FDA4AF",
  };
  phaseColors[currentPhase] = "#E11D48"; 

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const todayIndex = 7;
    if (scrollContainer) {
      const scrollTo = scrollContainer.children[todayIndex]?.offsetLeft - 150;
      scrollContainer.scrollLeft = scrollTo;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-y-auto">
      <MainHeader />

      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24 lg:pt-32 space-y-12">
        
        {/* SECTION 1: CYCLE TRACKER */}
        <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl shadow-inner">
                <FiCalendar size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Cycle Overview</h2>
                <p className="text-slate-400 font-medium">Tracking your 28-day rhythm</p>
              </div>
            </div>
          </div>

          {/* Date scroller - Increased py-10 to prevent clipping of scaled cards */}
          <div
            className="flex overflow-x-auto space-x-5 py-10 px-4 no-scrollbar snap-x relative z-10"
            ref={scrollRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {dates.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString();
              const periodIndex = index - 7;

              let bgColor = "#F8FAFC"; 
              let textColor = "#64748B";

              if (periodIndex >= 0 && periodIndex < 5) {
                const periodShades = ["#FECDD3", "#FB7185", "#F43F5E", "#E11D48", "#BE123C"];
                bgColor = periodShades[periodIndex];
                textColor = "#FFFFFF";
              }

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center min-w-[110px] h-[130px] rounded-[2.2rem] transition-all duration-500 snap-center relative border-4 ${
                    isToday 
                      ? "border-rose-500 bg-white scale-110 shadow-2xl shadow-rose-200 z-30" 
                      : "border-transparent z-10"
                  }`}
                  style={{ 
                    backgroundColor: isToday ? '#FFF' : bgColor, 
                    color: isToday ? '#E11D48' : textColor 
                  }}
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-rose-500' : 'opacity-60'}`}>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-4xl font-black mt-1 leading-none">{date.getDate()}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {["MIGHT BE ON PERIODS", "HEAVY FLOW", "REGULAR PERIOD"].map((text) => (
              <button key={text} className="py-5 px-6 rounded-2xl bg-white hover:bg-rose-500 hover:text-white font-bold text-slate-500 transition-all duration-300 border-2 border-slate-50 hover:border-rose-500 hover:shadow-lg text-xs tracking-wider active:scale-95">
                {text}
              </button>
            ))}
          </div>

          <div className="w-full h-[320px] mt-12 bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 70]} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#E11D48" 
                  strokeWidth={6} 
                  dot={{ r: 8, fill: "#E11D48", strokeWidth: 4, stroke: "#fff" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 2: PHASE PROGRESS */}
        <section className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl">
              <FiActivity size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Phase Analytics</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {phases.map((phase, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div className="relative w-full h-[200px] transition-transform duration-500 group-hover:scale-105">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[phase, { name: "Remaining", value: phase.total - phase.value }]}
                        dataKey="value"
                        innerRadius={65}
                        outerRadius={85}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        <Cell fill={phaseColors[phase.name]} />
                        <Cell fill="#F1F5F9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black text-slate-800">{phase.value}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-black tracking-tighter">/ {phase.total} Days</span>
                  </div>
                </div>
                <p className="mt-4 font-black text-slate-500 group-hover:text-rose-600 transition-colors uppercase tracking-widest text-xs">{phase.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col xl:flex-row items-stretch gap-8">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-8 rounded-[2rem] shadow-xl shadow-rose-200 flex flex-col justify-center items-center text-center xl:w-1/3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Next Milestone</span>
              <p className="text-2xl font-black">Ovulation in 6 Days</p>
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
              <table className="w-full">
                <tbody className="text-sm">
                  <tr><td className="px-6 py-5 font-bold text-slate-400 uppercase tracking-wider">Current Phase</td><td className="px-6 py-5 font-black text-rose-600 text-right">Follicular</td></tr>
                  <tr className="border-y border-white"><td className="px-6 py-5 font-bold text-slate-400 uppercase tracking-wider">Pregnancy Chance</td><td className="px-6 py-5 font-black text-slate-700 text-right">Low</td></tr>
                  <tr><td className="px-6 py-5 font-bold text-slate-400 uppercase tracking-wider">Days to next cycle</td><td className="px-6 py-5 font-black text-slate-700 text-right">18 Days</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 3: DARK ANALYTICS */}
        <section className="bg-slate-900 p-8 lg:p-12 rounded-[3rem] shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-white/10 text-rose-400 rounded-2xl">
              <FiDroplet size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Last 6 Months</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 h-[450px] bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold', fontSize: 12}} dy={10} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '20px'}} />
                  <Bar dataKey="value" fill="#E11D48" radius={[10, 10, 10, 10]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5">
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-left">Month</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-left">Date</th>
                    <th className="px-6 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { month: "JANUARY", date: "24", reg: "REGULAR", color: "text-emerald-400" },
                    { month: "FEBRUARY", date: "25", reg: "REGULAR", color: "text-emerald-400" },
                    { month: "MARCH", date: "23", reg: "REGULAR", color: "text-emerald-400" },
                    { month: "APRIL", date: "35", reg: "IRREGULAR", color: "text-rose-400" },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6 font-black tracking-wider group-hover:text-rose-400">{row.month}</td>
                      <td className="px-6 py-6 font-bold text-slate-500">{row.date}</td>
                      <td className={`px-6 py-6 font-black text-right tracking-widest ${row.color}`}>{row.reg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
            <Footer />
      </div>
    </div>
  );
};

export default TrackPage;