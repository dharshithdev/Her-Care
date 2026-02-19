const { addDays, subDays, differenceInDays } = require('date-fns');

const calculateCycleData = (lastPeriodDate, avgCycle = 28, avgPeriod = 5) => {
  const start = new Date(lastPeriodDate);

  // 1. Predict Next Period Start
  const nextPeriodDate = addDays(start, avgCycle);
  
  // 2. Predict Ovulation (Standard medical calculation: 14 days before next period)
  const ovulationDate = subDays(nextPeriodDate, 14);
  
  // 3. Define the Phase Windows 
  return {
    phases: {
      menstrual: {
        start: start, 
        end: addDays(start, avgPeriod - 1)
      },
      follicular: { 
        start: addDays(start, avgPeriod), 
        end: subDays(ovulationDate, 1) 
      },
      ovulation: { 
        start: ovulationDate, 
        end: ovulationDate // Usually a 24-hour window
      },
      luteal: { 
        start: addDays(ovulationDate, 1), 
        end: subDays(nextPeriodDate, 1) 
      } 
    },
    nextPeriodDate,
    // Fertile window: 5 days before ovulation + ovulation day
    fertileWindow: { 
      start: subDays(ovulationDate, 5), 
      end: ovulationDate 
    }
  };
};

module.exports = {calculateCycleData};