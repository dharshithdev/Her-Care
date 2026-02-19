import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from '../Components/MainHeader';
import { FiCalendar, FiClock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import SuccessOverlay from '../Components/Overlay';

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Data States
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Booking States
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [booking, setBooking] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [shake, setShake] = useState(false);

    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

    useEffect(() => {
        const getDoctorDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/appointments/get-doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctor(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching doctor", err);
                setLoading(false);
            }
        };
        getDoctorDetails();
    }, [id]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
            return;
        }
        
        setBooking(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/appointments/book-appointment`, 
                { doctorId: id, date: selectedDate, time: selectedTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setShowSuccess(true);
            setTimeout(() => navigate('/appointments'), 2800);
        } catch (err) {
            alert("Booking failed. Please check your connection.");
            setBooking(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full mb-4"
            />
            <p className="font-black text-rose-500 uppercase tracking-widest">Loading Profile</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <MainHeader />
            <SuccessOverlay isVisible={showSuccess} />

            <div className="max-w-6xl mx-auto pt-32 pb-20 px-4">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold mb-8 transition-colors group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Doctors
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT: Doctor Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-4 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 sticky top-32"
                    >
                        <div className="relative inline-block mx-auto mb-6 left-1/2 -translate-x-1/2">
                            <img src={doctor.image} alt={doctor.name} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-xl" />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                                <FiCheckCircle />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-slate-900 leading-tight">{doctor.name}</h2>
                            <p className="text-rose-500 font-bold text-xs uppercase tracking-widest mt-2 bg-rose-50 inline-block px-3 py-1 rounded-full">
                                {doctor.specialization}
                            </p>
                            <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                                {doctor.about || "Dedicated to providing compassionate care and personalized health solutions for every patient."}
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT: Booking Flow */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 space-y-6"
                    >
                        <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                            
                            {/* Date Section */}
                            <section className="mb-12">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center text-sm">01</span>
                                    Choose Date
                                </h3>
                                <input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-rose-200 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer"
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </section>

                            {/* Time Section */}
                            <section className="mb-12">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center text-sm">02</span>
                                    Select Time Slot
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {timeSlots.map((slot) => (
                                        <motion.button 
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`py-5 rounded-[1.5rem] font-bold text-sm transition-all border-2 ${
                                                selectedTime === slot 
                                                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' 
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-rose-200'
                                            }`}
                                        >
                                            {slot}
                                        </motion.button>
                                    ))}
                                </div>
                            </section>

                            {/* Action Button */}
                            <motion.button 
                                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                onClick={handleBooking}
                                disabled={booking}
                                className={`w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${
                                    booking ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-rose-600 shadow-xl'
                                }`}
                            >
                                {booking ? (
                                    <motion.div 
                                        animate={{ rotate: 360 }} 
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-6 h-6 border-4 border-slate-300 border-t-slate-600 rounded-full"
                                    />
                                ) : (
                                    <>Confirm Booking <FiCheckCircle className="text-xl" /></>
                                )}
                            </motion.button>
                            
                            {!selectedDate && !selectedTime && (
                                <p className="text-center text-slate-400 text-xs mt-4 font-medium uppercase tracking-widest">
                                    Please complete both steps above
                                </p>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default BookAppointment;