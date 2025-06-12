import React from 'react';
import { useNavigate, useCurrentRoute } from '@/hooks/useNavigation';
import { Menu, X, Notebook as Robot, Home, Award, Cpu, Info, Github, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { name: 'Home', path: '/', icon: <Home size={20} /> },
  { name: 'Challenges', path: '/challenges', icon: <Award size={20} /> },
  { name: 'Simulator', path: '/simulator', icon: <Cpu size={20} /> },
  { name: 'About', path: '/about', icon: <Info size={20} /> },
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
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center space-x-1 bg-dark-700/50 rounded-full p-1 backdrop-blur-sm border border-dark-600/50">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                  currentRoute === item.path 
                    ? 'text-white bg-primary-500 shadow-lg shadow-primary-500/25' 
                    : 'text-dark-300 hover:text-white hover:bg-dark-600/70'
                }`}
              >
                <span className="hidden sm:inline">{item.icon}</span>
                <span>{item.name}</span>
                {currentRoute === item.path && (
                  <motion.div
                    className="absolute inset-0 bg-primary-500 rounded-full -z-10"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-dark-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-dark-700/50"
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
          className="md:hidden text-white p-2 rounded-lg hover:bg-dark-700/50 transition-colors"
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
            className="fixed inset-0 top-16 bg-dark-800/95 backdrop-blur-md z-40 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-2 mb-8">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-left ${
                      currentRoute === item.path 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                        : 'hover:bg-dark-700/70 text-dark-200 hover:text-white'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
              
              <div className="pt-6 border-t border-dark-600">
                <div className="flex flex-col space-y-4">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl hover:bg-dark-700/70 text-dark-200 hover:text-white transition-colors"
                  >
                    <Github size={20} />
                    <span>GitHub</span>
                  </a>
                  <button className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg">
                    <User size={20} />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;