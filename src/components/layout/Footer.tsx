import React from 'react';
import { Github, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">RoboSim</h3>
            <p className="text-dark-300 mb-4">
              Learn robotics programming through interactive 3D simulations, without needing expensive hardware.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Forum</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Discord</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Events</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Showcase</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-dark-300 hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-dark-700 text-center">
          <p className="text-dark-400 text-sm">
            © {new Date().getFullYear()} RoboSim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
