// Header.js
import React from 'react';
import { useEffect } from 'react';

const Header = () => {
    useEffect(() => {
    const header = document.querySelector("header");

    const handleScroll = () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    };

    const animateOnScroll = () => {
        const elements = document.querySelectorAll(".animate__animated");
        elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
        if (isVisible) {
            el.style.visibility = "visible";
            el.classList.add("animate__fadeIn");
        }
        });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", animateOnScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("scroll", animateOnScroll);
    };
    }, []);
    
    return (
    <header className="fixed top-0 w-full z-50 bg-transparent transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold text-cyan-500">MindLyst.ai</div>
        <ul className="flex space-x-8">
          {["Home", "Features", "How It Works", "Contact"].map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-white hover:text-cyan-500 transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
export default Header;