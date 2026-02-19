import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'About Us', path: '/aboutus' }, // Now set to navigate to a new page
  ];

  const handleNavClick = (item) => {
    setIsOpen(false);

    // Case 1: If it's the "About Us" link (or any link with a path)
    if (item.path) {
      navigate(item.path);
      // Optional: Scroll to top of the new page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Case 2: Handle scrolling for Home and Services
    if (location.pathname === '/' || location.pathname === '/home') {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on /aboutus and click "Services", go home first then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <header className="fixed top-4 lg:top-6 left-1/2 transform -translate-x-1/2 w-[90%] lg:w-[85%] bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl lg:rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] z-[100] px-4 lg:px-6 py-2 lg:py-3 flex justify-between items-center transition-all duration-500">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-rose-500 rounded-lg lg:rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span className="text-white font-black text-lg lg:text-xl">H</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter">
            Her-Care<span className="text-rose-500">.</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-1 text-sm font-bold text-slate-600">
            {navItems.map((item) => (
              <li key={item.name}>
                <button 
                  onClick={() => handleNavClick(item)} 
                  className="px-4 py-2 rounded-full hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-300"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-rose-500 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-rose-500 transition-all active:scale-95">
              Get Started
            </Link>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-1.5 text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsOpen(false)} 
        />
        <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-[90%] bg-white rounded-2xl p-4 shadow-2xl transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <nav>
            <ul className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={() => handleNavClick(item)} 
                    className="w-full text-left block px-4 py-3 rounded-xl text-md font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-md font-bold text-slate-500 hover:bg-slate-50">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-md font-bold text-rose-500 bg-rose-50">
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;