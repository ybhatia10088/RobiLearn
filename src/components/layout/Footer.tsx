import React from 'react';
import { Github, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer 
      className="bg-dark-900 border-t border-dark-700 py-4"
      style={{ height: 'var(--footer-height)' }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">RoboSim</h3>
            <p className="text-dark-300 text-sm">
              Learn robotics programming through interactive 3D simulations.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Resources</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Tutorials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Community</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Forum</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Discord</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Showcase</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Company</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-dark-700 text-center">
          <p className="text-dark-400 text-xs">
            © {new Date().getFullYear()} RoboSim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
