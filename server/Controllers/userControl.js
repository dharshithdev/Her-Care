const User = require("../Model/User");
const Cycle = require("../Model/Cycle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {calculateCycleData} = require('../Utils/CycleLogic');
const { differenceInDays } = require('date-fns');
require("dotenv").config()

const registerUser = async (req, res) => {
  try {
    const { name, email, password, recentDay1, recentDay2 } = req.body;

    if (!name || !email || !password || !recentDay1 || !recentDay2) {
       return res.status(400).json({ status: false, message: "All fields required" });
    }

    // 2. Calculate baseline cycle length
    // If recentDay1 is Feb 1 and recentDay2 is Jan 1, length is 31 days
    const d1 = new Date(recentDay1);
    const d2 = new Date(recentDay2);
    const initialCycleLength = Math.abs(differenceInDays(d1, d2));
    // 3. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avgCycleLength: initialCycleLength || 28 // Fallback to 28 if math fails
    });

    // 4. Save the "Logs" - Store both provided dates as real history
    await Cycle.insertMany([ 
      { userId: newUser._id, startDate: d2 },
      { userId: newUser._id, startDate: d1 }
    ]);

    // 5. JWT and Response
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    return res.status(201).json({ 
      status: true,  
      token, 
      userData: { id: newUser._id, name: newUser.name } 
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const userLogIn = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({status: false, message: "Please enter all the feilds"});
        }

        const gotUser = await User.findOne({email});

        if(gotUser) {
            const userPassword = gotUser.password;
            const passwordMatch = await bcrypt.compare(password, userPassword);

            if(passwordMatch) {
                const token = jwt.sign({id: gotUser._id, email: gotUser.email}, process.env.JWT_SECRET, {expiresIn: '5h'});
                return res.status(201).json({status: true, message: "Log In successfull", token: token, userData: {_id : gotUser._id, name : gotUser.name}});
            } else {
                return res.status(400).json({status: false, message: "Invalid Credintails"});
            }
        } else {
            return res.status(404).json({status: false, message: "Cannot find your account"});
        }
        
    } catch(err) {
        console.log("Error : ", err);
        return res.status(500).json({status: false, message: "Interbal Server Error"});
    }
} 

const getTrackingData = async (req, res) => {
  const userId = req.user.id; //Middleware

  const user = await User.findById(userId);
  
  // 2. Get the most recent period start date
  const history = await Cycle.find({ userId }).sort({ startDate: -1 }).limit(6);
  const lastCycle = history[0];

  if (!lastCycle) return res.status(404).json({ message: "No data found" }); 

  // 3. Calculate current status on-the-fly
  const prediction = calculateCycleData(
    lastCycle.startDate, 
    user.avgCycleLength, 
    user.avgPeriodLength
  );

  // 4. Determine current phase based on TODAY's date
  const today = new Date();
  let currentPhase = "Luteal"; // Default
  
  if (today >= prediction.phases.menstrual.start && today <= prediction.phases.menstrual.end) currentPhase = "Menstrual";
  else if (today <= prediction.phases.follicular.end) currentPhase = "Follicular";
  else if (today <= prediction.phases.ovulation.end) currentPhase = "Ovulation";

  const fullCycleData = history.map(c => ({
        month: c.startDate.toLocaleString("en-US", { month: "long" }).toUpperCase(),
        startDate: c.startDate.toLocaleDateString(),
        cycleLength: user.avgCycleLength // or calculate actual if you have endDate
    })); 

  res.json({
    currentPhase,
    nextPeriodIn: differenceInDays(prediction.nextPeriodDate, today),
    prediction,
    fullCycleData
  });
};

const logActualPeriod = async (req, res) => {
    try {
        const { actualStartDate } = req.body; // e.g., "2026-03-15"
        const userId = req.user.id; // From your Auth middleware

        // 1. Get the user and their most recent log
        const user = await User.findById(userId);
        const lastCycle = await Cycle.findOne({ userId }).sort({ startDate: -1 });

        if (!lastCycle) {
            return res.status(404).json({ message: "No previous cycle found to compare." });
        }

        // 2. Calculate the NEW cycle length (Days between last period and today)
        const newMeasuredLength = differenceInDays(new Date(actualStartDate), new Date(lastCycle.startDate));

        // 3. Update the Rolling Average
        // Formula: (Old Average + New Length) / 2 
        // Note: You could make this more complex by weighted averaging 3-6 months
        const updatedAvg = Math.round((user.avgCycleLength + newMeasuredLength) / 2);

        // 4. Save the updated average to the User model
        user.avgCycleLength = updatedAvg;
        await user.save();

        // 5. Create the new Cycle log
        const newLog = new Cycle({
            userId,
            startDate: actualStartDate,
            isPredicted: false // This is a real data point!
        });
        await newLog.save();

        return res.status(200).json({
            status: true,
            message: "Cycle updated successfully!",
            newAverage: updatedAvg,
            nextPeriodPredicted: updatedAvg // Send this back so UI can update
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Server error updating cycle." });
    }
};

module.exports = {registerUser, userLogIn, getTrackingData, logActualPeriod};