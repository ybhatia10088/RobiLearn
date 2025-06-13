import React from 'react';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award, Zap, Target, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/12 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent-500/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-4 h-4 bg-primary-400/30 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-6 h-6 bg-secondary-400/40 rotate-45"
          animate={{ rotate: [45, 225, 45], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent-400/50 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-60" />
      
      <div className="container mx-auto px-6 relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center min-h-[85vh] justify-center">
            {/* Centered Content with enhanced spacing */}
            <div className="text-center max-w-5xl mx-auto">
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary-500/15 to-secondary-500/15 backdrop-blur-md border border-primary-400/30 text-primary-300 text-sm font-semibold mb-12 shadow-lg hover:shadow-glow transition-all duration-300"
              >
                <Star size={18} className="mr-3 text-primary-400" />
                <span>The Future of Robotics Education</span>
                <Zap size={16} className="ml-3 text-secondary-400" />
              </motion.div>

              {/* Enhanced Main Headline with better typography */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-12"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight">
                  <div className="text-white mb-4">
                    Master Robotics
                  </div>
                  <div className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent font-black relative">
                    Without Hardware
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent blur-sm opacity-30 -z-10">
                      Without Hardware
                    </div>
                  </div>
                </h1>
              </motion.div>

              {/* Enhanced Subtitle with better spacing */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-dark-200 mb-16 leading-relaxed font-light max-w-4xl mx-auto"
              >
                Learn robotics programming through immersive 3D simulations.
                <br />
                <span className="text-primary-300 font-medium">No expensive hardware required.</span>
              </motion.p>

              {/* Enhanced Action Buttons with better styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              >
                <button 
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white text-lg font-bold px-12 py-6 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-2 active:translate-y-0 transform-gpu"
                  onClick={() => navigate('/simulator')}
                >
                  <div className="flex items-center justify-center relative z-10">
                    <Play size={24} className="mr-4 group-hover:scale-125 transition-transform duration-300" />
                    <span className="text-xl">Launch Simulator</span>
                    <ArrowRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {/* Glow border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                </button>
                
                <button 
                  className="group relative bg-transparent border-2 border-primary-400/50 hover:border-primary-400 text-primary-300 hover:text-white text-lg font-semibold px-12 py-6 rounded-2xl transition-all duration-500 hover:bg-primary-500/10 backdrop-blur-md hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 active:translate-y-0"
                  onClick={() => navigate('/challenges')}
                >
                  <div className="flex items-center justify-center">
                    <Award size={24} className="mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xl">View Challenges</span>
                  </div>
                </button>
              </motion.div>

              {/* Enhanced Social proof with better design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-12 text-sm"
              >
                {[
                  { icon: Users, text: "Growing Community", color: "primary" },
                  { icon: Code, text: "Interactive Learning", color: "secondary" },
                  { icon: Star, text: "Open Source", color: "accent" }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className={`flex items-center group hover:text-${item.color}-300 transition-colors duration-300 cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`bg-${item.color}-500/20 p-3 rounded-full mr-4 group-hover:bg-${item.color}-500/30 transition-colors duration-300`}>
                      <item.icon size={20} className={`text-${item.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <span className="font-medium text-dark-300 group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Enhanced Feature highlights with improved design */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: <Cpu size={32} />, 
                title: 'Multiple Robot Types',
                description: 'Control arms, mobile robots, drones, and specialized bots in realistic physics simulations with industry-grade accuracy', 
                color: 'primary',
                gradient: 'from-primary-500 to-primary-600'
              },
              {
                icon: <Brain size={32} />, 
                title: 'AI-Powered Learning',
                description: 'Natural language programming with intelligent code suggestions, real-time feedback, and adaptive learning paths', 
                color: 'secondary',
                gradient: 'from-secondary-500 to-secondary-600'
              },
              {
                icon: <Layers size={32} />, 
                title: 'Progressive Curriculum',
                description: 'Structured learning path from basic movements to complex autonomous systems with hands-on challenges', 
                color: 'accent',
                gradient: 'from-accent-500 to-accent-600'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title} 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-full">
                  {/* Background card */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-dark-700/40 to-dark-800/60 backdrop-blur-md rounded-3xl border border-${feature.color}-500/20 group-hover:border-${feature.color}-400/40 transition-all duration-500`} />
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center text-center p-10 h-full">
                    {/* Icon with enhanced styling */}
                    <div className={`relative mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <div className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-3xl shadow-2xl shadow-${feature.color}-500/25 group-hover:shadow-${feature.color}-500/50 transition-all duration-500`}>
                        <div className="text-white relative z-10">{feature.icon}</div>
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-white mb-6 text-xl group-hover:text-white transition-colors leading-tight">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-dark-300 leading-relaxed text-base group-hover:text-dark-200 transition-colors flex-grow">
                      {feature.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <motion.div
                      className={`mt-6 w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      initial={{ width: 0 }}
                      whileHover={{ width: 48 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  {/* Subtle border glow on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-${feature.color}-500/0 via-${feature.color}-500/10 to-${feature.color}-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;