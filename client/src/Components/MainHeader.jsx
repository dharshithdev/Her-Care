import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MainHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/home');
    };

    // Change background opacity on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Track', path: '/track' },
        { name: 'Explore', path: '/explore' },
        { name: 'Daily', path: '/daily' },
        { name: 'Account', path: '/account' },
    ];

    return (
        <>
            <header 
                className={`fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out
                ${isScrolled ? 'w-[92%] lg:w-[70%]' : 'w-[95%] lg:w-[85%]'}
                `}
            >
                <div className={`relative flex items-center justify-between px-5 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] border transition-all duration-500
                    ${isScrolled 
                        ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]' 
                        : 'bg-white/40 backdrop-blur-md border-white/20 shadow-sm'
                    }
                `}>
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 group relative z-[110]">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <span className="text-white font-black text-sm">H</span>
                        </div>
                        <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter">
                            Her-Care<span className="text-rose-500">.</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation Links - ABSOLUTELY UNTOUCHED */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className={`relative px-5 py-2 text-sm font-bold tracking-tight transition-all duration-300 rounded-xl
                                                ${isActive 
                                                    ? 'text-rose-500 bg-rose-50' 
                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            {link.name}
                                            {isActive && (
                                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Actions: Desktop Logout + Mobile Toggle */}
                    <div className="flex items-center gap-2 md:gap-4 relative z-[110]">
                        <button 
                            onClick={handleLogout}
                            className="hidden md:flex bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95 items-center gap-2"
                        >
                            Log Out
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-rose-50 transition-colors"
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>

                    {/* NEW: Small Compact Mobile Menu (Dropdown Style) */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute top-[115%] right-0 w-48 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2 md:hidden z-[120]"
                            >
                                <ul className="flex flex-col gap-1">
                                    {navLinks.map((link) => {
                                        const isActive = location.pathname === link.path;
                                        return (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.path}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                                                        ${isActive ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-50'}
                                                    `}
                                                >
                                                    {link.name}
                                                    {isActive && <div className="w-1 h-1 bg-white rounded-full" />}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    <li className="mt-1 pt-1 border-t border-slate-50">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <FiLogOut size={14} /> Log Out
                                        </button>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>
            
            {/* Background overlay - Invisible on laptop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[80] md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MainHeader;