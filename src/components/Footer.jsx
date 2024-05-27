import React from 'react';
import logoImg from '../assets/logoverticalwhite.png'; 

const Footer = () => {
  return (
    <footer className="p-4 mt-8 font-light text-white" style={{ backgroundColor: '#EC1E27' }}>
      <div className="container flex flex-col items-center mx-auto">
        <img src={logoImg} alt="Logo" className="w-32 mb-4" />
        <p>&copy; 2024 Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
