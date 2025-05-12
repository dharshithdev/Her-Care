const User = require("../Model/User");
const Address = require("../Model/Address");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()

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
        return res.status(200).json({status: true, message: "Data fetched Successfully", userData: gotUser});

    } catch (error) {
        console.log(`Internal server Error`);
        return res.status(500).json({status: false, message: "Inernal serval Error"});
    }
}

const registerUser =  async (req, res) => {
    try{
        const {name, email, password, lastDate} = req.body;

        if(!name || !email || !password || !lastDate) {
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
            password: hashedPassword,
            lastDate
        });
    
        await newUser.save();
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