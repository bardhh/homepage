import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">
        Contact
      </h2>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Get in Touch</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              I am always open to discussing new research collaborations, speaking opportunities, or questions about my work.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400 mt-1">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</span>
                  <a href="mailto:bardh.hoxha@toyota.com" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                    bardh.hoxha@toyota.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400 mt-1">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Office</span>
                  <address className="text-slate-800 dark:text-slate-200 not-italic">
                    Toyota Research Institute of North America<br />
                    1555 Woodridge Ave<br />
                    Ann Arbor, MI 48105
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col justify-center items-center md:items-start border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://github.com/bardhh" target="_blank" rel="noopener noreferrer" className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all transform hover:-translate-y-1">
                <FaGithub className="text-2xl" />
              </a>
              <a href="https://www.linkedin.com/in/bardhhoxha/" target="_blank" rel="noopener noreferrer" className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all transform hover:-translate-y-1">
                <FaLinkedin className="text-2xl" />
              </a>
              <a href="https://twitter.com/bardhh" target="_blank" rel="noopener noreferrer" className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-full text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-400 dark:hover:text-white transition-all transform hover:-translate-y-1">
                <FaTwitter className="text-2xl" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
