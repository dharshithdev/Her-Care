const jwt = require("jsonwebtoken");

const checkIt = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            token = "Undefined";
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        console.log(`Something went wrong ${error}`);
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = checkIt;