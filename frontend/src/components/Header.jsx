// Header.js
import React from 'react';
import { useEffect } from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-sm bg-black shadow-md transition duration-300">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold text-cyan-500 tracking-wide">MindLyst.ai</div>
        <ul className="flex space-x-6">
          {["Home", "Test"].map((link) => (
            <li key={link}>
              <a
                href={`/${link.toLowerCase().replace(" ", "-")}`}
                className="text-white hover:text-cyan-400 transition-colors duration-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;