import React from 'react';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award, Zap, Target, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Enhanced Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[25%] right-[20%] w-80 h-80 bg-secondary-500/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-accent-500/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              background: i % 3 === 0 
                ? 'rgba(96, 165, 250, 0.4)' 
                : i % 3 === 1 
                  ? 'rgba(139, 92, 246, 0.4)' 
                  : 'rgba(20, 184, 166, 0.4)'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Hexagonal Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI1MiIgdmlld0JveD0iMCAwIDYwIDUyIj48cGF0aCBkPSJNMzAgMEw1OCAxM1YzOUwzMCA1MkwyIDM5VjEzTDMwIDBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM1MjZhNmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] bg-[length:60px_52px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-4xl mx-auto">
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/15 to-secondary-500/15 backdrop-blur-md border border-primary-400/30 text-primary-200 text-base font-medium mb-10 shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
              >
                <Zap size={18} className="mr-2 text-primary-400 fill-current" />
                <span>Next-Gen Robotics Education</span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-10"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] tracking-tight">
                  <span className="block text-white mb-4">Master Robotics</span>
                  <div className="relative inline-block">
                    <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                      Without Hardware
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent blur-xl opacity-30 -z-10">
                      Without Hardware
                    </div>
                  </div>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-14 leading-relaxed max-w-3xl mx-auto font-light"
              >
                Learn professional robotics programming through physics-accurate simulations.
                <span className="block mt-2 text-primary-300 font-medium">
                  No expensive hardware required.
                </span>
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
              >
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-10 py-5 rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/30"
                  onClick={() => navigate('/simulator')}
                >
                  <div className="flex items-center justify-center relative z-10">
                    <Play size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-lg">Launch Simulator</span>
                    <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
                
                <button
                  className="group relative bg-dark-800/50 border border-primary-500/30 hover:border-primary-400 text-primary-200 hover:text-white font-medium px-10 py-5 rounded-xl backdrop-blur-md transition-all duration-500 hover:shadow-lg hover:shadow-primary-500/10"
                  onClick={() => navigate('/challenges')}
                >
                  <div className="flex items-center justify-center">
                    <Award size={20} className="mr-3 group-hover:text-accent-400 transition-colors" />
                    <span className="text-lg">Explore Challenges</span>
                  </div>
                </button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex flex-wrap justify-center gap-x-12 gap-y-6 px-8 py-5 bg-dark-800/30 backdrop-blur-md rounded-2xl border border-dark-700"
              >
                {[
                  { icon: Users, text: "10K+ Developers", color: "text-primary-400" },
                  { icon: Star, text: "4.9/5 Rating", color: "text-amber-400" },
                  { icon: Code, text: "Open Source", color: "text-emerald-400" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-3 p-2 bg-dark-700 rounded-lg">
                      <item.icon size={18} className={`${item.color}`} />
                    </div>
                    <span className="font-medium text-gray-300">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              { 
                icon: <Cpu size={28} className="text-primary-400" />, 
                title: 'Multiple Robot Types', 
                description: 'Control arms, mobile robots, drones in physics-accurate simulations',
                color: 'primary'
              },
              { 
                icon: <Brain size={28} className="text-secondary-400" />, 
                title: 'AI-Powered Learning', 
                description: 'Intelligent code suggestions and real-time feedback',
                color: 'secondary'
              },
              { 
                icon: <Layers size={28} className="text-accent-400" />, 
                title: 'Progressive Curriculum', 
                description: 'From basic movements to complex autonomous systems',
                color: 'accent'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700 group-hover:border-primary-500/30 transition-all duration-500 shadow-xl" />
                <div className="relative bg-gradient-to-b from-dark-800/50 to-dark-900/0 p-8 rounded-2xl h-full">
                  <div className="mb-6 flex justify-center">
                    <div className={`p-4 rounded-xl bg-${feature.color}-900/20 backdrop-blur-sm border border-${feature.color}-500/10`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-400 text-center leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex justify-center">
                    <div className={`h-1 w-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-full transition-all duration-500 group-hover:w-16`} />
                  </div>
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
