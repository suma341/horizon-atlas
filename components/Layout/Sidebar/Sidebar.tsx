import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded">
        ☰
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform opacity-5 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}>
        <div className="p-4 font-bold text-lg">My Sidebar</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#home">Home</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#about">About</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#services">Services</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
