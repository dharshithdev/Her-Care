const Daily = require('../Model/Daily');

const dailyMood = async (req, res) => {
    try {
        const { energy, symptoms, journal } = req.body;
        const userId = req.user.id; // Corrected

        const newMood = new Daily({
            userId,
            energy,
            symptoms,
            journal
        });
        await newMood.save();
        
        res.status(201).json({ message: "Daily check-in saved!", data: newMood });
    } catch(error) {
        console.log("Error : ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {dailyMood};