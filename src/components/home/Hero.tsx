import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Brain, Layers } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-900 to-dark-800 pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary-500/20 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Robotics Programming <br />
                <span className="text-primary-400 glow-text">Without Hardware</span>
              </h1>
              
              <p className="text-lg md:text-xl text-dark-200 mb-8 max-w-2xl">
                Program virtual robots using natural language, visual blocks, or code.
                Watch them execute tasks in realistic 3D simulations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="btn-primary text-lg px-6 py-3 flex-1 sm:flex-initial"
                  onClick={() => navigate('/simulator')}
                >
                  Try the Simulator
                </button>
                <button 
                  className="btn-outline text-lg px-6 py-3 flex-1 sm:flex-initial"
                  onClick={() => navigate('/learn')}
                >
                  Start Learning
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex flex-col md:flex-row gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary-900 p-3 rounded-lg border border-primary-700">
                  <Cpu size={24} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Multiple Robot Types</h3>
                  <p className="text-dark-300">Arms, mobile robots, and drones in one platform</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-secondary-900 p-3 rounded-lg border border-secondary-700">
                  <Brain size={24} className="text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI Programming Assistant</h3>
                  <p className="text-dark-300">Natural language to robot commands</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-accent-900 p-3 rounded-lg border border-accent-700">
                  <Layers size={24} className="text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Progressive Learning</h3>
                  <p className="text-dark-300">From basics to complex challenges</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="relative w-full max-w-xl aspect-[4/3] bg-dark-700 rounded-xl overflow-hidden shadow-2xl border border-dark-600 glow-border">
              {/* Robot simulation preview - In a real app, this would be an actual 3D scene */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-dark-800/70 to-secondary-900/70 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-xl mb-4">Interactive 3D Simulator</p>
                  <button 
                    className="btn-primary inline-flex items-center"
                    onClick={() => navigate('/simulator')}
                  >
                    <span>Launch Simulator</span>
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;