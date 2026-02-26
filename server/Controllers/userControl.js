const User = require("../Model/User");
const Cycle = require("../Model/Cycle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require('../Model/Order');
const Appointment = require('../Model/Appointment');
const Pregnant = require('../Model/Pregnant');
const {calculateCycleData, findMenstrualLength} = require('../Utils/CycleLogic');
const { differenceInDays, startOfDay, format } = require('date-fns'); 
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
      avgCycleLength: initialCycleLength || 28, // Fallback to 28 if math fails
      avgPeriodLength: findMenstrualLength(initialCycleLength) || 5  
    });

    // 4. Save the "Logs" - Store both provided dates as real history
    await Cycle.insertMany([ 
      { userId: newUser._id, startDate: d2 },
      { userId: newUser._id, startDate: d1 }
    ]);

    // 5. JWT and Response
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
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
    try {
          const userId = req.user.id; //Middleware

          const user = await User.findById(userId);

          // 2. Get the most recent period start date
          const history = await Cycle.find({ userId }).sort({ startDate: -1 }).limit(6); 
          const lastCycle = history[0];

          if (!lastCycle) return res.status(404).json({ message: "No data found" }); 

          // 3. Calculate current status on-the-fly
          const prediction = calculateCycleData(
            format(lastCycle.startDate, 'yyyy-MM-dd'), 
            user.avgCycleLength, 
            user.avgPeriodLength
          );
      
          // 4. Determine current phase based on TODAY's date
          const today = format(new Date(), 'yyyy-MM-dd');

          const menstrualStart = format(prediction.phases.menstrual.start, 'yyyy-MM-dd');
          const menstrualEnd = format(prediction.phases.menstrual.end, 'yyyy-MM-dd');
          const follicularEnd = format(prediction.phases.follicular.end, 'yyyy-MM-dd');
          const ovulationEnd = format(prediction.phases.ovulation.end, 'yyyy-MM-dd');
      
          let currentPhase = "Luteal";
        if (today >= menstrualStart && today <= menstrualEnd) {
            currentPhase = "Menstrual";
        } else if (today <= follicularEnd) {
            currentPhase = "Follicular";
        } else if (today <= ovulationEnd) {
            currentPhase = "Ovulation";
        }
      
          const fullCycleData = history.map(c => ({
                month: c.startDate.toLocaleString("en-US", { month: "long" }).toUpperCase(),
                startDate: c.startDate.toLocaleDateString(),
                cycleLength: user.avgCycleLength // or calculate actual if you have endDate
            })); 
            res.json({
            currentPhase,
            nextPeriodIn: differenceInDays((prediction.nextPeriodDate), today),
            prediction, 
            fullCycleData,
            avgCycleLength : user.avgCycleLength,
            pregnant: user.pregnant
          });
    } catch(error) {
        console.log("Error ", error);
        return res.status(500).json({message: "Internal Server Error"});
    }

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

const getUserProfile = async (req, res) => { 
    try {
        console.log('Here');
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
        console.log(orders);
        return res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id }).sort('date');
        return res.json(appointments);
    } catch (error) {
        console.log('Here 2 : ', error.message);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

const startPregnancy = async (req, res) => {
try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        // 1. Get the most recent cycle start
        const latestCycle = await Cycle.findOne({ userId, isPredicted: false })
            .sort({ startDate: -1 });

        if (!latestCycle) return res.status(400).json({ message: "No cycle data." });

        const lmpDate = latestCycle.startDate;

        // CycleLength - 14
        const cycleLength = user.avgCycleLength || 28; 
        const daysToOvulation = cycleLength - 14;

        const conceptionDate = new Date(lmpDate);
        conceptionDate.setDate(conceptionDate.getDate() + daysToOvulation);

        // but some doctors adjust for long cycles: (LMP + 280) + (cycleLength - 28)
        const dueDate = new Date(lmpDate);
        const adjustment = cycleLength - 28;
        dueDate.setDate(dueDate.getDate() + 280 + adjustment);

        const newPregnancy = new Pregnant({
            userId,
            lmpDate,
            dueDate,
            conceptionDate,
            status: 'active'
        });

        await newPregnancy.save();
        await User.findByIdAndUpdate(userId, { pregnant: true });

        res.status(201).json({ message: "Success", data: newPregnancy });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPregencyTrackingData = async(req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user.pregnant) {
            return res.status(200).json({ isPregnant: false });
        }

        const pregnantDetails = await Pregnant.findOne({ userId }).sort({ lmpDate: -1 });

        if (!pregnantDetails) {
            return res.status(404).json({ message: "No pregnancy record found." });
        }

        // We wrap the data to match the "prediction" prop shape in your PregnancyView
        return res.status(200).json({
            isPregnant: true, 
            prediction: {
                phases: {
                    menstrual: { start: pregnantDetails.lmpDate }
                },
                fertileWindow: {
                    // Logic: Conception usually happens in a 5-day window
                    start: new Date(new Date(pregnantDetails.conceptionDate).setDate(pregnantDetails.conceptionDate.getDate() - 3)),
                    end: new Date(new Date(pregnantDetails.conceptionDate).setDate(pregnantDetails.conceptionDate.getDate() + 1))
                },
                dueDate: pregnantDetails.dueDate
            }
        });
    } catch(error) {
        console.log('Error : ', error.message);
        return res.status(500).json({ message: "Internal server error!" });
    }
}

module.exports = {registerUser, userLogIn, getTrackingData, logActualPeriod, getUserProfile, getUserOrders,
                getUserAppointments, startPregnancy, getPregencyTrackingData
};