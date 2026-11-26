"use client";

import React from 'react';
import { FaPrint } from 'react-icons/fa';

/** Opens the browser print dialog, where the page can be saved as a PDF. */
const PrintButton = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="cv-screen-only inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
  >
    <FaPrint className="mr-2" aria-hidden="true" /> Save as PDF
  </button>
);

export default PrintButton;
