import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award } from 'lucide-react';

const Hero = () => {
  const [armPosition, setArmPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setArmPosition(prev => (prev + 1) % 3);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-20"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
      
      {/* Robotic Arm Animation */}
      <div className="absolute top-20 right-8 hidden lg:block">
        <div className="relative w-48 h-64">
          {/* Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-t from-gray-700 to-gray-600 rounded-lg"></div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
          
          {/* First arm segment */}
          <div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-3 h-20 bg-gradient-to-t from-gray-700 to-gray-600 rounded-full transition-transform duration-1000 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${armPosition === 0 ? 0 : armPosition === 1 ? 15 : -10}deg)`
            }}
          >
            {/* Joint */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
            
            {/* Second arm segment */}
            <div 
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-3 h-20 bg-gradient-to-t from-gray-700 to-gray-600 rounded-full transition-transform duration-1000 origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${armPosition === 0 ? 0 : armPosition === 1 ? -30 : 25}deg)`
              }}
            >
              {/* End effector */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-3 bg-blue-500 rounded-sm"></div>
                <div className="w-2 h-3 bg-blue-500 rounded-sm ml-1"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Status display */}
          <div className={`absolute top-0 right-0 transition-all duration-500 ${armPosition === 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-400/30 rounded-lg p-2 text-xs">
              <div className="text-blue-400 font-mono">ROBOT ARM</div>
              <div className="text-green-400 font-mono">ACTIVE</div>
              <div className="flex items-center mt-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse mr-1"></div>
                <span className="text-green-300 text-xs">LEARNING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Robot */}
      <div className="absolute top-32 left-8 hidden lg:block animate-bounce">
        <div className="relative">
          {/* Robot body */}
          <div className="w-16 h-20 bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl relative">
            {/* Head */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full">
              {/* Eyes */}
              <div className="absolute top-3 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-blue-400"></div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Arms */}
            <div className="absolute top-2 -left-2 w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full"></div>
            <div className="absolute top-2 -right-2 w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full"></div>
            
            {/* Chest panel */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-800 rounded border border-blue-400/30">
              <div className="w-full h-1 bg-blue-400/50 mt-1"></div>
              <div className="w-3/4 h-1 bg-green-400/50 mt-1 ml-1"></div>
              <div className="w-1/2 h-1 bg-purple-400/50 mt-1 ml-1"></div>
            </div>
          </div>
          
          {/* Speech bubble */}
          <div className="absolute -top-8 -right-4 bg-blue-900/40 backdrop-blur-sm border border-blue-400/30 rounded-lg px-2 py-1">
            <div className="text-blue-400 text-xs font-mono">Hello!</div>
            <div className="absolute bottom-0 left-2 transform translate-y-full">
              <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-blue-400/30"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center min-h-[80vh]">
            {/* Centered Content */}
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm border border-blue-400/20 hover:bg-blue-500/20 transition-all duration-300 animate-pulse">
                <Star size={16} className="mr-2" />
                <span>Built by students, powered by innovation</span>
              </div>

              {/* Main Headline */}
              <div className="relative">
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight mb-8">
                  <div className="text-white">Master Robotics</div>
                  <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black relative">
                    Without Hardware
                    {/* Animated underline */}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full opacity-50 animate-pulse"></div>
                  </div>
                </h1>
                
                {/* Floating code elements */}
                <div className="absolute -top-4 -right-8 hidden xl:block">
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30 text-xs font-mono text-blue-300 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
                    <div>robot.moveForward()</div>
                    <div className="text-green-400"># Learning...</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-8 hidden xl:block">
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30 text-xs font-mono text-purple-300 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
                    <div>arm.grab(object)</div>
                    <div className="text-green-400"># Success!</div>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 leading-snug tracking-wide max-w-3xl mx-auto font-light text-balance w-full text-center">
                Master Robotics Without Hardware. Learn robotics programming through immersive 3D simulations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-10 py-5 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 active:translate-y-0 hover:scale-105">
                  <div className="flex items-center justify-center relative z-10">
                    <Play size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Start Simulator</span>
                    <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <button className="group bg-transparent text-blue-400 hover:text-white text-lg px-10 py-5 rounded-2xl font-semibold transition-all duration-300 hover:bg-blue-500/10 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 active:translate-y-0 border border-blue-400/20 hover:border-blue-400/40">
                  <div className="flex items-center justify-center">
                    <Award size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Challenges</span>
                  </div>
                </button>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center group hover:text-blue-400 transition-colors duration-300">
                  <Users size={18} className="mr-2 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Growing Community</span>
                </div>
                <div className="flex items-center group hover:text-purple-400 transition-colors duration-300">
                  <Award size={18} className="mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Interactive Learning</span>
                </div>
                <div className="flex items-center group hover:text-cyan-400 transition-colors duration-300">
                  <Star size={18} className="mr-2 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Open Source</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu size={28} />, title: 'Multiple Robot Types',
                description: 'Control arms, mobile robots, drones, and specialized bots in realistic physics simulations', 
                color: 'blue'
              },
              {
                icon: <Brain size={28} />, title: 'AI-Powered Learning',
                description: 'Natural language programming with intelligent code suggestions and real-time feedback', 
                color: 'purple'
              },
              {
                icon: <Layers size={28} />, title: 'Progressive Curriculum',
                description: 'Structured learning path from basic movements to complex autonomous systems', 
                color: 'cyan'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group relative">
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 transition-all duration-300 h-full border border-gray-700/30 hover:border-gray-600/50 hover:shadow-xl hover:-translate-y-1">
                  <div className={`bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-4 rounded-2xl mb-6 shadow-lg group-hover:shadow-${feature.color}-500/40 group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="font-bold text-white mb-4 text-lg group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
