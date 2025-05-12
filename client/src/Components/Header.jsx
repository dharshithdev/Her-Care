// Header.js
import React from 'react';

const Header = () => {
    return (
        <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] bg-pink-200/40 backdrop-blur-md border border-pink-300 rounded-full shadow-xl z-50 px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-[#D6336C] tracking-wide drop-shadow-md">Her-Care</h1>
            <nav>
                <ul className="flex space-x-10 text-lg font-semibold text-[#D6336C]">
                    <li>
                        <a
                            href="#home"
                            className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition duration-300"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#services"
                            className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition duration-300"
                        >
                            Our Services
                        </a>
                    </li>
                    <li>
                        <a
                            href="#about"
                            className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition duration-300"
                        >
                            About Us
                        </a>
                    </li>
                    <li>
                        <a
                            href="/login"
                            className="hover:text-white hover:bg-[#D6336C] px-4 py-2 rounded-full transition duration-300"
                        >
                            Log In
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
