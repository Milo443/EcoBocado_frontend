import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import brandLogo from '../../assets/vegan_12589452.gif';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src={brandLogo} 
            alt="EcoBocado Logo" 
            className="w-10 h-10 object-contain eco-logo-filter"
          />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Eco<span className="text-green-600">Bocado</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center font-medium text-gray-600">
          <a href="#proceso" className="hover:text-green-600 transition-colors">Cómo funciona</a>
          <a href="#impacto" className="hover:text-green-600 transition-colors">Impacto</a>
          <Link to="/login">
            <Button label="Iniciar Sesión" className="p-button-text p-button-success" />
          </Link>
          <Link to="/register">
            <Button label="Registrarse" className="p-button-success" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;