import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MainHeader from '../Components/MainHeader';

const BookAppointment = () => {
    const { doctorId } = useParams(); // Grabs ID from /book/:doctorId
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDoctorDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                // Calling the SAME function you wrote, passing the ID
                const res = await axios.get(`http://localhost:5000/api/appointments/get-doctors/${doctorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctor(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching doctor details", err);
                setLoading(false);
            }
        };
        getDoctorDetails();
    }, [doctorId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500 uppercase tracking-widest">Loading Doctor Profile...</div>;
    if (!doctor) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Doctor not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <MainHeader />
            <div className="max-w-4xl mx-auto pt-32 px-4">
                <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10">
                    <img src={doctor.image} alt={doctor.name} className="w-48 h-48 rounded-[2rem] object-cover shadow-lg" />
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">{doctor.name}</h1>
                        <p className="text-rose-500 font-bold uppercase tracking-widest mt-2">{doctor.specialization}</p>
                        <p className="mt-6 text-slate-500 leading-relaxed font-medium">{doctor.about}</p>
                        
                        {/* Booking UI can go here */}
                        <div className="mt-8 p-6 bg-rose-50 rounded-2xl">
                            <p className="font-bold text-rose-600">Available: {doctor.availableDays?.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;