import React from 'react';
import { useNavigate, useCurrentRoute } from '@/hooks/useNavigation';
import { Menu, X, Notebook as Robot, Book, Award, Github, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { name: 'Simulator', path: '/simulator', icon: <Robot size={20} /> },
  { name: 'Challenges', path: '/challenges', icon: <Award size={20} /> },
  { name: 'Learn', path: '/learn', icon: <Book size={20} /> },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const currentRoute = useCurrentRoute();
  
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  
  return (
    <header className="fixed top-0 left-0 w-full bg-dark-800/90 backdrop-blur-md border-b border-dark-600 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-primary-500 p-1.5 rounded-md">
            <Robot size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">
            <span className="text-primary-400">Robo</span>
            <span>Sim</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                currentRoute === item.path 
                  ? 'text-primary-400 bg-primary-500/10' 
                  : 'text-white/80 hover:text-white hover:bg-dark-700'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            <Github size={20} />
          </a>
          <button className="btn-primary flex items-center space-x-2">
            <User size={16} />
            <span>Sign In</span>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 top-16 bg-dark-800 z-40 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-md transition-colors duration-200 ${
                    currentRoute === item.path 
                      ? 'bg-primary-500/10 text-primary-400' 
                      : 'hover:bg-dark-700 text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-lg">{item.name}</span>
                </button>
              ))}
              
              <div className="pt-4 border-t border-dark-600">
                <button className="w-full btn-primary flex items-center justify-center space-x-2 py-3">
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;