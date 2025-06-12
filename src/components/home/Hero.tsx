import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-20 pb-32">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                <Star size={16} className="mr-2" />
                <span>Trusted by 10,000+ students worldwide</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1]">
                Master Robotics
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  Without Hardware
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-dark-200 mb-10 leading-relaxed">
                Learn robotics programming through immersive 3D simulations. 
                Code with natural language, visual blocks, or traditional programming.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  className="group btn-primary text-lg px-8 py-4 flex items-center justify-center hover:shadow-glow-lg transition-all duration-300"
                  onClick={() => navigate('/simulator')}
                >
                  <Play size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                  <span>Start Simulator</span>
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="btn-outline text-lg px-8 py-4 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('/challenges')}
                >
                  View Challenges
                </button>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center gap-8 text-sm text-dark-300">
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-primary-400" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="mr-2 text-secondary-400" />
                  <span>100+ Challenges</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-2 text-accent-400" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Main preview container */}
              <div className="relative w-full max-w-2xl aspect-[4/3] bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl overflow-hidden shadow-2xl border border-dark-600">
                {/* Simulated interface */}
                <div className="absolute inset-0">
                  {/* Header bar */}
                  <div className="h-12 bg-dark-800 border-b border-dark-600 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-error-500"></div>
                      <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                      <div className="w-3 h-3 rounded-full bg-success-500"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-dark-300 font-medium">
                      RoboSim - 3D Robot Simulator
                    </div>
                  </div>
                  
                  {/* Main content area */}
                  <div className="h-[calc(100%-48px)] bg-gradient-to-br from-primary-900/20 via-dark-800/50 to-secondary-900/20 flex items-center justify-center relative overflow-hidden">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px] animate-pulse-slow" />
                    
                    {/* Robot representation */}
                    <motion.div
                      className="relative z-10"
                      animate={{ 
                        y: [0, -10, 0],
                        rotateY: [0, 360]
                      }}
                      transition={{ 
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                      }}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl shadow-glow flex items-center justify-center">
                        <Cpu size={40} className="text-white" />
                      </div>
                    </motion.div>
                    
                    {/* Floating elements */}
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <Brain size={24} className="text-accent-400" />
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    >
                      <Layers size={20} className="text-secondary-400" />
                    </motion.div>
                    
                    {/* Code snippets floating */}
                    <motion.div
                      className="absolute top-1/3 right-1/6 bg-dark-700/80 backdrop-blur-sm rounded-lg p-3 border border-primary-500/30"
                      animate={{ 
                        y: [0, -5, 0],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    >
                      <div className="text-xs font-mono text-primary-400">
                        robot.move()
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-1/3 left-1/6 bg-dark-700/80 backdrop-blur-sm rounded-lg p-3 border border-secondary-500/30"
                      animate={{ 
                        y: [0, 5, 0],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                    >
                      <div className="text-xs font-mono text-secondary-400">
                        sensor.read()
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-xl -z-10" />
              </div>
              
              {/* Floating action button */}
              <motion.button
                className="absolute bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
                onClick={() => navigate('/simulator')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={24} className="group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Feature highlights */}
        <motion.div 
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-700/50 border border-dark-600/50 backdrop-blur-sm hover:bg-dark-700/70 transition-all duration-300">
            <div className="bg-primary-900 p-3 rounded-lg border border-primary-700 flex-shrink-0">
              <Cpu size={24} className="text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Multiple Robot Types</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Control arms, mobile robots, drones, and specialized bots in realistic physics simulations
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-700/50 border border-dark-600/50 backdrop-blur-sm hover:bg-dark-700/70 transition-all duration-300">
            <div className="bg-secondary-900 p-3 rounded-lg border border-secondary-700 flex-shrink-0">
              <Brain size={24} className="text-secondary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">AI-Powered Learning</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Natural language programming with intelligent code suggestions and real-time feedback
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 rounded-xl bg-dark-700/50 border border-dark-600/50 backdrop-blur-sm hover:bg-dark-700/70 transition-all duration-300">
            <div className="bg-accent-900 p-3 rounded-lg border border-accent-700 flex-shrink-0">
              <Layers size={24} className="text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Progressive Curriculum</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Structured learning path from basic movements to complex autonomous systems
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;