const Doctor = require('../Model/Doctor');

const fetchDoctor = async (req, res) => {
    try {
        const {doctorId} = req.params;
        if (!doctorId) {
            const doctors = await Doctor.find();
        } else {
            const doctors = await Doctor.find({_id: isObjectId(doctorId)});
        }
        return res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const BookAppointment = async (req, res) => {
    
}

module.exports = {fetchDoctor};