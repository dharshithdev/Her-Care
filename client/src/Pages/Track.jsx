import React, { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,} from "recharts";
import MainHeader from '../Components/MainHeader';


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
  { name: "Day 1", value: 45 },
  { name: "Day 2", value: 60 },
  { name: "Day 3", value: 35 },
  { name: "Day 4", value: 30 },
  { name: "Day 5", value: 10 },
]; 

const barData = [
  { name: "Jan", value: 23 },
  { name: "Feb", value: 24 },
  { name: "Mar", value: 25 },
  { name: "Apr", value: 24 },
  { name: "May", value: 25 },
  { name: "Jun", value: 26 },
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
    Menstrual: "#F9A8D4",
    Follicular: "#F9A8D4",
    Ovulation: "#F9A8D4",
    Luteal: "#F9A8D4",
  };
  phaseColors[currentPhase] = "#EC4899";

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const todayIndex = 7;
    if (scrollContainer) {
      const scrollTo = scrollContainer.children[todayIndex]?.offsetLeft - 150;
      scrollContainer.scrollLeft = scrollTo;
    }
  }, []);

  return (
    <div className="min-h-screen bg-pink-300 text-black p-4 overflow-y-auto">
      {/* SECTION 1 */}
      
      <MainHeader />
      <div className="bg-pink-200 p-6 rounded-lg mb-10 min-h-[100vh] shadow-lg">
      <div className="text-center mb-12 bg-white-500 text-white py-3 rounded-lg text-lg font-semibold">
          
        </div>
        
        {/* Date scroller */}
        <div
          className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar"
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const periodIndex = index - 7;

            let bgColor = "#FFE4E6"; // Default pink for all dates
            if (periodIndex >= 0 && periodIndex < 5) {
              const periodShades = [
                "#EF4444", // Day 2: High
                "#DC2626", // Day 1: Very High
                "#F87171", // Day 3: Moderate
                "#FCA5A5", // Day 4: Low
                "#FECACA", // Day 5: Very Low
              ];
              bgColor = periodShades[periodIndex];
            }

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center min-w-[140px] h-[140px] text-lg p-4 rounded-3xl border-2 ${
                  isToday ? "border-black scale-110" : "border-transparent"
                } shadow`}
                style={{ backgroundColor: bgColor }}
              >
                <div className="text-sm font-semibold">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-3xl font-bold">{date.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Period Status Buttons */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <button className="flex-1 bg-pink-500 text-white py-3 rounded-xl">
            MIGHT BE ON PERIODS
          </button>
          <button className="flex-1 bg-pink-500 text-white py-3 rounded-xl">
            HEAVY FLOW
          </button>
          <button className="flex-1 bg-pink-500 text-white py-3 rounded-xl">
            REGULAR PERIOD
          </button>
        </div>

        {/* Line Graph */}
        <div className="w-full h-[360px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 60]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#EC4899"
                strokeWidth={5}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="bg-pink-200 p-6 rounded-lg mb-10 min-h-[100vh] shadow-lg">
      <div className="text-center mb-6 bg-pink-500 text-white py-3 rounded-lg text-lg font-semibold">
          Phase Progress
        </div>

        {/* Donut Charts */}
        <div className="flex justify-between items-center flex-wrap lg:flex-nowrap gap-4">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full lg:w-1/4 h-[300px]"
            >
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={[
                      phase,
                      { name: "Remaining", value: phase.total - phase.value },
                    ]}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={120}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                  >
                    <Cell fill={phaseColors[phase.name]} />
                    <Cell fill="#F3F4F6" />
                  </Pie>
                  <Tooltip formatter={(value) => `${value} days completed`} />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-2 font-semibold text-center">{phase.name}</p>
            </div>
          ))}
        </div>

        {/* Ovulation Badge */}
        <div className="mt-6 flex justify-center">
          <div className="bg-pink-500 text-white px-6 py-3 rounded-md text-sm shadow-lg">
            Ovulation in 6 Days
          </div>
        </div>

        {/* Phase Info Table */}
        <div className="bg-pink-50 rounded-xl mt-8 w-[60%] mx-auto shadow text-sm">
          <table className="w-full text-left">
            <tbody>
              <tr className="bg-pink-100 text-pink-700 font-semibold">
                <td className="px-5 py-4">Current Phase</td>
                <td className="px-5 py-4">Follicular</td>
              </tr>
              <tr className="hover:bg-pink-100 transition ">
                <td className="px-5 py-4 font-semibold">Chance of Pregnancy</td>
                <td className="px-5 py-4">Low</td>
              </tr>
              <tr className="bg-pink-100 text-pink-700 font-semibold">
                <td className="px-5 py-4">Days to next cycle</td>
                <td className="px-5 py-4">18</td>
              </tr>
              <tr className="bg-pink-100 text-pink-700 font-semibold">
                <td className="px-5 py-4">Variations</td>
                <td className="px-5 py-4">8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="bg-pink-200 p-6 rounded-lg min-h-[100vh] shadow-lg">
        <div className="text-center mb-6 bg-pink-500 text-white py-3 rounded-lg text-lg font-semibold">
          Last 6 months
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Bar Graph */}
          <div className="w-full lg:w-2/3">
            <ResponsiveContainer width="100%" height={600}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F472B6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Table */}
          <div className="w-full lg:w-1/3">
            <table className="w-full text-left bg-pink-50 rounded-xl shadow overflow-hidden text-sm">
              <thead className="bg-pink-100 text-pink-700">
                <tr>
                  <th className="px-4 py-3">MONTH</th>
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3">REGULARITY</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { month: "JANUARY", date: "24", reg: "REGULAR" },
                  { month: "FEBRUARY", date: "25", reg: "REGULAR" },
                  { month: "MARCH", date: "23", reg: "REGULAR" },
                  { month: "APRIL", date: "35", reg: "IRREGULAR" },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-pink-100 transition">
                    <td className="px-4 py-3">{row.month}</td>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{row.reg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
