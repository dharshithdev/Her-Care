// Header.jsx
import React from 'react';

const MainHeader = () => {
    return (
        <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] bg-pink-200/40 backdrop-blur-md border border-pink-300 rounded-full shadow-xl z-50 px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-[#D6336C] tracking-wide drop-shadow-md">Her-Care</h1>
            
            {/* Search Bar */}
            <div className="flex-1 mx-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-pink-400"
                />
            </div>

            {/* Navigation */}
            <nav>
                <ul className="flex space-x-6 text-md font-semibold text-[#D6336C]">
                    <li><a href="/" className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition">Home</a></li>
                    <li><a href="/explore" className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition">Explore</a></li>
                    <li><a href="/cart" className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition">Cart</a></li>
                    <li><a href="/login" className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition">Accounts</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default MainHeader;
