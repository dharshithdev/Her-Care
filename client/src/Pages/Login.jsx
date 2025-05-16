import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from "../Assets/loginImage.png"; // Ensure this path is correct
import googleLogo from '../Assets/google.png'; // Ensure this path is correct
import appleLogo from '../Assets/apple.png'; // Ensure this path is correct
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.15 10.15 0 0 0 1.938 12c0 .53.026 1.06.074 1.567l1.088 3.917M16.5 15.75l1.432 1.432A9.996 9.996 0 0 1 12 19.5c-4.638 0-8.573-3.007-9.963-7.178A1.012 1.012 0 0 1 2.036 12a1.012 1.012 0 0 1 0-.639c.19-.507.426-1.003.698-1.486M21.926 12c0 .53-.026 1.06-.074 1.567l-1.088 3.917M3.25 3.25l17.5 17.5M10.5 10.5c.732-.732 1.803C11.068 8.732 12.932 8.732 12 10.5 13.068 11.068 11.068 12.932 10.5 12Z" />
  </svg>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate(); // Initialize the navigation function
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
    setFormMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    if (!validateForm()) {
      return;
    } 
    setIsLoading(true);
 
    try {
          const result = await axios.post("http://localhost:5000/api/users/login", formData)
          if(result.data.status) {
            setFormMessage({ type: 'success', text: result.data.message});
            localStorage.setItem('userData', JSON.stringify(result.data.userData));
            navigate("/track");
          }
    } catch (error) {
      if(error.response) {
        setFormMessage({ type: 'error', text: error.response.data.message});
      } else if (error.request) {
        setFormMessage({ type: 'error', text: 'No response from the server' });
      } else {
        setFormMessage({ type: 'error', text: 'Something upexpected happened' });
      }
    } finally {
      setIsLoading(false);
    }
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-5xl font-bold text-pink-600 mb-6">HerCare</h1>

      {/* Main container for side-by-side layout, NO SHADOW OR ROUNDING HERE */}
      {/* flex-col-reverse md:flex-row to keep image first on md, form first in DOM for mobile (image shown separately on mobile) */}
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-stretch mx-auto">
        
        {/* Left side - Image Container (for md screens and up) */}
        {/* This div is now just for layout and spacing for the image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 overflow-hidden">
          <img
            src={loginImage} 
            alt="Calm illustration related to women's health and time management"
            className="object-contain" // Changed from object-cover to ensure full image visibility
            style={{
              maxHeight: '85%', // Reduced image size
              maxWidth: '100%',  // Ensures image fits within padded container
            }}
          />
        </div>

        {/* Right side - Form: This is the self-contained card */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-10 overflow-hidden">
          {/* Mobile Image: Shown only on small screens, above the form content */}
          <div className="block md:hidden w-full mb-6">
            <img
              src={loginImage} 
              alt="Calm illustration related to women's health and time management"
              className="w-full h-auto object-cover rounded-lg" 
            />
          </div>
                {formMessage.text && (
              <div 
                className={`mb-4 p-3 rounded-md text-sm w-full max-w-md text-center ${
                  formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
                role="alert"
                aria-live="polite"
              >
                {formMessage.text}
              </div>
            )}
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome back!</h2>
          <p className="text-sm text-gray-600 mb-6">Sign in to access your HerCare account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-pink-500 hover:text-pink-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-400 transition-colors"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-pink-400 hover:bg-pink-600 text-white font-semibold transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-sm text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 ease-in-out text-sm text-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1">
              <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 ease-in-out text-sm text-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1">
              <img src={appleLogo} alt="Apple" className="w-5 h-5 mr-2" />
              Sign in with Apple
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-pink-500 hover:text-pink-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm text-pink-700">
        &copy; {new Date().getFullYear()} HerCare. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;