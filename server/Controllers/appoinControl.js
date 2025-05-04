const Appoinment = require("../Model/Appoinment");

const bookAppoinment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {doctorId, dateSelected, timeSelected} = req.body;

        if(!dateSelected || !timeSelected) {
            return res.status(400).json({message: "Fill the feilds completely"});
        }


        const existingAppoinment = await Appoinment.find({doctorId, dateSelected, timeSelected, status:"Appoinment Fixed"});
        console.log(existingAppoinment);
        if(existingAppoinment.length > 0) {
            return res.status(400).json({message:"No appoinment available, [slot ciomplete]"});
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

const cancelAppoinment = async (req, res) => {
    try {
        userId = req.user.id;
        const {appoinmentId} = req.body;

        if(!appoinmentId) {
            return res.status(400).json("No Appoinment seclected to cancel");
        }

        const cancelledAppoinment = await Appoinment.findByIdAndUpdate(
            appoinmentId,
            {status : "Cancelled"},
            {new: true}
        );


        if(!cancelledAppoinment) {
            return res.status(400).json({message: "Failed to fetch Appoinment"});
        }

        return res.status(200).json({message: "Appoinment Cancelled Successfully"});
    } catch (error) {
        console.log(`Cannot Cancel Appoinment ${error}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const changeDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const {appoinmentId, dateSelected, timeSelected} = req.body;

        if(!appoinmentId) {
            return res.status(400).json({message: "No Appoinment found to change date"});
        }

        const existingAppoinment = await Appoinment.find({doctorId, dateSelected, timeSelected, status:"Appoinment Fixed"});
        console.log(existingAppoinment);
        if(existingAppoinment.length > 0) {
            return res.status(400).json({message:"Slot Taken, cannot fix appoinment"});
        }

        const changedAppoinment = await Appoinment.findByIdAndUpdate(
            appoinmentId,
            {dateSelected, timeSelected},
            {new: true}
        );

        if(!changedAppoinment) {
            return res.status(400).json({message: "Failed to Change the date "});
        }

        return res.status(201).json({message: "Date changed Successfully"});

    } catch(error) {
        console.log(`Error Occured while Updating details ${error}`);
        return res.status(500).json({message: "Internal server Error"});
    }
}

module.exports = {bookAppoinment, cancelAppoinment, changeDate};