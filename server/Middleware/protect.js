const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(400).json({message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error Occured token : ", error);
        return res.status(500).json({message: "Internal Server Error While Authorization"});
    }
}

module.exports = protect;