const Appointment = require('../Model/Appointment');
const Doctor = require('../Model/Doctor');
const mongoose = require('mongoose');

const fetchDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const doctors = await Doctor.find();
            return res.status(200).json(doctors);
        } else {
            const doctor = await Doctor.findById(id);
            return res.status(200).json(doctor);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const userId = req.user.id; // Pulled from the 'protect' middleware

        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: "Please provide all details" });
        }

        const newAppointment = new Appointment({
            doctorId,
            userId,
            date,
            time
        });

        await newAppointment.save();
        return res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.log('Error : ', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


const viewAppointment = async (req, res) => {
    try{
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({message: "Invalid ID"});
        }

        const appointment = await Appointment.findById(id);
        return res.status(200).json(appointment);
    } catch(error) {
        console.log('Server error', error.message);
        return res.status(500).json({mesage: "Internal Server error "});
    }
}

const cancelAppointment = async (req, res) => {
    try{
        const {id} = req.params;
        if (!id)  {return res.status(400).json({message: "Invalid ID"});}
        let state = 'Cancelled';
        const cancelledAppointment = Appointment.findByIdAndUpdate(
            id,
            {status: state},
            {returnDocument: 'after', runValidators: true}
        );

        if(cancelAppointment) {
            return res.status(200).json({message: "Appointment Cancelled"});
        }
    } catch(error) {
        console.log('Internal Server Error');
        return res.status(500).json({message: "Internal Server error"});
    }
}

module.exports = {fetchDoctor, bookAppointment, cancelAppointment};