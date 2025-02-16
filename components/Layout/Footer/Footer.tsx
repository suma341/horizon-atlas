import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8">
      <div className='container text-5xl mx-auto gap-4 mb-5'>Horizon</div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-bold text-lg mb-2">About Us</h4>
          <p>Learn more about our mission and values.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">Quick Links</h4>
          <ul>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">Follow Us</h4>
        </div>
      </div>
      <p className="text-center mt-4">©2024 RyukokuHorizon.</p>
    </footer>
  );
};

export default Footer;
