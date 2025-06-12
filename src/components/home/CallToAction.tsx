import React from 'react';
import { ArrowRight, Play, BookOpen, Users, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  
  const benefits = [
    'No hardware required - start learning immediately',
    'Industry-standard simulation technology',
    'Progressive curriculum from beginner to expert',
    'AI-powered programming assistance',
    'Real-world robotics scenarios',
    'Global community of learners'
  ];
  
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                <Zap size={16} className="mr-2" />
                <span>Start Your Robotics Journey Today</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
                Ready to Build the
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  Future of Robotics?
                </span>
              </h2>
              
              <p className="text-xl text-dark-300 mb-10 leading-relaxed">
                Join thousands of students, educators, and professionals who are mastering 
                robotics programming through our comprehensive simulation platform.
              </p>
              
              {/* Benefits list */}
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="bg-success-500/20 rounded-full p-1 mr-4 mt-0.5 flex-shrink-0">
                      <CheckCircle size={16} className="text-success-400" />
                    </div>
                    <span className="text-dark-200">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="group btn-primary text-lg px-8 py-4 flex items-center justify-center hover:shadow-glow-lg transition-all duration-300"
                  onClick={() => navigate('/simulator')}
                >
                  <Play size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                  <span>Launch Simulator</span>
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="btn-outline text-lg px-8 py-4 flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('/challenges')}
                >
                  <BookOpen size={20} className="mr-3" />
                  <span>Browse Challenges</span>
                </button>
              </div>
            </motion.div>
            
            {/* Right side - Interactive card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-3xl border border-dark-600 overflow-hidden shadow-2xl">
                {/* Card header */}
                <div className="bg-dark-800 px-8 py-6 border-b border-dark-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Start Learning Today
                      </h3>
                      <p className="text-dark-300">
                        Choose your learning path
                      </p>
                    </div>
                    <div className="bg-primary-500/20 rounded-full p-3">
                      <Users size={24} className="text-primary-400" />
                    </div>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Learning paths */}
                    {[
                      {
                        title: 'Beginner Path',
                        description: 'Start with basic robot movements',
                        duration: '2-4 weeks',
                        color: 'success',
                        icon: <BookOpen size={20} />
                      },
                      {
                        title: 'Intermediate Path',
                        description: 'Sensor integration and navigation',
                        duration: '4-8 weeks',
                        color: 'primary',
                        icon: <Zap size={20} />
                      },
                      {
                        title: 'Advanced Path',
                        description: 'Autonomous systems and AI',
                        duration: '8-12 weeks',
                        color: 'accent',
                        icon: <ArrowRight size={20} />
                      }
                    ].map((path, index) => (
                      <motion.div
                        key={path.title}
                        className={`p-4 rounded-xl bg-${path.color}-900/20 border border-${path.color}-700/30 hover:border-${path.color}-600/50 transition-all duration-300 cursor-pointer group`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`bg-${path.color}-500/20 rounded-lg p-2 mr-4 text-${path.color}-400`}>
                              {path.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {path.title}
                              </h4>
                              <p className="text-sm text-dark-300">
                                {path.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium text-${path.color}-400`}>
                              {path.duration}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-8 pt-6 border-t border-dark-600">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-400 mb-1">
                          10k+
                        </div>
                        <div className="text-xs text-dark-400">
                          Students
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary-400 mb-1">
                          100+
                        </div>
                        <div className="text-xs text-dark-400">
                          Challenges
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent-400 mb-1">
                          4.9★
                        </div>
                        <div className="text-xs text-dark-400">
                          Rating
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-primary-500 rounded-full p-3 shadow-glow"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Play size={20} className="text-white" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-secondary-500 rounded-full p-3 shadow-glow"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <BookOpen size={20} className="text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;