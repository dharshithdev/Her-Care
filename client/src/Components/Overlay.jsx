import React from 'react'; // Always good practice
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle } from 'react-icons/fi';

// We add 'export default' so other files can use it
const SuccessOverlay = ({ isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4"
            >
                <motion.div 
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    className="bg-white p-10 lg:p-16 rounded-[3rem] text-center shadow-2xl max-w-sm w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl"
                    >
                        <FiCheckCircle />
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Confirmed!</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Your health journey is our priority. See you soon!
                    </p>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default SuccessOverlay;