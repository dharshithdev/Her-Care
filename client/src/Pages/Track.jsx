import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { FiCalendar, FiDroplet, FiActivity } from 'react-icons/fi';
import MainHeader from '../Components/MainHeader';
import Footer from "../Components/Footer";
import axios from 'axios';
import { format, addDays, isSameDay, differenceInDays, subMonths } from 'date-fns';

// IntersectionObserver watches window scroll — works because overflow-y-auto is removed from outer div
const useInView = () => {
    const [key, setKey] = useState(0);
    const ref = useRef(null);
    const triggered = useRef(false); // prevents re-triggering while already in view

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView && !triggered.current) {
                triggered.current = true;
                setKey(prev => prev + 1);
            }

            if (!inView) {
                triggered.current = false; // reset when out of view so it fires again on next scroll in
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return [ref, key];
};

const TrackPage = () => {
    const scrollRef = useRef(null);
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFlow, setSelectedFlow] = useState("regular");
    const today = new Date();

    const [lineChartRef, lineKey] = useInView();
    const [pieChartRef, pieKey] = useInView();
    const [barChartRef, barKey] = useInView();

    const fetchTrackingData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/track/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrackingData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cycle data", err);
        }
    };

    useEffect(() => {
        fetchTrackingData();
    }, []);

    const handlePeriodLog = async (flowType) => {
        try {
            const token = localStorage.getItem('token');
            setSelectedFlow(flowType);
            await axios.post('http://localhost:5000/api/track/log', 
                { actualStartDate: new Date(), flowType: flowType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTrackingData();
            alert(`Logged as ${flowType} flow!`);
        } catch (err) {
            alert("Error updating cycle");
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            const scrollTo = scrollRef.current.children[7]?.offsetLeft - 150;
            scrollRef.current.scrollLeft = scrollTo;
        }
    }, [loading]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500">LOADING YOUR RHYTHM...</div>;

    const { currentPhase, nextPeriodIn, prediction, fullCycleData } = trackingData;

    const getFlowData = () => {
        const data = [];
        const cycleDays = 7;
        const multiplier = selectedFlow === "heavy" ? 1.5 : 1;
        for (let i = 0; i < cycleDays; i++) {
            let flow = 0.2;
            if (i >= 0 && i < 5) {
                const baseIntensities = [1.5, 3, 3, 2, 1];
                flow = baseIntensities[i] * multiplier;
            }
            data.push({ day: i + 1, value: flow });
        }
        return data;
    };

    const getPaddedHistory = () => {
        const history = Array.isArray(fullCycleData) ? [...fullCycleData] : [];
        const padded = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = subMonths(today, i);
            const monthName = format(monthDate, 'MMMM').toUpperCase();
            const existing = history.find(h => h.month === monthName);
            padded.push(existing || { month: monthName, cycleLength: 0, startDate: 'No Data' });
        }
        return padded;
    };

    const paddedHistory = getPaddedHistory();
    const flowChartData = getFlowData();

const phaseOrder = ["Menstrual", "Follicular", "Ovulation", "Luteal"];
const currentPhaseIndex = phaseOrder.indexOf(currentPhase);

const phasesUI = [
    { 
        name: "Menstrual", 
        total: 5,
        value: currentPhaseIndex > 0 ? 5 : (currentPhase === "Menstrual" ? differenceInDays(today, new Date(prediction.phases.menstrual.start)) + 1 : 0)
    },
    { 
        name: "Follicular", 
        total: 10,
        value: currentPhaseIndex > 1 ? 10 : (currentPhase === "Follicular" ? differenceInDays(today, new Date(prediction.phases.follicular.start)) + 1 : 0)
    },
    { 
        name: "Ovulation", 
        total: 1,
        value: currentPhaseIndex > 2 ? 1 : (currentPhase === "Ovulation" ? 1 : 0)
    },
    { 
        name: "Luteal", 
        total: 14,
        value: currentPhase === "Luteal" ? differenceInDays(today, new Date(prediction.phases.luteal.start)) + 1 : 0
    },
];

    const phaseColors = { Menstrual: "#FDA4AF", Follicular: "#FDA4AF", Ovulation: "#FDA4AF", Luteal: "#FDA4AF" };
    phaseColors[currentPhase] = "#E11D48";

    const scrollerDates = (() => {
        const dates = [];
        for (let i = -7; i < 14; i++) { dates.push(addDays(today, i)); }
        return dates;
    })();

    return (
        // ✅ overflow-y-auto removed — window handles scrolling now
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
            <MainHeader />
            <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24 lg:pt-32 space-y-12">

                {/* SECTION 1: CYCLE TRACKER & LINE CHART */}
                <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl shadow-inner"><FiCalendar size={28} /></div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-slate-900">Cycle Overview</h2>
                                <p className="text-slate-400 font-medium">Phase: {currentPhase}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto space-x-5 py-10 px-4 no-scrollbar snap-x relative z-10" ref={scrollRef}>
                        {scrollerDates.map((date, index) => {
                            const isToday = isSameDay(date, today);
                            const isPredictedPeriod = date >= new Date(prediction.phases.menstrual.start) && date <= new Date(prediction.phases.menstrual.end);
                            return (
                                <div key={index}
                                    className={`flex flex-col items-center justify-center min-w-[110px] h-[130px] rounded-[2.2rem] transition-all duration-500 snap-center relative border-4 ${isToday ? "border-rose-500 bg-white scale-110 shadow-2xl shadow-rose-200 z-30" : "border-transparent z-10"}`}
                                    style={{ backgroundColor: isToday ? '#FFF' : (isPredictedPeriod ? '#FB7185' : '#F8FAFC'), color: isToday || isPredictedPeriod ? '#E11D48' : '#64748B' }}>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-rose-500' : 'opacity-60'}`}>{format(date, 'eee')}</span>
                                    <span className="text-4xl font-black mt-1 leading-none">{date.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <button onClick={() => handlePeriodLog("regular")} className="py-5 px-6 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 transition-all text-xs tracking-wider active:scale-95">
                            I GOT MY PERIODS TODAY
                        </button>
                        <button onClick={() => handlePeriodLog("heavy")} className={`py-5 px-6 rounded-2xl font-bold border-2 text-xs tracking-wider transition-all ${selectedFlow === "heavy" ? "bg-rose-100 border-rose-500 text-rose-600" : "bg-white hover:bg-slate-100 text-slate-500 border-slate-50"}`}>
                            HEAVY FLOW
                        </button>
                        <button onClick={() => handlePeriodLog("regular")} className={`py-5 px-6 rounded-2xl font-bold border-2 text-xs tracking-wider transition-all ${selectedFlow === "regular" ? "bg-rose-100 border-rose-500 text-rose-600" : "bg-white hover:bg-slate-100 text-slate-500 border-slate-50"}`}>
                            REGULAR PERIOD
                        </button>
                    </div>

                    {/* ref on the chart wrapper div */}
                    <div ref={lineChartRef} className="w-full h-[320px] mt-12 bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-6 border border-white">
                        <ResponsiveContainer width="100%" height="100%" key={`line-${lineKey}`}>
                            <LineChart data={flowChartData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#E11D48"
                                    strokeWidth={6}
                                    dot={false}
                                    animationDuration={1200}
                                />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* SECTION 2: PHASE ANALYTICS (PIE CHARTS) */}
                <section className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl"><FiActivity size={28} /></div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Phase Analytics</h2>
                    </div>

                    {/* ref on the pie grid wrapper */}
                    <div ref={pieChartRef} className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        {phasesUI.map((phase, index) => (
                            <div key={index} className="flex flex-col items-center group relative">
                                <div className="relative w-full h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%" key={`pie-${index}-${pieKey}`}>
                                        <PieChart>
                                            <Pie
                                                data={[phase, { name: "Rem", value: phase.total - phase.value }]}
                                                dataKey="value"
                                                innerRadius={65}
                                                outerRadius={85}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                                animationDuration={1000}
                                            >
                                                <Cell fill={phaseColors[phase.name]} />
                                                <Cell fill="#F1F5F9" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-3xl font-black text-slate-800">{phase.value || 0}</span>
                                        <span className="text-[10px] uppercase text-slate-400 font-black">/ {phase.total} Days</span>
                                    </div>
                                </div>
                                <p className="mt-4 font-black text-slate-500 uppercase tracking-widest text-xs">{phase.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex flex-col xl:flex-row items-stretch gap-8">
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-8 rounded-[2rem] shadow-xl xl:w-1/3 flex flex-col justify-center items-center">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Next Milestone</span>
                            <p className="text-2xl font-black">Period in {nextPeriodIn} Days</p>
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
                            <table className="w-full">
                                <tbody className="text-sm">
                                    <tr><td className="px-6 py-5 font-bold text-slate-400 uppercase">Current Phase</td><td className="px-6 py-5 font-black text-rose-600 text-right">{currentPhase}</td></tr>
                                    <tr className="border-y border-white"><td className="px-6 py-5 font-bold text-slate-400 uppercase">Fertility</td><td className="px-6 py-5 font-black text-slate-700 text-right">{currentPhase === "Ovulation" ? "High" : "Low"}</td></tr>
                                    <tr className="border-y border-white"><td className="px-6 py-5 font-bold text-slate-400 uppercase">Fertile window</td><td className="px-6 py-5 font-black text-slate-700 text-right">{format(new Date(prediction.fertileWindow.start), 'MMM d')} - {format(new Date(prediction.fertileWindow.end), 'MMM d')} [6 Days]</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: CYCLE HISTORY (BAR CHART) */}
                <section className="bg-slate-900 p-8 lg:p-12 rounded-[3rem] shadow-2xl text-white">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-4 bg-white/10 text-rose-400 rounded-2xl"><FiDroplet size={28} /></div>
                        <h2 className="text-3xl font-black tracking-tight">Cycle History</h2>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* ref on the bar chart wrapper div */}
                        <div ref={barChartRef} className="lg:col-span-2 h-[450px] bg-white/5 rounded-[2.5rem] p-8">
                            <ResponsiveContainer width="100%" height="100%" key={`bar-${barKey}`}>
                                <BarChart data={paddedHistory}>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Bar
                                        dataKey="cycleLength"
                                        fill="#E11D48"
                                        radius={[10, 10, 10, 10]}
                                        animationDuration={1200}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                            <table className="w-full">
                                <tbody className="text-xs">
                                    {paddedHistory.map((row, index) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-6 font-black uppercase">{row.month}</td>
                                            <td className="px-6 py-6 font-bold text-slate-500">{row.startDate}</td>
                                            <td className="px-6 py-6 font-black text-right text-emerald-400">{row.cycleLength > 0 ? "REGULAR" : "-"}</td>
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