import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiInfo, FiArrowLeft, FiHeart, FiActivity, FiAlertCircle } from 'react-icons/fi';

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
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Terms of Use</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-10 space-y-10">
                
                {/* THE "BIOLOGICAL REALITY" SECTION - This is your main legal shield */}
                <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-violet-600">
                        <FiActivity size={120} />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <FiHeart className="fill-violet-600" size={12} /> Your Health, Our Priority
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 leading-tight">
                        Our Data <span className="text-pink-500">& Your Body</span>
                    </h2>

                    <div className="space-y-4 text-slate-500 font-medium leading-relaxed">
                        <p>
                            Her-Care is designed to help you understand the beautiful complexity of your cycle. Our algorithms analyze your inputs to provide personalized insights into your period and ovulation patterns.
                        </p>
                        
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-slate-700 italic">
                            "Because every body is unique, biological timing can be influenced by stress, lifestyle, and health changes. As such, all dates provided by the app are **estimates intended for educational and tracking purposes only.**"
                        </div>

                        <p className="text-sm">
                            While we strive for precision, Her-Care should <span className="text-slate-900 font-bold">not be used as a primary form of contraception or to prevent pregnancy.</span> To ensure your safety, always use effective contraceptive methods alongside the app's insights. Our data is a supportive guide, not a substitute for medically approved birth control or professional clinical advice.
                        </p>
                    </div>
                </section>

                {/* Core Terms */}
                <div className="grid gap-8 px-2">
                    <section className="space-y-3">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                <FiShield size={20} />
                            </div>
                            1. Accuracy Disclaimer
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                            The accuracy of Her-Care's predictions depends on the data you log. We do not guarantee that the App’s predictions will be 100% accurate at all times. Use of the App constitutes your acknowledgment that biological cycles are variable and that reliance on any information provided is at your own discretion.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                <FiInfo size={20} />
                            </div>
                            2. Professional Consultation
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                            Her-Care is not a medical device. Always consult with a qualified healthcare professional or OB-GYN for family planning, medical diagnosis, or treatment. Never disregard professional medical advice based on information found within this platform.
                        </p>
                    </section>

                    {/* Liability Block - THE "ESCAPE FROM LAW" SECTION */}
                    <section className="bg-slate-900 text-white p-8 md:p-10 rounded-[3rem] space-y-5">
                        <div className="flex items-center gap-2 text-rose-400 font-black uppercase text-xs tracking-widest">
                            <FiAlertCircle /> Legal Protection
                        </div>
                        <h3 className="text-xl font-black">Limitation of Liability</h3>
                        <p className="text-slate-400 text-[11px] leading-relaxed uppercase tracking-wider">
                            TO THE FULLEST EXTENT PERMITTED BY LAW, HER-CARE SHALL NOT BE LIABLE FOR ANY CONSEQUENTIAL OR INCIDENTAL OUTCOMES, INCLUDING UNPLANNED PREGNANCIES, EMOTIONAL DISTRESS, OR MEDICAL COSTS. BY USING THE APP, YOU ACCEPT FULL RESPONSIBILITY FOR YOUR REPRODUCTIVE HEALTH DECISIONS AND ACKNOWLEDGE THAT DATA ESTIMATES ARE NOT GUARANTEES.
                        </p>
                    </section>
                </div>

                {/* Action Footer */}
                <footer className="pt-12 text-center space-y-6">
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                        By continuing to use Her-Care, you confirm you have read and agreed to these terms.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-12 py-4 bg-pink-600 text-white font-black rounded-full shadow-2xl shadow-violet-200 hover:scale-105 active:scale-95 transition-all"
                    >
                        I Accept These Terms
                    </button>
                </footer>
            </main>
        </div>
    );
};

export default Terms;