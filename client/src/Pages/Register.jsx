import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom

// Asset imports (ensure these paths are correct for your project structure)
import registerImage from '../Assets/registerImage.jpeg';
import googleLogo from '../Assets/google.png';
import appleLogo from '../Assets/apple.png';

// Simple Eye Icon SVGs for password visibility
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


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' }); // For success/error after submit

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
    // Clear global form message
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
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and policy.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' }); // Clear previous message
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call (replace with your actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    // Example success/error handling
    const isSuccess = Math.random() > 0.5; // Simulate success or failure
    if (isSuccess) {
        setFormMessage({ type: 'success', text: 'Registration successful! Welcome to HerCare.' });
        // Optionally reset form:
        // setFormData({ name: '', email: '', password: '', agreeToTerms: false });
        // setErrors({});
    } else {
        setFormMessage({ type: 'error', text: 'Registration failed. An unexpected error occurred. Please try again.' });
    }

    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-pink-200 flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-5xl font-bold text-pink-600 mb-6">HerCare</h1>
      
      {formMessage.text && (
        <div 
          className={`mb-4 p-3 rounded-md text-sm w-full max-w-md text-center ${
            formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          role="alert"
          aria-live="polite" // Informs screen readers about dynamic changes
        >
          {formMessage.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full flex overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">Get Started Now</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate> {/* noValidate disables browser's default validation */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-300'}`}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>}
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
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

            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="agreeToTerms" 
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`mt-1 mr-2 h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-400 transition-colors ${errors.agreeToTerms ? 'ring-red-500' : ''}`} 
                aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
                aria-invalid={!!errors.agreeToTerms}
              />
              <div>
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the 
                  <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 hover:underline font-medium"> terms</Link> & 
                  <Link to="/policy" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 hover:underline font-medium"> policy</Link>.
                </label>
                {errors.agreeToTerms && <p id="terms-error" className="mt-1 text-xs text-red-600" role="alert">{errors.agreeToTerms}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-sm text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 ease-in-out text-sm text-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1">
              <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
            <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 ease-in-out text-sm text-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1">
              <img src={appleLogo} alt="Apple" className="w-5 h-5 mr-2" />
              Sign in with Apple
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-gray-600">
            Have an account? <Link to="/Login" className="text-pink-500 hover:text-pink-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={registerImage} // Make sure registerImage is correctly imported and path is valid
            alt="Illustration of a woman holding an hourglass, surrounded by flowers and symbols of well-being" // More descriptive alt text
            className="w-full h-full object-cover"
          />
        </div>
      </div>
       <footer className="mt-8 text-center text-sm text-pink-700">
        &copy; {new Date().getFullYear()} HerCare. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;