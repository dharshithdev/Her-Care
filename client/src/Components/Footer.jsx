import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          
          {/* Brand Side */}
          <div className="text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-4 group">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-white font-black text-sm">H</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                Her-Care<span className="text-rose-500">.</span>
              </h2>
            </Link>
            <p className="text-slate-400 text-sm font-medium max-w-xs">
              Empowering women through data-driven wellness and compassionate technology.
            </p>
          </div>

          {/* Quick Links */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
              <li><Link to="/" className="hover:text-rose-500 transition-colors">Home</Link></li>
              <li><Link to="/explore" className="hover:text-rose-500 transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-rose-500 transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">Support</a></li>
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-5">
            {[<FiInstagram />, <FiTwitter />, <FiFacebook />].map((icon, idx) => (
              <a 
                key={idx} 
                href="#" 
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