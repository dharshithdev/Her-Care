import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { FiMapPin, FiStar, FiClock, FiDollarSign } from 'react-icons/fi';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/appointments/get-doctors', {
                headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(res.data); 
                setLoading(false);
            } catch (err) {
                console.error("Error fetching doctors", err);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500">FINDING SPECIALISTS...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <MainHeader />
            
            <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Consult with Specialists</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                        Connect with top-rated Gynecologists and reproductive health experts to discuss your cycle, health, and wellness.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {doctors.map((doc) => (
                        <div key={doc._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                            {/* Doctor Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={doc.image || "https://via.placeholder.com/300"} 
                                    alt={doc.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-rose-500">
                                    <FiStar className="fill-current" /> {doc.rating}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-slate-800 mb-1">{doc.name}</h3>
                                <p className="text-rose-500 font-bold text-sm uppercase tracking-wider mb-4">{doc.specialization}</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                                        <FiMapPin /> <span>{doc.location}</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-rose-500 transition-colors duration-300 active:scale-95">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DoctorsPage;