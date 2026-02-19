import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCalendar, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import registerImage from '../Assets/registerImage.png';
import googleLogo from '../Assets/google.png';
import appleLogo from '../Assets/apple.png';
import api from '../Utils/axiosConfig';
import Header from '../Components/Header'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        recentDay1: '',
        recentDay2: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setFormMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required.';
        if (!formData.recentDay1) newErrors.recentDay1 = 'Start date required.';
        if (!formData.recentDay2) newErrors.recentDay2 = 'End date required.';
        if (formData.password.length < 8) newErrors.password = 'Min. 8 characters required.';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Agreement required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await api.post(`${process.env.REACT_APP_API_URL}/api/users/register`, formData);
            if (result.data.status) {
                setFormMessage({ type: 'success', text: "Welcome to Her-Care!" });  
                localStorage.setItem('token', result.data.token);  
                setTimeout(() => navigate("/track"), 1500); 
            }
        } catch (error) {
            setFormMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Adjusted padding for mobile (p-4) vs desktop (lg:p-12) */
        <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-4 sm:p-6 lg:p-12 pt-24 md:pt-32 font-sans relative overflow-x-hidden">
            
            <Header />

            {/* Background Decorative Blurs - hidden on small screens for performance */}
            <div className="hidden md:block fixed top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="hidden md:block fixed bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Main Card: flex-col on mobile, flex-row on md+ */}
            <div className="max-w-6xl w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">
                
                {/* Form Section: order-2 on mobile so form appears below if image was shown, but here image is hidden on mobile */}
                <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center border-r border-slate-50">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Join Her-Care</h2>
                            <p className="text-slate-500 font-medium italic text-sm">Start your journey today.</p>
                        </div>

                        {formMessage.text && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                                formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {formMessage.type === 'success' ? <FiCheckCircle /> : '!'} {formMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            {/* Name Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Sarah Jenkins"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium text-sm md:text-base" />
                                </div>
                                {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="sarah@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium text-sm md:text-base" />
                                </div>
                                {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email}</p>}
                            </div>

                            {/* Period Dates (Stays 2 columns on small screens, adjust gap) */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Cycle Range</label>
                                <div className="flex flex-row gap-2 md:gap-3">
                                    <div className="relative flex-1 group">
                                        <FiCalendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 pointer-events-none text-xs md:text-base" />
                                        <input name="recentDay1" type="date" value={formData.recentDay1} onChange={handleChange}
                                            className="w-full pl-8 md:pl-11 pr-2 py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium text-[10px] md:text-sm text-slate-600 uppercase" />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <FiCalendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 pointer-events-none text-xs md:text-base" />
                                        <input name="recentDay2" type="date" value={formData.recentDay2} onChange={handleChange}
                                            className="w-full pl-8 md:pl-11 pr-2 py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium text-[10px] md:text-sm text-slate-600 uppercase" />
                                    </div>
                                </div>
                                {(errors.recentDay1 || errors.recentDay2) && <p className="text-[10px] font-bold text-rose-500 ml-1">Dates are required</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium text-sm md:text-base" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.password}</p>}
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 ml-1 py-1">
                                <input name="agreeToTerms" type="checkbox" id="terms" checked={formData.agreeToTerms} onChange={handleChange}
                                    className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-rose-500 focus:ring-rose-500" />
                                <label htmlFor="terms" className="text-[11px] md:text-xs text-slate-500 font-medium cursor-pointer leading-tight">
                                    I agree to the <Link to="/terms" className="text-rose-500 font-bold hover:underline">Terms</Link> & <Link to="/policy" className="text-rose-500 font-bold hover:underline">Policy</Link>
                                </label>
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="w-full py-4 bg-slate-900 hover:bg-rose-500 text-white rounded-xl md:rounded-[1.5rem] font-black shadow-xl shadow-slate-200 hover:shadow-rose-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-sm md:text-base">
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <FiArrowRight /></>}
                            </button>
                        </form>

                        {/* Social Logins: Column on very small, row on sm+ */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-50 font-bold text-xs text-slate-600 transition-colors">
                                <img src={googleLogo} alt="G" className="w-4 h-4" /> Google
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-50 font-bold text-xs text-slate-600 transition-colors">
                                <img src={appleLogo} alt="A" className="w-4 h-4" /> Apple
                            </button>
                        </div>

                        <p className="mt-8 text-center text-xs font-medium text-slate-400">
                            Already part of Her-Care? <Link to="/login" className="text-rose-500 font-black hover:underline ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>

                {/* Editorial Image Section: Hidden on mobile */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-50/30 items-center justify-center p-12 relative overflow-hidden">
                    <img src={registerImage} alt="Wellness" className="w-full max-h-[450px] object-contain relative z-10" />
                    
                    <div className="absolute bottom-12 left-12 right-12">
                        <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm">
                            <p className="text-indigo-900/60 font-black text-[10px] uppercase tracking-widest mb-2">The Mission</p>
                            <h3 className="text-lg font-bold text-indigo-900 leading-tight italic">"Your health is your greatest wealth. Let’s track it with grace."</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;