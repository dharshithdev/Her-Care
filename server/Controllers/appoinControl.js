const Appoinment = require("../Model/Doctor");

const bookAppoinment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {doctorId, dateSelected, timeSelected} = req.body;

        if(!dateSelected || !timeSelected) {
            return res.status(400).json({message: "Fill the feilds completely"});
        }

        const newAppoinment = new Appoinment({
            doctorId,
            patientId : userId,
            dateSelected,
            timeSelected
        });

        await newAppoinment.save();

        return res.status(201).json({message: "Appoinment Booked", newAppoinment});
    } catch (error) {
        console.log(`Error Booking Appoinment $${error.message}`);
    }
};

module.exports = {bookAppoinment};