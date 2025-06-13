import React from 'react';
import {
  ArrowRight, Play, Cpu, Brain, Layers, Star, Users, Award,
} from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';

const features = [
  {
    icon: <Cpu size={28} />,
    title: 'Multiple Robot Types',
    description: 'Control arms, mobile robots, drones, and specialized bots in realistic physics simulations.',
    color: 'primary',
  },
  {
    icon: <Brain size={28} />,
    title: 'AI-Powered Learning',
    description: 'Natural language programming with intelligent code suggestions and real-time feedback.',
    color: 'secondary',
  },
  {
    icon: <Layers size={28} />,
    title: 'Progressive Curriculum',
    description: 'Structured learning path from basic movements to complex autonomous systems.',
    color: 'accent',
  },
];

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-primary-500/15 text-primary-400 text-base font-medium mb-8 shadow backdrop-blur">
            <Star size={18} className="mr-2" />
            Built by students, powered by innovation
          </div>

          {/* Main Headline */}
          <h1 className="text-center font-black leading-tight mb-6">
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-lg">
              Master Robotics
            </span>
            <span className="block bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl mt-2">
              Without Hardware
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-dark-200 mb-12 max-w-2xl mx-auto font-light text-center tracking-wide">
            Learn robotics programming through immersive 3D simulations. No hardware required.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-14">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-400"
              onClick={() => navigate('/simulator')}
            >
              <span className="flex items-center justify-center relative z-10">
                <Play size={22} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Start Simulator
                <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button
              className="group bg-transparent text-primary-400 hover:text-white text-lg px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-primary-500/10 backdrop-blur-sm hover:shadow-xl hover:shadow-primary-500/10 focus:outline-none focus:ring-2 focus:ring-primary-400"
              onClick={() => navigate('/challenges')}
            >
              <span className="flex items-center justify-center">
                <Award size={22} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                View Challenges
              </span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-base text-dark-300 mb-10">
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
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-dark-700/30 border border-dark-600/30 backdrop-blur-sm hover:bg-dark-700/40 transition-all duration-300 h-full shadow-md"
              >
                <div className={`bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-4 rounded-2xl mb-6 shadow-lg shadow-${feature.color}-500/20 group-hover:shadow-${feature.color}-500/40 group-hover:scale-110 transition-all duration-300`}>
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="font-bold text-white mb-3 text-lg group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-300 leading-relaxed text-base group-hover:text-dark-200 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
