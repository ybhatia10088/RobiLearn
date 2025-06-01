import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 h-[var(--footer-height)] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-dark-400 text-sm">
          © {new Date().getFullYear()} RoboSim. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
            <Github size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
            <Twitter size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;