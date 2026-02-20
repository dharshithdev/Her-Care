import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';

const Luna = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <MainHeader />

      {/* FIX: Added pt-24 (padding-top) to ensure content starts AFTER the header.
          Adjust the pt-24 to pt-20 or pt-32 depending on how tall your header is.
      */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-24 sm:pt-32 text-center">
        
        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6 sm:mb-8"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl sm:text-6xl text-white">🌙</span>
          </div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 text-purple-400 text-3xl sm:text-4xl"
          >
            <FiSettings />
          </motion.div>
        </motion.div>

        {/* Responsive Text Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
        >
          Luna is currently resting
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-gray-600 max-w-md mb-8 px-4 leading-relaxed"
        >
          Our AI companion is undergoing scheduled <span className="font-semibold text-purple-600">maintenance</span> to improve her care routines. She'll be back online soon.
        </motion.p>

        {/* Status Badge */}
        <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-xs sm:text-sm font-medium mb-8">
          <FiTool className="animate-pulse" />
          <span>Maintenance Mode Active</span>
        </div>

        {/* Back Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/" 
            className="bg-gray-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            Return to Dashboard
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Luna;