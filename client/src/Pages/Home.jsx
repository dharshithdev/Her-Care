import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder image, replace with your actual image path
const homeImage = "https://placehold.co/800x600/EEE/31343C"; // You can keep this for the woman image

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100" style={{ backgroundImage: 'url(img.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-pink-600">
              HER-CARE
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Track your cycle, take control of your health
            </p>
            <Link to="/track">
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white
                px-6 py-3 rounded-full transition-colors duration-300
                shadow-lg hover:shadow-xl"
              >
                Start tracking
              </button>
            </Link>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2">
            <img
              src={homeImage} // Use the variable here
              alt="Woman thinking about her health"
              className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-pink-700">
        &copy; {new Date().getFullYear()} HerCare. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
