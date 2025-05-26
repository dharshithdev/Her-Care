const User = require("../Model/User");
const Address = require("../Model/Address");
const Cycle = require("../Model/Cycle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { differenceInDays, parseISO, addDays } = require('date-fns');
require("dotenv").config()

const phaseCycleLength = {
    short: { menstrual: 4, follicular: 7, ovulation: 1, luteal: 12 },
    average: { menstrual: 5, follicular: 10, ovulation: 1, luteal: 14 },
    long: { menstrual: 6, follicular: 14, ovulation: 1, luteal: 16 }
};

const findCycle = (cycleLengthDays) => {
    var cycleLength = phaseCycleLength.short;
    if(cycleLengthDays >= 21 && cycleLengthDays <= 25) {
        cycleLength = phaseCycleLength.short;
    } else if (cycleLengthDays >= 26 && cycleLengthDays <= 30) {
        cycleLength = phaseCycleLength.average;
    } else if(cycleLengthDays > 31 && cycleLengthDays <= 35) {
        cycleLength = phaseCycleLength.long;
    } else {
        cycleLength = "irregular";
    }
    return (cycleLength);
}

const findLength = async (start, end, userId) => {
    const st = parseISO(start);
    const en = parseISO(end);
    const cycleLengthDays = differenceInDays(en, st);
    const totalCycleCount = await Cycle.countDocuments({userId});
    console.log(cycleLengthDays, totalCycleCount);
    if(totalCycleCount <= 3) {
        return [cycleLengthDays, findCycle(cycleLengthDays)];
    } else {
        calculateLength(userId);
    }
}

const calculateLength = async (userId) => {
    const cycles = await Cycle.find({ userId });

    const totalCycleLength = cycles.reduce((sum, cycle) => sum + cycles.cycleLength, 0);
    const totalMenstrualLength = cycles.reduce((sum, cycle) => sum + cycles.menstrualLength, 0);
    const totallutealLength = cycles.reduce((sum, cycle) => sum + cycles.lutealLength, 0);

    const fixedMenstrualLength = Math.round(totalMenstrualLength / cycles.length);
    const fixedLutealLength = Math.round(totallutealLength / cycles.length);
    const fixedFollicularLength = Math.round((totalCycleLength / cycles.length) - (fixedLutealLength + fixedMenstrualLength));
    const fixedOvulationLength = 1;

    const c_length = findCycle(totalCycleLength);
    c_length.menstrual = fixedFollicularLength;
    c_length.follicular = fixedFollicularLength;
    c_length.ovulation = fixedOvulationLength;
    c_length.luteal = fixedLutealLength;

    return [totalCycleLength, c_length];
}

const updateDate = async (userId, lastDate, cycleCount, phaseDatas) => {
    const futureDate = addDays(lastDate, cycleCount);
    if (new Date() > futureDate) {
        // Insert into db new cycle data
        const month = new Date(lastDate);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        const expectedDate = addDays(date, cycleCount);
        const newCycle = new Cycle({
            userId, 
            cycleLength: cycleCount,
            menstrualLength: phaseDatas.menstrual,
            follicularLength: phaseDatas.follicular,
            ovulationLength: phaseDatas.ovulationLength,
            lutealLength: phaseDatas.lutealLength,
            recentDay: lastDate,
            expectedDate,
            month
        });

        await newCycle.save();
        
        if(newCycle) {
            res.status(200).json({message: "Date Updated"});
        }
    }
}

const fetchUserData = async (req, res) => {
    try {

        const {userId} = req.body;
        if(!userId) {
            return res.status(400).json({status: false, message: "Invalid user Id"});
        }

        const gotUser = await User.findOne({_id: userId});
        if(!gotUser) {
            return res.status(404).json({status: false, message: "No data found on User"});
        }

        const totalCycleCount = await Cycle.countDocuments({userId: gotUser._id});
        const lastRecord = await Cycle.findOne({ userId }).sort({ createdAt: -1 }); // Fetch latest document 

        const periodData = findLength(recentDay, recentDay2, gotUser._id);

        updateDate(userId, lastRecord.recentDay, periodData[0], periodData[1]);

        return res.status(200).json({status: true, message: "Data fetched Successfully", userData: gotUser, periodsData: periodData, lastRecord: lastRecord});

    } catch (error) {
        console.log(`Internal server Error`);
        return res.status(500).json({status: false, message: "Inernal serval Error"});
    }
}

const addUnexpectedPeriod = async (req, res) => {
    const {userId, lastDate} = req.body;
    const date =  new Date(recentDay)
    const expectedDate = addDays(date, cycleLength);
    const monthName = date.toLocaleString("en-US", { month: "long" });
    const periodData = findLength(lastDate, date, userId)
    const newCycle = new Cycle({
        userId,
        cycleLength: periodData[0],
        menstrualLength: periodData[1].menstrual,
        follicularLength: periodData[1].follicular,
        ovulationLength: periodData[1].ovulation,
        lutealLength: periodData[1].luteal,
        regularity: "irregular",
        addUnexpected: true,
        recentDay: lastDate,
        expectedDate,
        month: monthName
    });

    await newCycle.save();

    if(newCycle) {
        res.status(200).json({message: "Cycle Updated Successfully"});
    }
}

const registerUser =  async (req, res) => {
    try{
        const {name, email, password, recentDay1, recentDay2} = req.body;
        console.log(name, email, password, recentDay1, recentDay2);
        if(!name || !email || !password || !recentDay1 || !recentDay2) {
            return res.status(400).json({status: false, message: "Please fill all the feilds"});
        }
    
        const findUser = await User.findOne({email});
        if(findUser) {
            console.log("Email already in Use");
            return res.status(400).json({status: false, message: "Email already registered"});
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
    
        await newUser.save();

        const periodData = await findLength(recentDay2, recentDay1, newUser._id);
        console.log('Here : ', periodData);
        const cycleLength = periodData[0];
        const date =  new Date(recentDay1)
        const expectedDate = addDays(date, cycleLength);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        const newCycle = new Cycle({
            userId: newUser._id,
            cycleLength,
            menstrualLength: periodData[1].menstrual,
            follicularLength: periodData[1].follicular,
            ovulationLength: periodData[1].ovulation,
            lutealLength: periodData[1].luteal,
            recentDay : recentDay1,
            expectedDate,
            month: monthName
        });

        await newCycle.save();

        if(!newUser || !newCycle) {
            return res.status(400).json({message: "Registration Failed"});
        }

        const toStore = {_id : newUser._id, email : newUser.email};
        const token = jwt.sign({id: newUser._id, email: newUser.email}, process.env.JWT_SECRET, {expiresIn: '24h'});
        return res.status(201).json({status: true, message: "Registration Success",token : token, userData: toStore});
    
    } catch(error) {
        console.log(`Error registering : ${error}`);
        return res.status(500).json({status: false, message: "Server Error"});
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
                return res.status(201).json({status: true, message: "Log In successfull", token: token, userData: {_id : gotUser._id, email : gotUser.email}});
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


const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {name, email, phone} = req.body;
        console.log("Got")
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {name, email, phone},
            {new: true}
        );

        if(!updatedUser) {
            return res.status(404).json({messge: "User Not found"});
        }
        res.status(201).json({message: "Profile updated", user: updatedUser});
    } catch(error) {
        console.log("Server Error");
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {address} = req.body;
        const {state, pin, landmark} = address || {};

        if(!state || !pin || !landmark) {
            return res.status(400).json({message: "Please fill the feilds"})
        }

        const newAddress = new Address({
            userId,
            address: {
                state,
                pin,
                landmark
            }
        });

        await newAddress.save();
        return res.status(201).json({message: "Address Successfull Added"});

    } catch(error) {
        console.log("Error");
        return res.status(400).json({message: "Internal Server Error"});
    }
}

const updateAddress = async (req, res) => {
    try {

        const userId = req.user.id;
        const {addressId, state, pin, landmark} = req.body;

        if(!addressId || !state || !pin || !landmark) {
            return res.status(400).json({message: "Please Fill all the feilds"});
        }

        const useAddress = {
            address: {
                state: state,
                pin: pin,
                landmark: landmark
            }
        }

        const updateAddress = await Address.findByIdAndUpdate(
            addressId,
            useAddress,    
            {new: true}  
        )

        if(updateAddress) {
            return res.status(201).json({message: "Updated Successfully"});
        }

    } catch(error) {
        console.log('Error Occured');
        return res.status(400).json({message: "Internal Server Error"});
    }
}

module.exports = {registerUser, userLogIn, updateProfile, addAddress, updateAddress, fetchUserData};