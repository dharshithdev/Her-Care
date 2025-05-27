import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import calander from "../Assets/calander.png";
import doctor from "../Assets/doctor.png";
import luna from "../Assets/luna.png";
import shopping from "../Assets/shopping.png";
import MainHeader from "../Components/MainHeader";

const Explore = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle card clicks
  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-pink-200">
      <MainHeader />
      <div className="flex items-center justify-center p-8 pt-32">
        <div className="grid grid-cols-2 gap-x-20 gap-y-16">
          {/* Card 1: Track */}
          <div
            className="w-72 h-72 bg-pink-500 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer" // Added cursor-pointer
            onClick={() => handleCardClick("/track")} // Added onClick handler
          >
            <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center p-2">
              <img
                src={calander}
                alt="Track"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-white font-semibold text-xl">Track</p>
          </div>

          {/* Card 2: Book Appointments */}
          <div
            className="w-72 h-72 bg-pink-500 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer" // Added cursor-pointer
            onClick={() => handleCardClick("/appointments")} // Added onClick handler
          >
            <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center p-2">
              <img
                src={doctor}
                alt="Book Appointments"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-white font-semibold text-xl text-center">
              Book Appointments
            </p>
          </div>

          {/* Card 3: Shop */}
          <div
            className="w-72 h-72 bg-pink-500 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer" // Added cursor-pointer
            onClick={() => handleCardClick("/shop")} // Added onClick handler
          >
            <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center p-2">
              <img
                src={shopping}
                alt="Shop"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-white font-semibold text-xl">Shop</p>
          </div>

          {/* Card 4: Luna AI (no navigation specified, so leaving as is) */}
          <div className="w-72 h-72 bg-pink-500 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center p-2">
              <img
                src={luna}
                alt="Luna AI"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-white font-semibold text-xl">Luna AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;