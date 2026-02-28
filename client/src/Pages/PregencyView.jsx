import React, { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FiActivity, FiCalendar, FiCompass, FiClock, FiTarget, FiHeart, FiTrendingUp, FiCheckCircle, FiEye, FiMusic, FiStar, FiLoader } from 'react-icons/fi';
import { GiRaspberry, GiBanana, GiPineapple, GiWatermelon, GiGrapes, GiLemon, GiPlantSeed } from 'react-icons/gi';
import { format, addDays, isSameDay, differenceInDays, parseISO } from 'date-fns';
import api from '../Utils/axiosConfig';

const useInView = () => {
    const [key, setKey] = useState(0);
    const ref = useRef(null);
    const triggered = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView && !triggered.current) {
                triggered.current = true;
                setKey(prev => prev + 1);
            }
            if (!inView) triggered.current = false;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return [ref, key];
};

const PregnancyView = ({ today, scrollerDates, scrollRef }) => {
    const [heroRef, heroKey] = useInView();
    const [bentoRef, bentoKey] = useInView();
    const [chartRef, chartKey] = useInView();
    const [milestoneRef, milestoneKey] = useInView();

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Create a ref specifically for the today element
    const todayElementRef = useRef(null);

    useEffect(() => {
        const fetchPregnantData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get(`${process.env.REACT_APP_API_URL}/api/track/pregency/data`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.isPregnant) {
                    setPrediction(res.data.prediction);
                }
            } catch (err) {
                console.error("Error fetching specific pregnancy collection data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPregnantData();
    }, []);

useEffect(() => {
    if (scrollRef.current && !loading) {
        const timer = setTimeout(() => { 
            if (scrollRef.current) {
                const scrollTo = scrollRef.current.children[7]?.offsetLeft - 150;
                scrollRef.current.scrollLeft = scrollTo;
            }
        }, 100);
        return () => clearTimeout(timer);
    }
}, [loading]);

    if (loading || !prediction || !prediction.phases?.menstrual?.start) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Syncing your journey...</p>
            </div>
        );
    }

    const lmpDate = new Date(prediction.phases.menstrual.start); 
    const dueDate = prediction.dueDate ? new Date(prediction.dueDate) : addDays(lmpDate, 280); 
    const daysPregnant = differenceInDays(today, lmpDate);
    const currentWeek = Math.max(0, Math.floor(daysPregnant / 7));
    const currentDayInWeek = Math.max(0, daysPregnant % 7);
    const totalDays = differenceInDays(dueDate, lmpDate);
    const daysRemaining = Math.max(0, totalDays - daysPregnant);
    const progressPercent = Math.min((daysPregnant / totalDays) * 100, 100);

    const fetalGrowthData = [
        { week: 4, length: 0.2 }, { week: 12, length: 5.4 }, 
        { week: 20, length: 25.6 }, { week: 28, length: 37.6 }, 
        { week: 36, length: 47.4 }, { week: 40, length: 51.2 }
    ];

    const getSizeComparison = (week) => {
        if (week < 4) return { Icon: GiPlantSeed, name: "Poppy Seed", color: "bg-emerald-50 text-emerald-700 border-emerald-100", size: 44 };
        if (week < 9) return { Icon: GiRaspberry, name: "Raspberry", color: "bg-rose-50 text-rose-700 border-rose-100", size: 48 };
        if (week < 14) return { Icon: GiLemon, name: "Lemon", color: "bg-amber-50 text-amber-700 border-amber-100", size: 52 };
        if (week < 21) return { Icon: GiBanana, name: "Banana", color: "bg-yellow-50 text-yellow-700 border-yellow-100", size: 56 };
        if (week < 28) return { Icon: GiGrapes, name: "Grapes", color: "bg-violet-50 text-violet-700 border-violet-100", size: 60 };
        if (week < 35) return { Icon: GiPineapple, name: "Pineapple", color: "bg-orange-50 text-orange-700 border-orange-100", size: 64 };
        return { Icon: GiWatermelon, name: "Watermelon", color: "bg-pink-50 text-pink-700 border-pink-100", size: 72 };
    };

    const babySize = getSizeComparison(currentWeek);

    const getCurrentMilestone = (week) => {
        if (week < 5) return { title: "The Beginning", desc: "Implantation occurs and pregnancy hormone production begins. Your body is preparing for the incredible journey ahead.", icon: FiHeart, color: "violet" };
        if (week < 12) return { title: "Reflexes Develop", desc: "Baby can now open and close fists and curl toes. Fingernails and hair follicles are starting to form.", icon: FiActivity, color: "violet" };
        if (week < 20) return { title: "First Kicks!", desc: "You might start feeling those magical first flutters and kicks. This is called 'quickening'.", icon: FiActivity, color: "fuchsia" };
        if (week < 26) return { title: "Eyes Open", desc: "Baby's eyes can now open and detect light. They can even respond to light shining on your belly!", icon: FiEye, color: "indigo" };
        if (week < 32) return { title: "Dreaming Begins", desc: "REM sleep starts - your baby may be dreaming! All five senses are now fully functional.", icon: FiStar, color: "purple" };
        return { title: "Full Term Ready", desc: "Your baby is fully developed and ready to meet you! Every day brings you closer to that first hello.", icon: FiHeart, color: "rose" };
    };

    const milestone = getCurrentMilestone(currentWeek);

    return (
        <div className="max-w-6xl mx-auto px-3 md:px-4 pb-24 space-y-6 md:space-y-10">
            
            {/* HERO SECTION - LAVENDER THEME */}
            <header 
                ref={heroRef}
                key={`hero-${heroKey}`}
                className="relative bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-12 lg:p-14 shadow-2xl shadow-violet-100/50 border border-violet-50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
            >
                <div className="absolute top-0 right-0 p-8 text-violet-500 opacity-[0.03]">
                    <FiActivity size={240} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    <div className="relative flex-shrink-0 group">
                        <div className="absolute inset-0 bg-violet-200 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90 relative z-10">
                            <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                            <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                strokeDasharray="264" strokeDashoffset={264 - (264 * progressPercent) / 100}
                                strokeLinecap="round" className="text-violet-500 transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                            <span className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{currentWeek}</span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-violet-400">Weeks</span>
                        </div>
                    </div>

                    <div className="flex-grow text-center lg:text-left space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-full text-xs font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                            </span>
                            {currentWeek < 13 ? 'First' : currentWeek < 27 ? 'Second' : 'Third'} Trimester
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            Growing <span className="text-violet-500">beautifully</span> <br className="hidden sm:block" /> every single day.
                        </h1>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
                                <FiClock className="text-violet-400" size={18} />
                                <span className="text-sm font-bold text-slate-600">Day {currentDayInWeek + 1} of Week {currentWeek}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
                                <FiTarget className="text-violet-400" size={18} />
                                <span className="text-sm font-bold text-slate-600">{daysRemaining} Days to Go</span>
                            </div>
                        </div>
                    </div>
                </div>

{/* Calendar Scroller */}
<div 
    className="mt-10 md:mt-14 flex overflow-x-auto w-full space-x-3 md:space-x-4 py-4 no-scrollbar snap-x snap-mandatory relative" 
    ref={scrollRef}
>
    {scrollerDates.map((date, index) => {
        const isToday = isSameDay(date, today);
        return (
            <div 
                key={index} 
                ref={isToday ? todayElementRef : null}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[75px] md:min-w-[90px] h-[95px] md:h-[110px] rounded-[2rem] transition-all duration-300 snap-center border-2
                ${isToday ? "bg-violet-600 border-violet-400 text-white shadow-xl shadow-violet-200 -translate-y-1" : "bg-white border-slate-50 text-slate-400 hover:border-violet-100"}`}>
                <span className="text-[9px] font-black uppercase tracking-widest mb-1">{format(date, 'eee')}</span>
                <span className="text-2xl font-black">{date.getDate()}</span>
            </div>
        );
    })}
</div>
            </header>

            {/* BENTO GRID */}
            <div ref={bentoRef} key={`bento-${bentoKey}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                {/* Growth Chart */}
                <div className="md:col-span-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                                <FiActivity size={20} />
                            </div>
                            Growth Track
                        </h3>
                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 uppercase tracking-wider">CM Unit</span>
                    </div>
                    <div ref={chartRef} className="h-[250px] md:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" key={`chart-${chartKey}`}>
                            <AreaChart data={fetalGrowthData}>
                                <defs>
                                    <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis hide domain={[0, 60]} />
                                <Tooltip cursor={{stroke: '#ddd', strokeWidth: 1}} contentStyle={{backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="length" stroke="#8b5cf6" strokeWidth={4} fill="url(#violetGradient)" animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Size Comparison Card */}
                <div className={`md:col-span-4 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all border-2 shadow-sm ${babySize.color}`}>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-current opacity-10 blur-2xl animate-pulse"></div>
                        <babySize.Icon size={70} className="relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60 text-current">Comparison</p>
                    <h4 className="text-3xl font-black mb-2">A {babySize.name}</h4>
                    <p className="text-xs font-bold opacity-80 leading-relaxed">Your baby is roughly {fetalGrowthData.find(d => d.week >= currentWeek)?.length || '...'} cm long today!</p>
                </div>

                {/* Info Pills */}
                <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'LMP Date', val: format(lmpDate, 'MMM d, yyyy'), icon: FiCalendar, bg: 'bg-violet-50', text: 'text-violet-600' },
                        { label: 'Conception', val: prediction.fertileWindow?.start ? format(new Date(prediction.fertileWindow.start), 'MMM d, yyyy') : '---', icon: FiCompass, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                        { label: 'Remaining', val: `${daysRemaining} Days`, icon: FiClock, bg: 'bg-orange-50', text: 'text-orange-600' },
                        { label: 'Due Date', val: format(dueDate, 'MMM d, yyyy'), icon: FiHeart, bg: 'bg-rose-50', text: 'text-rose-600' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all">
                            <div className={`w-12 h-12 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                <p className="font-bold text-slate-800">{item.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MILESTONE SECTION */}
            <section 
                ref={milestoneRef}
                key={`milestone-${milestoneKey}`}
                className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-6 py-10 md:p-16 lg:p-20 text-white"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] -mr-10 -mt-10 md:w-96 md:h-96 md:bg-violet-600/20 md:blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 blur-[80px] -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                    <div className="w-full lg:w-2/3 space-y-5 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <FiStar className="text-violet-400 fill-violet-400" size={14} />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Week {currentWeek} Magic</span>
                        </div>
                        
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                            {milestone.title}
                        </h2>
                        
                        <p className="text-sm md:text-lg lg:text-xl text-slate-300 leading-relaxed font-medium max-w-2xl">
                            {milestone.desc}
                        </p>

                        <div className="pt-2 md:pt-4 flex flex-col items-center lg:items-start gap-6">
                            <div className="w-full max-w-xs md:max-w-sm">
                                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <span>Progress</span>
                                    <span className="text-violet-400">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="h-2.5 md:h-4 w-full bg-white/5 rounded-full p-0.5 md:p-1 border border-white/5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-400 rounded-full transition-all duration-1000 relative"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 flex justify-center mt-4 lg:mt-0">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-[2rem] md:rounded-[3rem] rotate-6 flex items-center justify-center shadow-2xl relative z-10">
                                <milestone.icon className="text-white -rotate-6 w-12 h-12 md:w-20 md:h-20" />
                            </div>
                            <div className="absolute inset-0 bg-violet-500/20 rounded-[2rem] md:rounded-[3rem] -rotate-3 scale-105 blur-sm"></div>
                            <div className="absolute inset-0 border border-white/10 rounded-[2rem] md:rounded-[3rem] rotate-12"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PregnancyView;