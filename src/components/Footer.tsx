import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-12 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center text-slate-500 dark:text-slate-400 text-sm">
      <div className="container mx-auto px-4">
        <p>&copy; {year} Bardh Hoxha. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
