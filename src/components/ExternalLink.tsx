import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, className = "", showIcon = true }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {showIcon && (
        <FaExternalLinkAlt className="inline-block ml-1 text-[0.6em] opacity-50 -translate-y-0.5" aria-hidden="true" />
      )}
    </a>
  );
};

export default ExternalLink;
