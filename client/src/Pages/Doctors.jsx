import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/get-doctors`, {
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
            
            <div className="max-w-7xl mx-auto px-4 pt-24 lg:pt-32 pb-20">
                <header className="mb-12 text-center px-4">
                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Consult Specialists</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm lg:text-base">
                        Connect with top-rated Gynecologists to discuss your health and wellness.
                    </p>
                </header>

                {/* Grid adjusted for mobile: 1 col, tablet: 2 col, laptop: 4 col */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doc) => (
                        <div key={doc._id} className="bg-white rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
                            
                            {/* Doctor Image Area */}
                            <div className="relative h-56 lg:h-64 overflow-hidden shrink-0">
                                <img 
                                    src={doc.image || "https://via.placeholder.com/300"} 
                                    alt={doc.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-rose-500 shadow-sm">
                                    <FiStar className="fill-current" /> {doc.rating || '4.5'}
                                </div>
                            </div>

                            {/* Info Area - Flex grow ensures uniform height */}
                            <div className="p-6 lg:p-8 flex flex-col flex-grow">
                                <div className="flex-grow">
                                    {/* Line clamp ensures name doesn't break the layout if it's crazy long */}
                                    <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-1 leading-tight line-clamp-2 min-h-[3rem] lg:min-h-[3.5rem]">
                                        {doc.name}
                                    </h3>
                                    
                                    <p className="text-rose-500 font-bold text-[10px] lg:text-xs uppercase tracking-wider mb-3">
                                        {doc.specialization}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-slate-500 text-xs lg:text-sm mb-6">
                                        <FiMapPin className="shrink-0" /> 
                                        <span className="truncate">{doc.location}</span>
                                    </div>
                                </div>

                                {/* Button is now anchored at the bottom of the card */}
                                <button onClick={() => navigate(`/bookappointment/${doc._id}`)} className="w-full py-3.5 lg:py-4 bg-slate-900 text-white rounded-xl lg:rounded-2xl text-sm font-bold hover:bg-rose-500 transition-colors duration-300 active:scale-95 shrink-0">
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