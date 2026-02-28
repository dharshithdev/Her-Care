import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiFileText, FiArrowLeft, FiShield, FiInfo, FiExternalLink } from 'react-icons/fi';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <FiArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-10 space-y-8">
                
                {/* CRITICAL MEDICAL DISCLAIMER - RED THEME */}
                <section className="bg-rose-50 border-2 border-rose-200 p-6 md:p-8 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 text-rose-600">
                        <FiAlertTriangle size={28} strokeWidth={3} />
                        <h2 className="text-xl font-black uppercase tracking-tight">Medical Disclaimer</h2>
                    </div>
                    <div className="space-y-3 text-rose-900/80 font-bold text-sm md:text-base leading-relaxed">
                        <p>
                            OUR APP IS AN INFORMATIONAL TOOL, NOT A MEDICAL DEVICE. The predictions provided (including period dates, fertile windows, and ovulation) are based on statistical averages and user input. 
                        </p>
                        <p className="bg-white/50 p-4 rounded-2xl border border-rose-100">
                            <span className="text-rose-600 underline">WARNING:</span> DO NOT use this app as a form of contraception or to prevent pregnancy. We do not guarantee 100% accuracy. If you are avoiding pregnancy, use a medically approved contraceptive method.
                        </p>
                    </div>
                </section>

                {/* Main Terms Content */}
                <div className="space-y-8 text-slate-600 px-2">
                    
                    <section className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <FiInfo className="text-violet-500" /> 1. Acceptance of Terms
                        </h3>
                        <p className="leading-relaxed">
                            By creating an account or using this platform, you agree to be bound by these terms. If you do not agree, please discontinue use immediately. You must be at least 13 years old (or the digital age of consent in your country) to use this service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <FiShield className="text-violet-500" /> 2. Accuracy of Data
                        </h3>
                        <p className="leading-relaxed">
                            Biological cycles are highly irregular and influenced by stress, diet, exercise, and health conditions. Our algorithms provide **estimates only**. We are not liable for any consequences—including unplanned pregnancy or health complications—resulting from reliance on our predictions.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <FiFileText className="text-violet-500" /> 3. User Responsibility
                        </h3>
                        <p className="leading-relaxed">
                            You are responsible for the accuracy of the data you enter. Logging incorrect dates or symptoms will result in inaccurate predictions. You are also responsible for maintaining the security of your login credentials.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <FiExternalLink className="text-violet-500" /> 4. External Advice
                        </h3>
                        <p className="leading-relaxed">
                            Always consult with a qualified healthcare professional (OB-GYN) for medical advice, diagnosis, or treatment. Never disregard professional medical advice because of something you have read on this app.
                        </p>
                    </section>

                    {/* Liability Block */}
                    <section className="bg-slate-900 text-white p-8 rounded-[3rem] space-y-4">
                        <h3 className="text-xl font-black">5. Limitation of Liability</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, HER-CARE SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THE SERVICE. THIS INCLUDES, BUT IS NOT LIMITED TO, EMOTIONAL DISTRESS, COSTS OF UNPLANNED PREGNANCY, OR MEDICAL EXPENSES.
                        </p>
                    </section>
                </div>

                {/* Footer Note */}
                <footer className="pt-10 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-400">
                        By clicking "I Agree" or continuing to use the app, you acknowledge that you have read and understood these terms in their entirety.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-pink-600 text-white font-black rounded-full shadow-lg shadow-violet-200 hover:scale-105 transition-transform"
                        >
                            I Understand
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Terms;