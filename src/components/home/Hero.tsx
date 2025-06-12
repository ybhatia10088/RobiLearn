import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/4 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-12 backdrop-blur-sm"
              >
                <Star size={16} className="mr-2" />
                <span>Built by students, powered by innovation</span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="mb-10">
                  <div className="text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tight">
                    Master
                  </div>
                  <div className="text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tight">
                    Robotics
                  </div>
                  <div className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2] mt-4">
                    Without Hardware
                  </div>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl text-dark-200 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
              >
                Learn robotics programming through immersive 3D simulations. 
                <br className="hidden md:block" />
                Code with natural language, visual blocks, or traditional programming.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16"
              >
                <button 
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg px-10 py-5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 hover:-translate-y-1 active:translate-y-0"
                  onClick={() => navigate('/simulator')}
                >
                  <div className="flex items-center justify-center relative z-10">
                    <Play size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Start Simulator</span>
                    <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
                <button 
                  className="group bg-transparent text-primary-400 hover:text-white text-lg px-10 py-5 rounded-2xl font-semibold transition-all duration-300 hover:bg-primary-500/10 backdrop-blur-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 active:translate-y-0"
                  onClick={() => navigate('/challenges')}
                >
                  <div className="flex items-center justify-center">
                    <Award size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Challenges</span>
                  </div>
                </button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-dark-300"
              >
                <div className="flex items-center group hover:text-primary-400 transition-colors duration-300">
                  <Users size={18} className="mr-2 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Growing Community</span>
                </div>
                <div className="flex items-center group hover:text-secondary-400 transition-colors duration-300">
                  <Award size={18} className="mr-2 text-secondary-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Interactive Learning</span>
                </div>
                <div className="flex items-center group hover:text-accent-400 transition-colors duration-300">
                  <Star size={18} className="mr-2 text-accent-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Open Source</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <div className="relative w-full max-w-2xl">
                {/* Main preview container */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-dark-700/80 to-dark-800/80 rounded-3xl overflow-hidden backdrop-blur-xl border border-dark-600/30 shadow-2xl">
                  {/* Header bar */}
                  <div className="h-14 bg-dark-800/90 border-b border-dark-600/30 flex items-center px-6 backdrop-blur-sm">
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 rounded-full bg-error-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-warning-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-success-500/80"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-dark-300 font-medium">
                      RoboSim - 3D Robot Simulator
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="h-[calc(100%-56px)] bg-gradient-to-br from-primary-900/10 via-dark-800/30 to-secondary-900/10 flex items-center justify-center relative overflow-hidden">
                    {/* Grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse-slow" />
                    
                    {/* Central robot representation */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotateY: [0, 360]
                      }}
                      transition={{ 
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotateY: { duration: 12, repeat: Infinity, ease: "linear" }
                      }}
                      className="relative z-10"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl shadow-2xl shadow-primary-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Cpu size={56} className="text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                    
                    {/* Feature elements */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
                      className="absolute top-1/4 left-1/4 w-20 h-20 bg-accent-500/15 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <Brain size={32} className="text-accent-400" />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: [0, -180, -360],
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                      className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-secondary-500/15 rounded-xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <Layers size={28} className="text-secondary-400" />
                    </motion.div>
                    
                    {/* Code snippets */}
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                      className="absolute top-1/3 right-1/6 bg-dark-700/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                    >
                      <div className="text-xs font-mono text-primary-400">
                        robot.move()
                      </div>
                    </motion.div>
                    <motion.div
                      animate={{ 
                        y: [0, 8, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
                      className="absolute bottom-1/3 left-1/6 bg-dark-700/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                    >
                      <div className="text-xs font-mono text-secondary-400">
                        sensor.read()
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-4 shadow-xl shadow-primary-500/30"
                >
                  <Play size={24} className="text-white" />
                </motion.div>
                <motion.div
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
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-4 shadow-xl shadow-secondary-500/30"
                >
                  <Brain size={24} className="text-white" />
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-3xl blur-2xl -z-10" />
              </div>
            </motion.div>
          </div>
          
          {/* Feature highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Cpu size={28} />,
                title: 'Multiple Robot Types',
                description: 'Control arms, mobile robots, drones, and specialized bots in realistic physics simulations',
                color: 'primary'
              },
              {
                icon: <Brain size={28} />,
                title: 'AI-Powered Learning',
                description: 'Natural language programming with intelligent code suggestions and real-time feedback',
                color: 'secondary'
              },
              {
                icon: <Layers size={28} />,
                title: 'Progressive Curriculum',
                description: 'Structured learning path from basic movements to complex autonomous systems',
                color: 'accent'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-dark-700/20 backdrop-blur-sm hover:bg-dark-700/30 transition-all duration-300 h-full">
                  <div className={`bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-4 rounded-2xl mb-6 shadow-lg shadow-${feature.color}-500/20 group-hover:shadow-${feature.color}-500/40 group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-4 text-lg group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed text-sm group-hover:text-dark-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
                {/* Glow effect on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-${feature.color}-500/0 to-${feature.color}-500/0 group-hover:from-${feature.color}-500/10 group-hover:to-${feature.color}-500/5 rounded-2xl blur-xl transition-all duration-300 -z-10`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
