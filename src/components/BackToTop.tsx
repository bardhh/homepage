"use client";

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      aria-label="Back to top"
    >
      <FaArrowUp className="text-lg" />
    </button>
  );
};

export default BackToTop;
