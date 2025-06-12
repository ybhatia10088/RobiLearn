import React from 'react';
import { Github, Twitter, Youtube, Mail, Phone, Notebook as Robot } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Robot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  <span className="text-primary-400">Robo</span>
                  <span>Sim</span>
                </h3>
                <p className="text-xs text-dark-400">Learn. Code. Innovate.</p>
              </div>
            </div>
            <p className="text-dark-300 mb-6 leading-relaxed">
              Empowering the next generation of robotics engineers through immersive 
              3D simulations and AI-powered learning experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-dark-800 hover:bg-dark-700 p-3 rounded-lg transition-colors duration-200 group"
              >
                <Github size={20} className="text-dark-300 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-dark-800 hover:bg-dark-700 p-3 rounded-lg transition-colors duration-200 group"
              >
                <Twitter size={20} className="text-dark-300 group-hover:text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-dark-800 hover:bg-dark-700 p-3 rounded-lg transition-colors duration-200 group"
              >
                <Youtube size={20} className="text-dark-300 group-hover:text-white" />
              </a>
            </div>
          </div>
          
          {/* Learning Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Learning Resources</h4>
            <ul className="space-y-3">
              {[
                'Getting Started Guide',
                'API Documentation',
                'Video Tutorials',
                'Sample Projects',
                'Best Practices',
                'Troubleshooting'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-dark-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Community</h4>
            <ul className="space-y-3">
              {[
                'Discussion Forum',
                'Discord Server',
                'Student Showcase',
                'Competitions',
                'Webinars & Events',
                'Educator Resources'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-dark-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact & Support</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Email Support</p>
                  <a 
                    href="mailto:support@robosim.com" 
                    className="text-sm text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    support@robosim.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Phone Support</p>
                  <a 
                    href="tel:+1-555-0123" 
                    className="text-sm text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    +1 (555) 012-3456
                  </a>
                </div>
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold text-white mb-3">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-dark-800 border border-dark-600 rounded-l-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-lg transition-colors duration-200">
                  <Mail size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-dark-700 bg-dark-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-dark-400 text-sm">
                © {currentYear} RoboSim. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-dark-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded"></div>
                <span className="text-sm font-medium text-white">Advanced AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;