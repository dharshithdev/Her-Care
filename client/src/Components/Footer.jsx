import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Unified Navigation Logic
  const handleNavClick = (type, target) => {
    if (type === 'path') {
      navigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'id') {
      if (location.pathname === '/' || location.pathname === '/home') {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          
          {/* Brand Side */}
          <div className="text-center md:text-left">
            <button 
              onClick={() => handleNavClick('id', 'home')} 
              className="flex items-center justify-center md:justify-start gap-2 mb-4 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-white font-black text-sm">H</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                Her-Care<span className="text-rose-500">.</span>
              </h2>
            </button>
            <p className="text-slate-400 text-sm font-medium max-w-xs">
              Empowering women through data-driven wellness and compassionate technology.
            </p>
          </div>

          {/* Quick Links */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
              <li>
                <button onClick={() => handleNavClick('id', 'home')} className="hover:text-rose-500 transition-colors uppercase">Home</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('id', 'services')} className="hover:text-rose-500 transition-colors uppercase">Services</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('path', '/aboutus')} className="hover:text-rose-500 transition-colors uppercase">About</button>
              </li>
              <li><a href="/privacy" className="hover:text-rose-500 transition-colors">Privacy</a></li>
              <li><a href="/support" className="hover:text-rose-500 transition-colors">Support</a></li>
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-5">
            {[<FiInstagram />, <FiTwitter />, <FiFacebook />].map((icon, idx) => (
              <a 
                key={idx} 
                href="/instagram" 
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-semibold tracking-wide">
            © 2026 HER-CARE WELLNESS PROJECT. ALL RIGHTS RESERVED.
          </p>
          
          <p className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            Made with <FiHeart className="text-rose-500 fill-rose-500" /> for women everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;