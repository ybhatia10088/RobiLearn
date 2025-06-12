import React from 'react';
import { ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award, Zap, Code, Settings } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:120px_120px] animate-pulse" style={{animationDelay: '0.5s'}} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 max-w-3xl">
            <div className="space-y-8">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm">
                <Zap size={18} className="mr-3 text-yellow-400 animate-pulse" />
                <span className="text-blue-300 font-medium text-sm">Next-Generation Robot Simulation Platform</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block text-white mb-2">Build & Code</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  Virtual Robots
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl text-slate-300 font-light leading-relaxed">
                  Experience robotics like never before with our 
                  <span className="text-blue-400 font-medium"> physics-accurate 3D simulator</span>
                </p>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                  Program robots using natural language, visual blocks, or traditional code. 
                  No hardware required – just your imagination and creativity.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                  <div className="flex items-center justify-center">
                    <Play size={24} className="mr-4 group-hover:scale-110 transition-transform" />
                    <span>Launch Simulator</span>
                    <ArrowRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                </button>
                
                <button className="group border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-center justify-center">
                    <Code size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                    <span>View Examples</span>
                  </div>
                </button>
              </div>
              
              {/* Enhanced Social Proof */}
              <div className="flex flex-wrap items-center gap-8 pt-8 text-slate-400">
                <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-700">
                  <Users size={18} className="mr-3 text-blue-400" />
                  <span className="font-medium">10K+ Creators</span>
                </div>
                <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-700">
                  <Award size={18} className="mr-3 text-purple-400" />
                  <span className="font-medium">Real Physics</span>
                </div>
                <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-700">
                  <Star size={18} className="mr-3 text-yellow-400" />
                  <span className="font-medium">Open Source</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Right Side Preview */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-3xl">
              {/* Main simulator preview */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Top bar */}
                <div className="h-16 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 flex items-center px-6">
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-slate-300 font-bold text-lg">RoboSim Studio</span>
                    <span className="text-slate-500 text-sm ml-2">v2.0</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Settings size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
                
                {/* Main content */}
                <div className="h-[calc(100%-64px)] bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                  {/* Floating grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
                  
                  {/* Central robot */}
                  <div className="relative z-10 transform hover:scale-110 transition-transform duration-500">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl shadow-2xl shadow-blue-500/50 flex items-center justify-center animate-pulse">
                      <Cpu size={48} className="text-white animate-spin" style={{animationDuration: '8s'}} />
                    </div>
                    
                    {/* Robot glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl blur-xl opacity-50 animate-pulse" />
                  </div>
                  
                  {/* Floating UI elements */}
                  <div className="absolute top-1/4 left-1/6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 shadow-xl animate-bounce" style={{animationDuration: '3s'}}>
                    <Brain size={24} className="text-blue-400 mb-2" />
                    <div className="text-xs text-slate-300 font-mono">AI Assistant</div>
                  </div>
                  
                  <div className="absolute top-1/3 right-1/6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 shadow-xl animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
                    <Layers size={24} className="text-purple-400 mb-2" />
                    <div className="text-xs text-slate-300 font-mono">3D Physics</div>
                  </div>
                  
                  <div className="absolute bottom-1/3 left-1/4 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 shadow-xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1s'}}>
                    <Code size={24} className="text-cyan-400 mb-2" />
                    <div className="text-xs text-slate-300 font-mono">
                      <span className="text-cyan-300">robot</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-yellow-300">move</span>
                      <span className="text-slate-400">()</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 right-1/4 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-green-500/30 shadow-xl animate-bounce" style={{animationDuration: '2.8s', animationDelay: '1.5s'}}>
                    <div className="text-xs text-slate-300 font-mono">
                      <span className="text-green-400">✓</span> Simulation Ready
                    </div>
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500 cursor-pointer group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white p-8 rounded-full shadow-2xl shadow-blue-500/50 transform group-hover:scale-110 transition-all duration-300">
                      <Play size={40} className="ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Outer glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Feature Cards */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl mb-6 w-fit shadow-lg shadow-blue-500/25">
              <Cpu size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Multi-Robot Support</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Simulate industrial arms, mobile rovers, flying drones, and custom robots with realistic physics and sensors.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          
          <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl mb-6 w-fit shadow-lg shadow-purple-500/25">
              <Brain size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Coding</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Write robot programs using natural language commands or get intelligent code suggestions as you type.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          
          <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-xl mb-6 w-fit shadow-lg shadow-cyan-500/25">
              <Layers size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Real-World Physics</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Experience accurate collision detection, gravity, friction, and sensor feedback just like real robots.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;