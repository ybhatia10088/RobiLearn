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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/4 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Centered Content */}
            <div className="text-center max-w-6xl mx-auto">
              {/* Badge - No border */}
              <motion.div 
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Star size={16} className="mr-2" />
                <span>Built by students, powered by innovation</span>
              </motion.div>

              {/* Main Headline - Clean, no boxes */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] mb-8">
                  <div className="text-white mb-2">Master Robotics</div>
                  <div className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                    Without Hardware
                  </div>
                </h1>
              </motion.div>

              {/* Subtitle - Clean text, no boxes */}
              <motion.div 
                className="max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-dark-200 leading-relaxed font-light">
                  Learn robotics programming through immersive 3D simulations.
                  <br />
                  Code with natural language, visual blocks, or traditional programming.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
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

              {/* Social proof - Clean text */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-8 text-sm text-dark-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
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
            </div>
          </div>
          
          {/* Feature highlights - Clean cards without heavy borders */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
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
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-dark-700/20 backdrop-blur-sm hover:bg-dark-700/30 transition-all duration-300 h-full">
                  <div className={`bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-4 rounded-2xl mb-6 shadow-lg shadow-${feature.color}-500/20 group-hover:shadow-${feature.color}-500/40 group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="font-bold text-white mb-4 text-lg group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed text-sm group-hover:text-dark-200 transition-colors">
                    {feature.description}
                  </p>
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