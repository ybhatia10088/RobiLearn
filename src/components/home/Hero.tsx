import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award, Zap, Shield, Target } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Sophisticated Background System */}
      <div className="absolute inset-0">
        {/* Primary ambient lighting */}
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-radial from-primary-500/12 via-primary-500/6 to-transparent rounded-full blur-3xl transition-all duration-[3000ms] ease-out"
          style={{
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${15 + mousePosition.y * 0.02}%`,
          }}
        />
        
        {/* Secondary accent lighting */}
        <div 
          className="absolute w-[500px] h-[500px] bg-gradient-radial from-secondary-500/10 via-secondary-500/5 to-transparent rounded-full blur-3xl transition-all duration-[4000ms] ease-out"
          style={{
            right: `${15 + mousePosition.x * 0.015}%`,
            bottom: `${20 + mousePosition.y * 0.015}%`,
          }}
        />
        
        {/* Tertiary depth layer */}
        <div 
          className="absolute w-[800px] h-[800px] bg-gradient-radial from-accent-500/8 via-accent-500/3 to-transparent rounded-full blur-3xl transition-all duration-[5000ms] ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
      </div>
      
      {/* Professional Grid System */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:80px_80px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:400px_400px] opacity-30" />
      </div>
      
      {/* Floating Elements for Depth */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-primary-400/40 rounded-full animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 8}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-screen py-20">
            
            {/* Premium Status Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary-500/15 via-primary-500/10 to-secondary-500/15 text-primary-300 text-sm font-semibold mb-12 backdrop-blur-md border border-primary-500/20 shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all duration-500 group">
              <div className="w-2 h-2 bg-success-400 rounded-full mr-3 animate-pulse" />
              <Star size={16} className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
              <span className="tracking-wide">Advanced Robotics Education Platform</span>
              <div className="w-2 h-2 bg-primary-400 rounded-full ml-3 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Headline with Superior Typography */}
            <div className="text-center mb-16 max-w-6xl">
              <h1 className="relative">
                {/* Main headline */}
                <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight mb-6">
                  <div className="text-white mb-4 drop-shadow-sm">
                    Master Robotics
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent font-black">
                      Without Hardware
                    </div>
                    {/* Sophisticated underline */}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400/60 via-secondary-400/60 to-accent-400/60 rounded-full opacity-80" />
                  </div>
                </div>
                
                {/* Floating accent elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-xl animate-pulse hidden lg:block" />
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-full blur-xl animate-pulse hidden lg:block" style={{ animationDelay: '1s' }} />
              </h1>

              {/* Professional Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl text-dark-200 leading-relaxed tracking-wide max-w-4xl mx-auto font-light mb-8">
                Learn robotics programming through immersive 3D simulations with{' '}
                <span className="text-primary-400 font-medium">real-time feedback</span> and{' '}
                <span className="text-secondary-400 font-medium">interactive challenges</span>.
              </p>
              
              {/* Value Proposition */}
              <p className="text-lg text-dark-300 max-w-2xl mx-auto leading-relaxed">
                Master complex robotic systems without expensive hardware investments.
              </p>
            </div>

            {/* Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <button 
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white text-lg px-12 py-6 rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-2 active:translate-y-0 hover:scale-105 border border-primary-400/20"
                onClick={() => navigate('/simulator')}
              >
                <div className="flex items-center justify-center relative z-10">
                  <Play size={24} className="mr-4 group-hover:scale-125 transition-transform duration-300" />
                  <span className="tracking-wide">Launch Simulator</span>
                  <ArrowRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              
              <button 
                className="group relative bg-transparent text-primary-400 hover:text-white text-lg px-12 py-6 rounded-2xl font-semibold transition-all duration-500 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2 active:translate-y-0 border-2 border-primary-400/30 hover:border-primary-400/60"
                onClick={() => navigate('/challenges')}
              >
                <div className="flex items-center justify-center relative z-10">
                  <Award size={24} className="mr-4 group-hover:scale-125 transition-transform duration-300" />
                  <span className="tracking-wide">Explore Challenges</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

            {/* Enhanced Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-12 text-base text-dark-300 mb-16">
              <div className="flex items-center group hover:text-primary-400 transition-all duration-300 cursor-pointer">
                <Users size={20} className="mr-3 text-primary-400 group-hover:scale-125 transition-transform duration-300" />
                <div className="text-center">
                  <div className="font-semibold tracking-wide">100+</div>
                  <div className="text-xs text-dark-500">Beta Users</div>
                </div>
              </div>
              <div className="flex items-center group hover:text-secondary-400 transition-all duration-300 cursor-pointer">
                <Award size={20} className="mr-3 text-secondary-400 group-hover:scale-125 transition-transform duration-300" />
                <div className="text-center">
                  <div className="font-semibold tracking-wide">10+</div>
                  <div className="text-xs text-dark-500">Challenges</div>
                </div>
              </div>
              <div className="flex items-center group hover:text-accent-400 transition-all duration-300 cursor-pointer">
                <Star size={20} className="mr-3 text-accent-400 group-hover:scale-125 transition-transform duration-300" />
                <div className="text-center">
                  <div className="font-semibold tracking-wide">4.7★</div>
                  <div className="text-xs text-dark-500">User Rating</div>
                </div>
              </div>
            </div>

            {/* Professional Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {[
                {
                  icon: <Cpu size={32} />, 
                  title: 'Advanced Simulation Engine',
                  description: 'Industry-grade physics simulation with multiple robot types including arms, mobile platforms, and autonomous drones.',
                  color: 'primary',
                  stats: '5 Robot Types'
                },
                {
                  icon: <Brain size={32} />, 
                  title: 'AI-Powered Programming',
                  description: 'Natural language programming with intelligent code suggestions, automated debugging, and personalized learning paths.',
                  color: 'secondary',
                  stats: 'Smart Assistance'
                },
                {
                  icon: <Layers size={32} />, 
                  title: 'Progressive Curriculum',
                  description: 'Comprehensive learning path from basic movements to advanced autonomous systems and machine learning integration.',
                  color: 'accent',
                  stats: '10+ Lessons'
                }
              ].map((feature, index) => (
                <div key={feature.title} className="group relative">
                  <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-br from-dark-700/30 to-dark-800/30 backdrop-blur-md hover:from-dark-700/50 hover:to-dark-800/50 transition-all duration-500 h-full border border-dark-600/30 hover:border-dark-500/50 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                    
                    {/* Icon with enhanced styling */}
                    <div className={`relative bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-6 rounded-3xl mb-6 shadow-xl shadow-${feature.color}-500/30 group-hover:shadow-${feature.color}-500/50 group-hover:scale-110 transition-all duration-500 border border-${feature.color}-400/20`}>
                      <div className="text-white relative z-10">{feature.icon}</div>
                      <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-700 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    </div>
                    
                    {/* Stats badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full bg-${feature.color}-500/10 text-${feature.color}-400 text-xs font-medium mb-4 border border-${feature.color}-500/20`}>
                      {feature.stats}
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-white mb-4 text-xl group-hover:text-white transition-colors leading-tight">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-dark-300 leading-relaxed group-hover:text-dark-200 transition-colors text-sm">
                      {feature.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-${feature.color}-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-sm text-dark-400">
              <div className="flex items-center">
                <Shield size={16} className="mr-2 text-success-400" />
                <span>Lightning-Fast Performance</span>
              </div>
              <div className="flex items-center">
                <Zap size={16} className="mr-2 text-warning-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <Target size={16} className="mr-2 text-primary-400" />
                <span>User Friendly Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
