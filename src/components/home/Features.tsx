import React from 'react';
import { motion } from 'framer-motion';
import { 
  Notebook as Robot, 
  Code, 
  Cpu, 
  Webhook, 
  MessageSquare, 
  Share2, 
  Award, 
  Layers,
  Zap,
  Shield,
  Target,
  Gauge
} from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  benefits: string[];
};

const features: Feature[] = [
  {
    icon: <Robot size={28} />,
    title: 'Advanced 3D Robot Simulator',
    description: 'Industry-grade physics simulation with multiple robot types including robotic arms, mobile platforms, and autonomous drones.',
    color: 'primary',
    benefits: ['Realistic physics engine', 'Multiple robot types', 'Real-time visualization']
  },
  {
    icon: <Code size={28} />,
    title: 'Multi-Modal Programming',
    description: 'Program using natural language, visual block-based coding, or traditional JavaScript/Python code.',
    color: 'secondary',
    benefits: ['Natural language AI', 'Visual block editor', 'Traditional coding']
  },
  {
    icon: <Cpu size={28} />,
    title: 'Real-Time Sensor Integration',
    description: 'Comprehensive sensor suite including cameras, LiDAR, ultrasonic, and IMU sensors with live data visualization.',
    color: 'accent',
    benefits: ['Camera feeds', 'LiDAR mapping', 'Sensor fusion']
  },
  {
    icon: <Webhook size={28} />,
    title: 'Advanced Path Planning',
    description: 'Sophisticated collision detection and path planning algorithms for autonomous navigation and manipulation.',
    color: 'success',
    benefits: ['Collision avoidance', 'Optimal pathfinding', 'Dynamic obstacles']
  },
  {
    icon: <MessageSquare size={28} />,
    title: 'AI Programming Assistant',
    description: 'Intelligent coding companion that explains robot behavior, suggests optimizations, and provides real-time debugging.',
    color: 'primary',
    benefits: ['Code explanation', 'Performance tips', 'Error debugging']
  },
  {
    icon: <Share2 size={28} />,
    title: 'Collaborative Learning',
    description: 'Share solutions, learn from peers, and participate in robotics challenges with a global community.',
    color: 'secondary',
    benefits: ['Solution sharing', 'Peer learning', 'Global community']
  },
  {
    icon: <Award size={28} />,
    title: 'Gamified Progress System',
    description: 'Comprehensive achievement system with badges, leaderboards, and skill progression tracking.',
    color: 'accent',
    benefits: ['Achievement badges', 'Skill tracking', 'Leaderboards']
  },
  {
    icon: <Layers size={28} />,
    title: 'Industry-Relevant Scenarios',
    description: 'Real-world challenges from warehouse automation to surgical robotics and search-and-rescue missions.',
    color: 'success',
    benefits: ['Warehouse automation', 'Medical robotics', 'Emergency response']
  },
];

const additionalFeatures = [
  {
    icon: <Zap size={24} />,
    title: 'High Performance',
    description: 'Optimized for smooth 60fps simulation',
    color: 'warning'
  },
  {
    icon: <Shield size={24} />,
    title: 'Safe Learning',
    description: 'No hardware damage or safety risks',
    color: 'error'
  },
  {
    icon: <Target size={24} />,
    title: 'Precision Control',
    description: 'Sub-millimeter accuracy simulation',
    color: 'primary'
  },
  {
    icon: <Gauge size={24} />,
    title: 'Real-Time Analytics',
    description: 'Performance metrics and insights',
    color: 'secondary'
  },
];

const FeatureCard: React.FC<Feature & { index: number }> = ({ 
  icon, 
  title, 
  description, 
  color, 
  benefits, 
  index 
}) => {
  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <div className={`card hover:shadow-glow-lg border-${color}-800/50 hover:border-${color}-600/70 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className={`bg-${color}-900/80 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-${color}-400 border border-${color}-700/50 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            {icon}
          </div>
          
          <h3 className="text-xl font-bold mb-4 text-white group-hover:text-white transition-colors leading-tight">
            {title}
          </h3>
          
          <p className="text-dark-300 mb-6 leading-relaxed flex-grow">
            {description}
          </p>
          
          <ul className="space-y-3 mt-auto">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center text-sm text-dark-400">
                <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 mr-3 flex-shrink-0`} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Hover effect border */}
        <div className={`absolute inset-0 rounded-xl border-2 border-${color}-500/0 group-hover:border-${color}-500/30 transition-all duration-500`} />
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Cpu size={16} className="mr-2" />
            <span>Comprehensive Learning Platform</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
            Everything You Need to Master
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Robotics Programming
            </span>
          </h2>
          
          <p className="text-xl text-dark-300 leading-relaxed">
            Our comprehensive platform provides all the tools, simulations, and learning resources 
            necessary to become proficient in robotics without expensive hardware investments.
          </p>
        </motion.div>
        
        {/* Main features grid - Fixed height grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
        
        {/* Additional features */}
        <motion.div
          className="bg-dark-700/50 rounded-2xl border border-dark-600/50 backdrop-blur-sm p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Built for Performance & Reliability
            </h3>
            <p className="text-dark-300 text-lg">
              Enterprise-grade simulation technology trusted by educators and professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={`bg-${feature.color}-900/50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 text-${feature.color}-400 border border-${feature.color}-700/50 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-dark-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Stats section */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { number: '10,000+', label: 'Active Students', color: 'primary' },
            { number: '100+', label: 'Challenges', color: 'secondary' },
            { number: '50+', label: 'Robot Models', color: 'accent' },
            { number: '99.9%', label: 'Uptime', color: 'success' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold text-${stat.color}-400 mb-2`}>
                {stat.number}
              </div>
              <div className="text-dark-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;