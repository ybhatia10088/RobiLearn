import React from 'react';
import { motion } from 'framer-motion';
import { Notebook as Robot, Code, Cpu, Webhook, MessageSquare, Share2, Award, Layers } from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

const features: Feature[] = [
  {
    icon: <Robot size={24} />,
    title: '3D Robot Simulator',
    description: 'Physics-based simulation with multiple robot types including arms, mobile robots, and drones.',
    color: 'primary',
  },
  {
    icon: <Code size={24} />,
    title: 'Multiple Programming Interfaces',
    description: 'Program using natural language, visual block-based coding, or traditional code.',
    color: 'secondary',
  },
  {
    icon: <Cpu size={24} />,
    title: 'Real-time Sensor Visualization',
    description: 'See what your robot sees with camera feeds, lidar scans, and other sensor data.',
    color: 'accent',
  },
  {
    icon: <Webhook size={24} />,
    title: 'Collision Detection & Path Planning',
    description: 'Advanced physics simulation with realistic collision detection and path planning algorithms.',
    color: 'success',
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'AI Programming Assistant',
    description: 'Get help from an AI that explains what your robot is doing and suggests optimizations.',
    color: 'primary',
  },
  {
    icon: <Share2 size={24} />,
    title: 'Share Your Solutions',
    description: "Create, share, and learn from other users' robot programming solutions.",
    color: 'secondary',
  },
  {
    icon: <Award size={24} />,
    title: 'Achievement System',
    description: 'Earn badges and track your progress as you master robotics concepts.',
    color: 'accent',
  },
  {
    icon: <Layers size={24} />,
    title: 'Progressive Learning Challenges',
    description: 'From simple movement to complex warehouse automation and search-and-rescue missions.',
    color: 'success',
  },
];

const FeatureCard: React.FC<Feature & { index: number }> = ({ icon, title, description, color, index }) => {
  return (
    <motion.div
      className={`card hover:shadow-glow-lg border-${color}-800 hover:border-${color}-600 transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className={`bg-${color}-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-${color}-400 border border-${color}-700`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-dark-300">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-dark-800 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            All the Tools You Need to Master Robotics
          </h2>
          <p className="text-lg text-dark-300">
            Our platform provides everything necessary to learn robotics programming
            without investing in expensive hardware.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;