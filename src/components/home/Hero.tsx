import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award, Zap } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent-500/3 rounded-full blur-3xl" />
      </div>
      
      {/* Subtle animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center min-h-[85vh]">
            {/* Left Column - Content */}
            <motion.div
              className="text-center lg:text-left space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Star size={18} className="mr-2" />
                <span>Built by students, powered by innovation</span>
              </motion.div>
              
              {/* Main Headline - Clean, no boxes */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-white mb-2">Master</span>
                  <span className="block text-white mb-2">Robotics</span>
                  <span className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                    Without Hardware
                  </span>
                </h1>
              </motion.div>
              
              {/* Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-dark-200 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Learn robotics programming through immersive 3D simulations. 
                Code with natural language, visual blocks, or traditional programming.
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.button 
                  className="group relative btn-primary text-xl px-12 py-6 flex items-center justify-center hover:shadow-glow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => navigate('/simulator')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Play size={24} className="mr-3 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10 font-semibold">Start Simulator</span>
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>
                
                <motion.button 
                  className="group relative btn-outline text-xl px-12 py-6 hover:shadow-lg transition-all duration-300 overflow-hidden border-2"
                  onClick={() => navigate('/challenges')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white transition-colors font-semibold">View Challenges</span>
                </motion.button>
              </motion.div>
              
              {/* Feature Highlights */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left group cursor-pointer">
                  <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 p-4 rounded-2xl mb-4 border border-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Users size={32} className="text-primary-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">Growing Community</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">Join learners worldwide in mastering robotics</p>
                </div>
                
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left group cursor-pointer">
                  <div className="bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 p-4 rounded-2xl mb-4 border border-secondary-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Zap size={32} className="text-secondary-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">Interactive Learning</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">Hands-on experience with real-time feedback</p>
                </div>
                
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left group cursor-pointer">
                  <div className="bg-gradient-to-br from-accent-500/20 to-accent-600/20 p-4 rounded-2xl mb-4 border border-accent-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Star size={32} className="text-accent-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">Open Source</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">Built by the community, for the community</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Interactive Preview */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-2xl">
                {/* Main preview container */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-dark-700/80 to-dark-800/80 rounded-3xl overflow-hidden shadow-2xl border border-dark-600/50 backdrop-blur-sm">
                  {/* Simulated interface */}
                  <div className="absolute inset-0">
                    {/* Header bar */}
                    <div className="h-14 bg-dark-800/90 border-b border-dark-600/50 flex items-center px-6 backdrop-blur-sm">
                      <div className="flex space-x-3">
                        <div className="w-4 h-4 rounded-full bg-error-500"></div>
                        <div className="w-4 h-4 rounded-full bg-warning-500"></div>
                        <div className="w-4 h-4 rounded-full bg-success-500"></div>
                      </div>
                      <div className="flex-1 text-center text-base text-dark-200 font-semibold">
                        RoboSim - 3D Robot Simulator
                      </div>
                    </div>
                    
                    {/* Main content area */}
                    <div className="h-[calc(100%-56px)] bg-gradient-to-br from-primary-900/10 via-transparent to-secondary-900/10 flex items-center justify-center relative overflow-hidden">
                      {/* Animated grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse-slow" />
                      
                      {/* Central Robot */}
                      <motion.div
                        className="relative z-10"
                        animate={{ 
                          y: [0, -15, 0],
                          rotateY: [0, 360]
                        }}
                        transition={{ 
                          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                          rotateY: { duration: 12, repeat: Infinity, ease: "linear" }
                        }}
                      >
                        <div className="w-36 h-36 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl shadow-glow flex items-center justify-center">
                          <Cpu size={64} className="text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Floating Elements */}
                      <motion.div
                        className="absolute top-1/4 left-1/4 w-24 h-24 bg-accent-500/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-accent-500/25"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      >
                        <Brain size={36} className="text-accent-400" />
                      </motion.div>
                      
                      <motion.div
                        className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-secondary-500/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-secondary-500/25"
                        animate={{ 
                          rotate: [0, -180, -360],
                          scale: [1, 1.15, 1],
                          y: [0, -10, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                      >
                        <Layers size={32} className="text-secondary-400" />
                      </motion.div>
                      
                      {/* Code snippets floating */}
                      <motion.div
                        className="absolute top-1/3 right-1/6 bg-dark-700/95 backdrop-blur-md rounded-xl p-4 border border-primary-500/30 shadow-lg"
                        animate={{ 
                          y: [0, -8, 0],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
                      >
                        <div className="text-sm font-mono text-primary-400 font-medium">
                          robot.move()
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="absolute bottom-1/3 left-1/6 bg-dark-700/95 backdrop-blur-md rounded-xl p-4 border border-secondary-500/30 shadow-lg"
                        animate={{ 
                          y: [0, 8, 0],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 4.5, repeat: Infinity, delay: 0.8 }}
                      >
                        <div className="text-sm font-mono text-secondary-400 font-medium">
                          sensor.read()
                        </div>
                      </motion.div>
                      
                      {/* Interactive play button overlay */}
                      <motion.div
                        className="absolute inset-0 bg-dark-900/30 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer group"
                        onClick={() => navigate('/simulator')}
                      >
                        <motion.div
                          className="bg-primary-500 hover:bg-primary-600 text-white p-8 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={40} />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Enhanced glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-accent-500/15 rounded-3xl blur-xl -z-10" />
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-primary-500 rounded-full p-4 shadow-glow"
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Play size={24} className="text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-secondary-500 rounded-full p-4 shadow-glow"
                  animate={{ 
                    y: [0, 12, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                >
                  <Brain size={24} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;