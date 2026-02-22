import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiSettings, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../Components/MainHeader';
import Footer from '../Components/Footer';

const PregnancyMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      <MainHeader />

      {/* Added pt-32 to push content below the fixed header safely */}
      <main className="flex-grow flex flex-col items-center pt-32 pb-12 px-6">
        <div className="max-w-lg w-full text-center">
          
          {/* Animated Illustration Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 flex justify-center"
          >
            <div className="w-56 h-56 md:w-64 md:h-64 bg-pink-50 rounded-full flex items-center justify-center relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="text-pink-400 text-7xl md:text-8xl"
              >
                <FiHeart />
              </motion.div>
              
              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute top-6 right-6 md:top-10 md:right-10 bg-white p-3 rounded-2xl shadow-sm text-indigo-500"
              >
                <FiClock />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white p-3 rounded-2xl shadow-sm text-pink-500"
              >
                <FiSettings />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Coming Soon!
            </h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium text-sm md:text-base px-4">
              We are currently crafting a beautiful experience to help you track your pregnancy journey week by week. Stay tuned for updates!
            </p>

            <div className="space-y-6">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-900 font-bold text-sm hover:underline transition-all active:scale-95"
              >
                <FiArrowLeft /> Go Back to Insights
              </button>
              
              <div className="pt-4 flex justify-center gap-3">
                <span className="w-2.5 h-2.5 bg-pink-200 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PregnancyMode;