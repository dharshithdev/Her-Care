import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiLock, FiEyeOff, FiDatabase, FiArrowLeft, FiHeart, FiCheckCircle } from 'react-icons/fi';

const Privacy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: <FiLock className="text-violet-500" />,
            title: "Your Data is Yours",
            content: "We believe your health journey is private. We do not, and will never, sell your personal health data, period cycles, or pregnancy information to third-party advertisers or data brokers."
        },
        {
            icon: <FiEyeOff className="text-rose-500" />,
            title: "Encryption First",
            content: "All data synced to our servers is encrypted using industry-standard AES-256 protocols. Even in the unlikely event of a breach, your intimate details remain unreadable."
        },
        {
            icon: <FiDatabase className="text-blue-500" />,
            title: "Minimal Tracking",
            content: "We only collect what is necessary to give you accurate cycle predictions. You can delete your account and all associated data at any time with a single click in your settings."
        }
    ];

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
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Privacy Center</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-10 space-y-10">
                {/* Hero Section */}
                <section className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-100 rounded-[2rem] text-violet-600 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                        <FiShield size={40} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        Our Privacy <span className="text-violet-500">Promise</span>
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Last Updated: February 2026. We prioritize your trust above everything else. 
                        Here is how we protect your information.
                    </p>
                </section>

                {/* Core Values Grid */}
                <div className="grid gap-6">
                    {sections.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-5">
                                <div className="p-4 bg-slate-50 rounded-2xl flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Text Block */}
                <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiHeart size={120} />
                    </div>
                    
                    <h3 className="text-2xl font-black flex items-center gap-3">
                        <FiCheckCircle className="text-emerald-400" /> 
                        The "No-Nonsense" Summary
                    </h3>
                    <ul className="space-y-4 text-slate-300 font-medium">
                        <li className="flex gap-3">
                            <span className="text-emerald-400">•</span>
                            We do not use your health data for targeted ads.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-400">•</span>
                            You have the "Right to be Forgotten" (Full data deletion).
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-400">•</span>
                            Your password is salted and hashed—we can't even see it.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-400">•</span>
                            We only share data with legal authorities if absolutely required by law.
                        </li>
                    </ul>
                </section>

                {/* Footer Note */}
                <footer className="text-center py-10 space-y-4">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Questions? Contact our Data Protection Officer
                    </p>
                    <a 
                        href="mailto:privacy@yourdomain.com" 
                        className="text-violet-600 font-black hover:underline"
                    >
                        privacy@yourdomain.com
                    </a>
                </footer>
            </main>
        </div>
    );
};

export default Privacy;