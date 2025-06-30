import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { 
  Target, Users, Lightbulb, Code, Rocket, Quote, 
  Mail, Github, Linkedin, Zap, Globe, Award,
  Bot, Brain, GraduationCap, ArrowRight, Play, Shield,
  TrendingUp, Clock, CheckCircle, Coffee, Building2,
  Cpu, Database, Network, Terminal
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const founders = [
    {
      name: 'Utkarsh Priyadarshi',
      role: 'Co-Founder & Technical Lead',
      description: 'Utkarsh is an undergraduate student passionate about robotics, interpretability, and automation. He focuses on motion planning algorithms, simulation physics, and making complex robotics concepts accessible through practical implementation.',
      quote: 'Our goal was to abstract complexity, not curiosity.',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Yugav Bhatia',
      role: 'Co-Founder & Product Lead',
      description: 'Yugav is a computer science undergraduate focused on solving real-world problems through scalable software solutions. He leads the platform architecture and user experience design, ensuring our tools are both powerful and intuitive.',
      quote: 'We built the kind of tool we wished we had when we first started learning robotics.',
      linkedin: '#',
      github: '#',
    }
  ];

  const values = [
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: 'Education First',
      description: 'Making advanced robotics education accessible to everyone, regardless of hardware limitations or financial constraints.',
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: 'Hands-On Learning',
      description: 'We believe practical experience drives understanding. Our platform enables experimentation and discovery through direct interaction.',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Community Driven',
      description: 'Built by students who understand the learning journey. We create tools that address real educational challenges.',
    },
    {
      icon: <Rocket className="w-7 h-7" />,
      title: 'Technical Excellence',
      description: 'Pushing the boundaries of browser-based simulation while maintaining performance and accuracy.',
    }
  ];

  const stats = [
    { 
      number: '500+', 
      label: 'Active Users', 
      icon: <Users className="w-6 h-6" />,
      description: 'Students & Educators'
    },
    { 
      number: '15+', 
      label: 'Simulation Models', 
      icon: <Bot className="w-6 h-6" />,
      description: 'Robot Types Available'
    },
    { 
      number: '99.9%', 
      label: 'Uptime', 
      icon: <Shield className="w-6 h-6" />,
      description: 'Platform Reliability'
    },
    { 
      number: '25+', 
      label: 'Challenges', 
      icon: <Award className="w-6 h-6" />,
      description: 'Learning Scenarios'
    }
  ];

  const timeline = [
    {
      year: '2024',
      quarter: 'Q3',
      title: 'Research & Foundation',
      description: 'Identified the accessibility gap in robotics education and began developing our core simulation engine.',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      year: '2024',
      quarter: 'Q4',
      title: 'Platform Development',
      description: 'Built the foundational architecture with physics simulation, sensor modeling, and programming interfaces.',
      icon: <Code className="w-5 h-5" />,
    },
    {
      year: '2025',
      quarter: 'Q1',
      title: 'Alpha Testing',
      description: 'Launched closed alpha with core features and gathered feedback from early academic partners.',
      icon: <Database className="w-5 h-5" />,
    },
    {
      year: '2025',
      quarter: 'Q2',
      title: 'Public Launch',
      description: 'Released comprehensive platform with AI assistance, expanded robot library, and interactive learning paths.',
      icon: <Network className="w-5 h-5" />,
    }
  ];

  const capabilities = [
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Code Editor',
      description: 'Full IDE experience'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Physics Engine',
      description: 'Real-time simulation'
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'Sensor Suite',
      description: 'LiDAR, cameras, IMU'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Assistant',
      description: 'Contextual guidance'
    }
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-zinc-950 text-white">
      {/* Enhanced Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Sophisticated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-3xl" />
        </div>

        {/* Refined grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Refined badge */}
            <motion.div 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-300 text-base font-medium mb-12 backdrop-blur-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Building2 className="w-5 h-5 mr-3 text-blue-400" />
              <span>Advanced Robotics Simulation Platform</span>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white">About </span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                RoboSim
              </span>
            </motion.h1>

            <motion.p 
              className="text-2xl lg:text-3xl text-zinc-300 mb-16 leading-relaxed max-w-4xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              A comprehensive browser-based robotics simulation platform designed for education, 
              research, and rapid prototyping. <span className="text-blue-400 font-medium">No hardware required.</span>
            </motion.p>

            {/* Enhanced capability highlights */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {capabilities.map((capability, index) => (
                <div key={capability.title} className="bg-zinc-900/60 rounded-xl p-6 border border-zinc-800/60 hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm">
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {capability.icon}
                  </div>
                  <div className="text-base font-semibold text-white mb-2">{capability.title}</div>
                  <div className="text-sm text-zinc-400">{capability.description}</div>
                </div>
              ))}
            </motion.div>

            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <button className="group bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold px-10 py-5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5">
                <div className="flex items-center justify-center">
                  <Play className="w-6 h-6 mr-3" />
                  <span>Launch Platform</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
              <button className="group bg-zinc-800/80 hover:bg-zinc-700 text-white text-xl font-semibold px-10 py-5 rounded-xl transition-all duration-200 border border-zinc-700 hover:border-zinc-600 backdrop-blur-sm">
                <div className="flex items-center justify-center">
                  <Github className="w-6 h-6 mr-3" />
                  <span>View Source</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Professional Mission Section */}
      <section className="py-20 lg:py-24 bg-zinc-900/50">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Our <span className="text-blue-400">Mission</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8"></div>
            </div>
            
            <div className="bg-zinc-800/50 rounded-2xl p-12 border border-zinc-700/50">
              <p className="text-xl lg:text-2xl text-zinc-200 leading-relaxed mb-10 text-center">
                Democratizing access to advanced robotics education through innovative 
                browser-based simulation technology.
              </p>
              
              <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 text-center">
                <Quote className="w-8 h-8 text-blue-400 mx-auto mb-6" />
                <p className="text-lg text-zinc-300 font-medium mb-6">
                  The fundamental question that drives our work:
                </p>
                <blockquote className="text-2xl lg:text-3xl font-bold text-blue-400 mb-6">
                  "Why should hardware limitations prevent anyone from learning robotics?"
                </blockquote>
                <div className="flex items-center justify-center">
                  <p className="text-lg text-zinc-300 font-medium">
                    Our solution: <span className="text-green-400 font-semibold">Remove the barriers.</span>
                  </p>
                  <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Stats Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="bg-blue-600/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-600/20">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-3">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-zinc-300 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Professional Founders Section */}
      <section className="py-20 lg:py-24 bg-zinc-900/30">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Leadership <span className="text-blue-400">Team</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8"></div>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Founded by students who experienced the challenges of robotics education firsthand
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                className="group"
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="bg-zinc-800/50 rounded-2xl p-10 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 h-full">
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">{founder.name}</h3>
                    <p className="text-lg text-blue-400 font-semibold mb-6">{founder.role}</p>
                    
                    {/* Social links */}
                    <div className="flex space-x-4">
                      <a 
                        href={founder.linkedin}
                        className="bg-zinc-700/50 hover:bg-zinc-600/50 p-3 rounded-lg transition-colors border border-zinc-600/50"
                      >
                        <Linkedin className="w-5 h-5 text-zinc-400" />
                      </a>
                      <a 
                        href={founder.github}
                        className="bg-zinc-700/50 hover:bg-zinc-600/50 p-3 rounded-lg transition-colors border border-zinc-600/50"
                      >
                        <Github className="w-5 h-5 text-zinc-400" />
                      </a>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                      {founder.description}
                    </p>
                  </div>

                  {/* Quote */}
                  <div className="bg-zinc-900/50 rounded-xl p-6 border-l-4 border-blue-500">
                    <Quote className="w-5 h-5 text-blue-400 mb-3" />
                    <blockquote className="text-white font-medium italic text-lg leading-relaxed">
                      "{founder.quote}"
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Values Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Core <span className="text-blue-400">Principles</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8"></div>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              The fundamental values that guide our platform development and educational approach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 h-full">
                  <div className="bg-blue-600/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-blue-400 border border-blue-600/20">
                    {value.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Timeline Section */}
      <section className="py-20 lg:py-24 bg-zinc-900/30">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Development <span className="text-blue-400">Timeline</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-8"></div>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              From initial concept to comprehensive platform
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
              
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year + item.quarter}
                  className="relative flex items-start mb-12 last:mb-0"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-6 h-6 bg-blue-500 rounded-full border-4 border-zinc-950 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="ml-20 bg-zinc-800/50 rounded-xl p-8 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                        {item.year} {item.quarter}
                      </span>
                      <div className="ml-3 text-blue-400">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-lg text-zinc-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Call to Action */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-zinc-900 to-zinc-950 relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Robotics Education?
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-zinc-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join educators, students, and researchers who are already using RoboSim 
              to advance robotics education and research.
            </p>
            
            <div className="bg-zinc-800/50 rounded-2xl p-10 border border-zinc-700/50 mb-12">
              <p className="text-2xl lg:text-3xl font-bold text-white mb-4">
                From first algorithm to advanced research
              </p>
              <p className="text-xl text-blue-400 font-semibold">
                — all in your browser.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold px-10 py-5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25">
                <div className="flex items-center justify-center">
                  <Rocket className="w-6 h-6 mr-3" />
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
              <button className="group bg-zinc-800 hover:bg-zinc-700 text-white text-xl font-semibold px-10 py-5 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600">
                <div className="flex items-center justify-center">
                  <Users className="w-6 h-6 mr-3" />
                  <span>Join Community</span>
                </div>
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-zinc-400 text-lg font-medium mb-4">
                Built by students, for the robotics community
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Coffee className="w-5 h-5 text-zinc-500" />
                <span className="text-zinc-500 font-medium">Powered by curiosity and countless hours of development</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
