import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-[85%] bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] z-[100] px-6 py-3 flex justify-between items-center transition-all duration-500">
      
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
          <span className="text-white font-black text-xl">H</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
          Her-Care<span className="text-rose-500">.</span>
        </h1>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:block">
        <ul className="flex space-x-2 text-sm font-bold text-slate-600">
          {[
            { name: 'Home', path: isHomePage ? '#home' : '/' },
            { name: 'Services', path: '/#services'  }, 
            { name: 'About Us', path: '/aboutus' },
          ].map((item) => (
            <li key={item.name}>
              {item.path.startsWith('#') ? (
                <a
                  href={item.path}
                  className="px-5 py-2.5 rounded-full hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-300"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.path}
                  className="px-5 py-2.5 rounded-full hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-300"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link 
          to="/login" 
          className="hidden sm:block px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-rose-500 transition-colors"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-rose-500 hover:shadow-rose-100 transition-all duration-300 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;