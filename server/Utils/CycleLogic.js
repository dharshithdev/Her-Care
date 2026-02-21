const { addDays, subDays, differenceInDays } = require('date-fns');

const calculateCycleData = (lastPeriodDate, avgCycle = 28, avgPeriod = null) => {
  const start = new Date(lastPeriodDate);

  // 1. Predict Next Period Start
  const nextPeriodDate = addDays(start, avgCycle);
  
  // 2. Predict Ovulation (Standard medical calculation: 14 days before next period)
  const ovulationDate = subDays(nextPeriodDate, 14);

  let menstrualDays = findMenstrualLength(avgCycle);

  // 3. Define the Phase Windows 
  return { //41
    phases: {
      menstrual: {
        start: start,
        end: addDays(start, menstrualDays - 1),
        total: menstrualDays
      },
      follicular: { 
        start: addDays(start, menstrualDays), 
        end: subDays(ovulationDate, 1),
        total: avgCycle - (menstrualDays + 15) 
      },
      ovulation: { 
        start: ovulationDate, 
        end: ovulationDate, // Usually a 24-hour window
        total: 1
      },
      luteal: { 
        start: addDays(ovulationDate, 1), 
        end: subDays(nextPeriodDate, 1),
        total: 14 
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

const findMenstrualLength = (avgCycle) => {
  let menstrualDays;
  if(avgCycle < 25) {
    menstrualDays = 4;
  } else if (avgCycle >= 25 && avgCycle <= 34) {
    menstrualDays = 5;
  } else if(avgCycle >= 35 && avgCycle <= 40) {
    menstrualDays = 6;
  } else {
    menstrualDays = 7;
  }
  return menstrualDays;
}  

module.exports = {calculateCycleData, findMenstrualLength};