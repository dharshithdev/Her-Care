const Doctor = require('../Model/Doctor');

const fetchDoctor = async (req, res) => {
    try {
        const {doctorId} = req.params;
        if (!doctorId) {
            const doctors = await Doctor.find();
            return res.status(200).json(doctors);
        } else {
            const doctor = await Doctor.findById(doctorId);
            return res.status(200).json(doctor);
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const BookAppointment = async (req, res) => {
    
}

module.exports = {fetchDoctor};