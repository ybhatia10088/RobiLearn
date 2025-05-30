import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-dark-800 to-dark-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-dark-700 rounded-2xl overflow-hidden shadow-xl border border-dark-600">
          <div className="p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to start your robotics journey?
              </h2>
              <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
                Jump into our interactive simulator or explore our progressive learning challenges designed to take you from beginner to expert.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  className="btn-primary text-lg px-6 py-3 flex items-center justify-center"
                  onClick={() => navigate('/simulator')}
                >
                  <span>Try the Simulator</span>
                  <ArrowRight size={16} className="ml-2" />
                </button>
                <button 
                  className="btn-outline text-lg px-6 py-3"
                  onClick={() => navigate('/challenges')}
                >
                  View Challenges
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="bg-dark-800 px-8 py-6 border-t border-dark-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-dark-300">
                <span className="text-primary-400 font-semibold">Over 100+</span> interactive challenges to solve
              </p>
              <div className="flex -space-x-2">
                {/* User avatars - in a real app, these would be actual user images */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-700 to-secondary-700 border-2 border-dark-800 flex items-center justify-center text-white text-xs font-bold"
                  >
                    U{i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-dark-600 border-2 border-dark-800 flex items-center justify-center text-white text-xs">
                  +2k
                </div>
              </div>
              <p className="text-dark-300">Join thousands of students learning robotics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
