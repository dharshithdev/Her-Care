import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import loginImage from "../Assets/loginImage.png";
import googleLogo from '../Assets/google.png';
import appleLogo from '../Assets/apple.png';
import api from '../Utils/axiosConfig';
import Header from '../Components/Header';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setFormMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const result = await api.post(`${process.env.REACT_APP_API_URL}/api/users/login`, formData);
      if (result.data.status) {
        setFormMessage({ type: 'success', text: result.data.message });
        localStorage.setItem('token', result.data.token); 
        // Also professional to store basic user info for the UI
        localStorage.setItem('user', JSON.stringify(result.data.userData));
        setTimeout(() => navigate("/track"), 1500);
      }
    } catch (error) {
      setFormMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Connection to server failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* pt-24 on mobile, pt-32 on desktop to clear the header */
    <div className="min-h-screen bg-[#FDFCFD] flex items-center justify-center p-4 sm:p-6 lg:p-12 pt-24 md:pt-32 font-sans relative overflow-x-hidden">
      
      <Header />

      {/* Decorative Blurs - hidden on mobile for better performance */}
      <div className="hidden md:block fixed top-0 left-0 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="hidden md:block fixed bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Main Container - Adjusted rounded corners for mobile */}
      <div className="max-w-6xl w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Left Side: Hidden on Mobile, Flex on Desktop */}
        <div className="hidden md:flex md:w-1/2 bg-rose-50/50 items-center justify-center p-12 relative overflow-hidden">
            <img src={loginImage} alt="Wellness" className="w-full max-h-[500px] object-contain relative z-10" />
            <div className="absolute bottom-12 left-12 right-12">
                <p className="text-rose-900/40 font-bold text-xs uppercase tracking-[0.3em] mb-2">Philosophy</p>
                <h3 className="text-2xl font-black text-rose-900 leading-tight">Better data leads to <br/> better wellness.</h3>
            </div>
        </div>

        {/* Right Side: Form Section - Full width on mobile */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium italic text-sm md:text-base">We missed your rhythm. Log in to continue.</p>
            </div>

            {formMessage.text && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {formMessage.type === 'success' ? <FiCheck className="text-lg" /> : '!'}
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 transition-all outline-none font-medium text-sm md:text-base ${
                      errors.email ? 'ring-rose-100 placeholder:text-rose-300' : 'focus:ring-rose-50 ring-transparent'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-tighter">Forgot?</Link>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-4 transition-all outline-none font-medium text-sm md:text-base ${
                      errors.password ? 'ring-rose-100 placeholder:text-rose-300' : 'focus:ring-rose-50 ring-transparent'
                    }`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-2 ml-1">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-200 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="rememberMe" className="text-xs md:text-sm text-slate-500 font-medium cursor-pointer">Keep me logged in</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 md:py-5 bg-slate-900 hover:bg-rose-500 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl shadow-slate-200 hover:shadow-rose-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <FiArrowRight /></>}
              </button>
            </form>

            <div className="mt-8 md:mt-10">
              <div className="relative flex items-center justify-center mb-6 md:mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button className="flex items-center justify-center gap-2 py-2.5 md:py-3 border-2 border-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-50 hover:border-slate-100 transition-all font-bold text-xs md:text-sm text-slate-600">
                  <img src={googleLogo} alt="G" className="w-4 h-4" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 md:py-3 border-2 border-slate-50 rounded-xl md:rounded-2xl hover:bg-slate-50 hover:border-slate-100 transition-all font-bold text-xs md:text-sm text-slate-600">
                  <img src={appleLogo} alt="A" className="w-4 h-4" /> Apple
                </button>
              </div>
            </div>

            <p className="mt-8 md:mt-10 text-center text-xs md:text-sm font-medium text-slate-400">
              New to Her-Care? <Link to="/register" className="text-rose-500 font-black hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;