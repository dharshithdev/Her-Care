import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Change background opacity on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Track', path: '/track' },
        { name: 'Explore', path: '/explore' },
        { name: 'Daily', path: '/daily' },
        { name: 'Account', path: '/account' },
    ];

    return (
        <header 
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
            ${isScrolled ? 'w-[85%] lg:w-[70%]' : 'w-[90%] lg:w-[85%]'}
            `}
        >
            <div className={`relative flex items-center justify-between px-8 py-4 rounded-[2rem] border transition-all duration-500
                ${isScrolled 
                    ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]' 
                    : 'bg-white/40 backdrop-blur-md border-white/20 shadow-sm'
                }
            `}>
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <span className="text-white font-black text-sm">H</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tighter">
                        Her-Care<span className="text-rose-500">.</span>
                    </h1>
                </Link>

                {/* Navigation Links */}
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

                {/* Call to Action / Profile Icon */}
                <div className="flex items-center gap-4">
                    <Link 
                        to="/register" 
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95"
                    >
                        Log Out
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default MainHeader;