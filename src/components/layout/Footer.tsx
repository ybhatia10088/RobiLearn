import React from 'react';
import { Github, Twitter, Heart, Code, Book, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 h-[var(--footer-height)] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">RoboSim</h4>
            <p className="text-dark-400 text-sm">
              Learn robotics programming through interactive 3D simulations without expensive hardware.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="/learn" className="text-dark-400 hover:text-primary-400 transition-colors flex items-center">
                <Book size={16} className="mr-2" />
                <span>Documentation</span>
              </a>
              <a href="/challenges" className="text-dark-400 hover:text-primary-400 transition-colors flex items-center">
                <Code size={16} className="mr-2" />
                <span>Challenges</span>
              </a>
              <a href="/community" className="text-dark-400 hover:text-primary-400 transition-colors flex items-center">
                <MessageSquare size={16} className="mr-2" />
                <span>Community</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-dark-400 hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-dark-700 flex justify-between items-center">
          <div className="text-dark-400 text-sm">
            © {new Date().getFullYear()} RoboSim. All rights reserved.
          </div>
          <div className="flex items-center text-dark-400 text-sm">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-error-500" />
            <span>by the RoboSim Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;