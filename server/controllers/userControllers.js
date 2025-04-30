const User = require('../Model/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const {name, email, password, lastDate} = req.body;

        if(!name || !email || !password || !lastDate) {
            return res.status(400).json({message: "Please fill all the feilds"});
        } 

        const findUser = await User.findOne({email});
        if(findUser) {
            return res.status(400.).json({message: "Email already in use"});
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

        return res.status(201).json({message: "User registered Successfully"});
    } catch(error) {
        console.log("Error registering ", error);
        res.status(500).json({message: "Server Error, Please try again"});
    }
}

module.exports = { registerUser };