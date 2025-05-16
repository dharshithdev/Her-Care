import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Track = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState(moment('2025-04-01'));
  const [periodDates, setPeriodDates] = useState([]);
  const [today] = useState(moment());
  const [messages, setMessages] = useState('');

  useEffect(() => {
    calculateNextPeriods(lastPeriodDate);
    showMessages(lastPeriodDate);
  }, [lastPeriodDate]);

  const calculateNextPeriods = (lastDate) => {
    const cycleLength = 30;
    const periodLength = 5;
    const periodDatesArr = [];

    let nextStart = moment(lastDate);
    while (nextStart.isBefore(moment().endOf('month'))) {
      const nextEnd = moment(nextStart).add(periodLength - 1, 'days');
      for (let m = moment(nextStart); m.isSameOrBefore(nextEnd); m.add(1, 'days')) {
        periodDatesArr.push(m.format('YYYY-MM-DD'));
      }
      nextStart = moment(nextStart).add(cycleLength, 'days');
    }
    setPeriodDates(periodDatesArr);
  };

  const showMessages = (lastDate) => {
    const nextPeriod = moment(lastDate).add(30, 'days');
    const daysLeft = nextPeriod.diff(moment(), 'days');

    if (daysLeft > 10) setMessages('Low chance of getting pregnant');
    else if (daysLeft > 5) setMessages(`Your period is expected in ${daysLeft} days`);
    else if (daysLeft > 0) setMessages(`Get ready, period is in ${daysLeft} days`);
    else setMessages('You might be on your period');
  };

  const cyclePhases = [
    { name: 'Menstrual', days: 5 },
    { name: 'Follicular', days: 9 },
    { name: 'Ovulation', days: 1 },
    { name: 'Luteal', days: 15 },
  ];

  const totalDaysSince = moment().diff(lastPeriodDate, 'days') % 30;
  let stageIndex = 0;
  let dayCounter = 0;
  for (let i = 0; i < cyclePhases.length; i++) {
    if (totalDaysSince < dayCounter + cyclePhases[i].days) {
      stageIndex = i;
      break;
    }
    dayCounter += cyclePhases[i].days;
  }

  const prevMonths = [
    { month: 'January', length: 29 },
    { month: 'February', length: 31 },
    { month: 'March', length: 30 },
    { month: 'April', length: 28 },
    { month: 'May', length: 32 },
  ];

  return (
    <div className="p-6 bg-pink-50 min-h-screen space-y-12">
      {/* Section 1: Scrollable Period Days */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-700 mb-6">Your Period Tracker</h2>
        <div
          className="flex space-x-6 overflow-x-auto pb-6 hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {[...Array(30)].map((_, i) => {
            const date = moment().startOf('month').add(i, 'days');
            const isPeriod = periodDates.includes(date.format('YYYY-MM-DD'));
            const intensity = isPeriod ? (i % 5) + 1 : 0;
            const bgColor = isPeriod ? `rgba(255,105,97,${0.2 + 0.2 * intensity})` : '#fce4ec';
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center px-8 py-8 rounded-2xl shadow-md text-center"
                style={{
                  backgroundColor: bgColor,
                  minWidth: '140px',
                  minHeight: '140px',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                }}
              >
                <span className="text-lg font-semibold text-pink-800">{date.format('ddd')}</span>
                <span className="text-3xl font-bold text-pink-900">{date.date()}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-pink-100 rounded-lg text-pink-800 text-center font-medium">
          {messages}
        </div>
      </div>

      {/* Section 2: Bigger Donut Cycle Phases */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-700 mb-6">Cycle Stages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
          {cyclePhases.map((phase, i) => {
            const currentValue = totalDaysSince - dayCounter + (i === stageIndex ? 1 : 0);
            const data = {
              labels: [phase.name, 'Remaining'],
              datasets: [
                {
                  data: [
                    Math.min(currentValue, phase.days),
                    phase.days - Math.min(currentValue, phase.days),
                  ],
                  backgroundColor: [i === stageIndex ? '#d6336c' : '#f78da7', '#fce4ec'],
                  borderWidth: 0,
                },
              ],
            };
            return (
              <div className="text-center w-48 h-48" key={i}>
                <Doughnut
                  data={data}
                  options={{ cutout: '70%', responsive: true, maintainAspectRatio: false }}
                />
                <p className="mt-2 text-pink-700 font-semibold">{phase.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Bar Chart for Previous Cycles */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Past 5 Months</h2>
        <div className="w-full md:w-2/3 mx-auto h-64">
          <Bar
            data={{
              labels: prevMonths.map((m) => m.month),
              datasets: [
                {
                  label: 'Cycle Length (Days)',
                  data: prevMonths.map((m) => m.length),
                  backgroundColor: '#f06292',
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: '#d6336c' },
                },
                x: {
                  ticks: { color: '#d6336c' },
                },
              },
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Track;
