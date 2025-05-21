import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import registerImage from '../Assets/registerImage.png';
import googleLogo from '../Assets/google.png';
import appleLogo from '../Assets/apple.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.15 10.15 0 0 0 1.938 12c0 .53.026 1.06.074 1.567l1.088 3.917M16.5 15.75l1.432 1.432A9.996 9.996 0 0 1 12 19.5c-4.638 0-8.573-3.007-9.963-7.178A1.012 1.012 0 0 1 2.036 12a1.012 1.012 0 0 1 0-.639c.19-.507.426-1.003.698-1.486M21.926 12c0 .53-.026 1.06-.074 1.567l-1.088 3.917M3.25 3.25l17.5 17.5" />
    </svg>
);

const Loader = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setFormMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.recentDay1) {
            newErrors.recentDay1 = 'Recent Day 1 is required.';
        }
        if (!formData.recentDay2) {
            newErrors.recentDay2 = 'Recent Day 2 is required.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and policy.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setFormMessage({ type: '', text: '' });

        try {
            const result = await axios.post("http://localhost:5000/api/users/register", formData);
            if (result.data.status) {
                setFormMessage({ type: 'success', text: result.data.message });
                localStorage.setItem('userData', JSON.stringify(result.data.userData));
                navigate("/track");
            } else {
                setFormMessage({ type: 'error', text: result.data.message });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'An error occurred.';
            setFormMessage({ type: 'error', text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center py-8 px-4">
            <h1 className="text-5xl font-bold text-pink-600 mb-6"><Link to="/home">HerCare</Link></h1>

            <div className="max-w-6xl w-full flex items-stretch mx-auto">
                <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-10 overflow-hidden">
                    {formMessage.text && (
                        <div className={`mb-4 p-3 rounded-md text-sm text-center ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {formMessage.text}
                        </div>
                    )}

                    <h2 className="text-3xl font-bold mb-5 text-gray-800">Get Started</h2>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`} />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`} />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recent Period Days</label>
                            <div className="flex space-x-2">
                                <input type="date" id="recentDay1" name="recentDay1" value={formData.recentDay1} onChange={handleChange}
                                    className={`w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.recentDay1 ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`} />
                                <input type="date" id="recentDay2" name="recentDay2" value={formData.recentDay2} onChange={handleChange}
                                    className={`w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.recentDay2 ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`} />
                            </div>
                            {(errors.recentDay1 || errors.recentDay2) && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.recentDay1 || errors.recentDay2}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-start">
                            <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange}
                                className="mt-1 mr-2 h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-400" />
                            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                                I agree to the
                                <Link to="/terms" className="text-pink-500 hover:underline font-medium"> terms</Link> &
                                <Link to="/policy" className="text-pink-500 hover:underline font-medium"> policy</Link>.
                            </label>
                        </div>
                        {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>}

                        <button type="submit" disabled={isLoading}
                            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition flex items-center justify-center">
                            {isLoading ? <><Loader /> Registering...</> : 'Register'}
                        </button>
                    </form>

                    <div className="mt-5 flex items-center">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="mx-2 text-sm text-gray-400">or</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700">
                            <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
                            Sign in with Google
                        </button>
                        <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700">
                            <img src={appleLogo} alt="Apple" className="w-5 h-5 mr-2" />
                            Sign in with Apple
                        </button>
                    </div>

                    <p className="mt-5 text-center text-sm text-gray-600">
                        Have an account? <Link to="/login" className="text-pink-500 hover:underline font-semibold">Sign In</Link>
                    </p>
                </div>

                <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 overflow-hidden">
                    <img src={registerImage} alt="Illustration" className="object-contain" style={{ maxHeight: '85%', maxWidth: '100%' }} />
                </div>
            </div>

            <footer className="mt-8 text-center text-sm text-pink-700">
                &copy; {new Date().getFullYear()} HerCare. All rights reserved.
            </footer>
        </div>
    );
};

export default Register;
