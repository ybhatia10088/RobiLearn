import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Lightbulb, Code, Cpu, Rocket, Star, Quote, ExternalLink, Mail, Github, Linkedin, BookOpen, Zap, Globe, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  const founders = [
    {
      name: 'Utkarsh Priyadarshi',
      role: 'Co-Founder & Robotics Engineer',
      emoji: '🧠',
      description: 'Utkarsh is an undergraduate student passionate about robotics, systems design, and automation. He enjoys building projects that combine theory with practical application — especially when it comes to motion planning and simulation. With a strong interest in how robots interact with real-world environments, Utkarsh focuses on making our platform realistic and technically sound.',
      quote: 'We wanted to make robotics feel less intimidating and more fun — like a playground for builders.',
      linkedin: '#',
      color: 'primary'
    },
    {
      name: 'Yugav Bhatia',
      role: 'Co-Founder & Software Engineer',
      emoji: '⚙️',
      description: 'Yugav is a computer science undergrad with a love for solving real-world problems through code. From web development to simulation logic, he brings the building blocks together to create a cohesive and intuitive user experience. He\'s especially passionate about educational technology and believes in learning by doing — which is exactly what this platform supports.',
      quote: 'We built the kind of tool we wished we had when we first started learning robotics.',
      linkedin: '#',
      color: 'primary'
    }
  ];

  const values = [
    {
      icon: <Target size={24} />,
      title: 'Accessibility First',
      description: 'Making robotics education available to everyone, regardless of hardware limitations or budget constraints.',
      color: 'primary'
    },
    {
      icon: <Lightbulb size={24} />,
      title: 'Learning by Doing',
      description: 'We believe hands-on experience is the best teacher. Our platform encourages experimentation and discovery.',
      color: 'accent'
    },
    {
      icon: <Users size={24} />,
      title: 'Community Driven',
      description: 'Built by students, for students. We understand the challenges learners face because we\'ve been there.',
      color: 'secondary'
    },
    {
      icon: <Rocket size={24} />,
      title: 'Innovation Focus',
      description: 'Pushing the boundaries of what\'s possible in browser-based robotics simulation and education.',
      color: 'success'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Reached', icon: <Users size={24} /> },
    { number: '50+', label: 'Universities', icon: <Globe size={24} /> },
    { number: '100+', label: 'Challenges', icon: <Award size={24} /> },
    { number: '99.9%', label: 'Uptime', icon: <Zap size={24} /> }
  ];

  const timeline = [
    {
      year: '2023',
      title: 'The Question',
      description: 'Started with a simple question: why is it so hard to get started in robotics without expensive hardware?'
    },
    {
      year: '2024',
      title: 'First Prototype',
      description: 'Built our first browser-based robot simulator with basic movement and sensor capabilities.'
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Launched RoboSim with multiple robot types, AI-powered programming, and comprehensive challenges.'
    },
    {
      year: '2025',
      title: 'Growing Community',
      description: 'Expanding our platform with new features, models, and challenges based on user feedback.'
    }
  ];

  return (
    <Layout>
      <div className="relative min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-8 backdrop-blur-sm border border-primary-500/20">
                <Heart size={16} className="mr-2" />
                <span>Built with passion by students, for students</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
                <div className="text-white">About</div>
                <div className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  RoboSim
                </div>
              </h1>

              <p className="text-xl md:text-2xl text-dark-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                We're building a robotics simulator that makes learning and experimenting with robots 
                easier, more accessible, and more engaging.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 hover:-translate-y-1">
                  <div className="flex items-center justify-center">
                    <Mail size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Get in Touch</span>
                  </div>
                </button>
                <button className="group bg-transparent text-primary-400 hover:text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-primary-500/10 backdrop-blur-sm border border-primary-500/30 hover:border-primary-500/50">
                  <div className="flex items-center justify-center">
                    <Github size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Source</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-dark-800/50">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Our <span className="text-primary-400">Mission</span>
              </h2>
              
              <div className="bg-dark-700/50 rounded-3xl p-8 md:p-12 border border-dark-600/50 backdrop-blur-sm">
                <p className="text-xl md:text-2xl text-dark-200 leading-relaxed mb-8">
                  Whether you're a student testing out algorithms, a hobbyist exploring motion dynamics, 
                  or a teacher looking for hands-on tools — our platform helps bring robotics to life, 
                  directly in your browser.
                </p>
                
                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-6 border border-primary-500/20">
                  <p className="text-lg text-white font-medium mb-4">
                    This project started with a simple question:
                  </p>
                  <blockquote className="text-2xl md:text-3xl font-bold text-primary-400 italic">
                    "Why is it so hard to get started in robotics without expensive hardware?"
                  </blockquote>
                  <p className="text-lg text-white font-medium mt-4">
                    Our answer: <span className="text-accent-400">it shouldn't be.</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="bg-primary-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-400 border border-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-dark-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-20 bg-dark-800/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Meet the <span className="text-secondary-400">Founders</span>
              </h2>
              <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                Two passionate students on a mission to democratize robotics education
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {founders.map((founder, index) => (
                <motion.div
                  key={founder.name}
                  className="group"
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <div className="bg-dark-700/50 rounded-3xl p-8 transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm border border-dark-600/30 relative overflow-hidden">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    
                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                      <div className="text-6xl mb-4 bg-primary-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-primary-500/30 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                        {founder.emoji}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">{founder.name}</h3>
                      <p className="text-primary-400 font-medium mb-6 group-hover:text-primary-300 transition-colors duration-300">{founder.role}</p>
                      
                      {/* Social Links */}
                      <div className="flex justify-center space-x-3">
                        <a 
                          href={founder.linkedin}
                          className="bg-primary-500/10 hover:bg-primary-500/20 p-2 rounded-lg transition-all duration-300 border border-primary-500/30 hover:border-primary-500/50 hover:shadow-lg"
                        >
                          <Linkedin size={18} className="text-primary-400 hover:text-primary-300 transition-colors duration-300" />
                        </a>
                        <a 
                          href="#"
                          className="bg-primary-500/10 hover:bg-primary-500/20 p-2 rounded-lg transition-all duration-300 border border-primary-500/30 hover:border-primary-500/50 hover:shadow-lg"
                        >
                          <Github size={18} className="text-primary-400 hover:text-primary-300 transition-colors duration-300" />
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8 relative z-10">
                      <p className="text-dark-300 leading-relaxed group-hover:text-dark-200 transition-colors duration-300">
                        {founder.description}
                      </p>
                    </div>

                    {/* Quote - Redesigned to be more natural */}
                    <div className="bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-xl p-6 border-l-4 border-primary-500/50 relative z-10 group-hover:bg-gradient-to-r group-hover:from-primary-500/10 group-hover:to-secondary-500/10 group-hover:border-primary-500/70 transition-all duration-300">
                      <Quote size={20} className="text-primary-400 mb-3 group-hover:text-primary-300 transition-colors duration-300" />
                      <blockquote className="text-white font-medium italic text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                        "{founder.quote}"
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Why This <span className="text-accent-400">Matters</span>
              </h2>
              <p className="text-xl text-dark-300 max-w-3xl mx-auto">
                We know what it's like to be students trying to learn complex systems with limited resources. 
                That's why we designed this simulator to be lightweight, browser-based, and approachable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="group text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={`bg-${value.color}-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-${value.color}-400 border border-${value.color}-500/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${value.color}-500/20 transition-all duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed group-hover:text-dark-200 transition-colors">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-dark-800/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Looking <span className="text-success-400">Ahead</span>
              </h2>
              <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                Our journey from a simple question to a comprehensive robotics learning platform
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-500"></div>
                
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className="relative flex items-start mb-12 last:mb-0"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-4 h-4 bg-primary-500 rounded-full border-4 border-dark-900 shadow-lg shadow-primary-500/50"></div>
                    
                    {/* Content */}
                    <div className="ml-20 bg-dark-700/50 rounded-2xl p-6 border border-dark-600/50 backdrop-blur-sm hover:border-primary-500/30 transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-bold border border-primary-500/30">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-dark-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
                Ready to Join Our
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  Robotics Journey?
                </span>
              </h2>
              
              <p className="text-xl text-dark-300 mb-12 leading-relaxed">
                We're continuing to improve this platform every day, adding new models, features, 
                and challenges based on user feedback. If you have ideas, want to collaborate, 
                or just want to explore, we'd love to hear from you.
              </p>
              
              <div className="bg-dark-700/50 rounded-3xl p-8 border border-dark-600/50 backdrop-blur-sm mb-12">
                <p className="text-2xl font-bold text-white mb-4">
                  Whether you're here to run your first robot program or prototype a full challenge scenario
                </p>
                <p className="text-xl text-primary-400 font-medium">
                  — you're in the right place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 hover:-translate-y-1">
                  <div className="flex items-center justify-center">
                    <Rocket size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Start Learning</span>
                  </div>
                </button>
                <button className="group bg-transparent text-secondary-400 hover:text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-secondary-500/10 backdrop-blur-sm border border-secondary-500/30 hover:border-secondary-500/50">
                  <div className="flex items-center justify-center">
                    <Globe size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>Join Community</span>
                  </div>
                </button>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-dark-400 text-lg font-medium">
                  Thanks for being part of the journey.
                </p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Heart size={20} className="text-error-400" />
                  <span className="text-white font-medium">Built with passion by students, for students</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;