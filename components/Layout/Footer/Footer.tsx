import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
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
          <div className="flex space-x-4">
            <a href="https://twitter.com" aria-label="Twitter" className='mt-1'>
              <Image src="/x-social-media-logo-icon.svg" alt="X-icon" width={10} height={10} className="w-8 h-8" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Image src="/Instagram-Logo.wine.svg" alt="Instagram-icon" width={10} height={10} className="w-10 h-10" />
            </a>
          </div>
        </div>
      </div>
      <p className="text-center mt-4">©2024 RyukokuHorizon.</p>
    </footer>
  );
};

export default Footer;
