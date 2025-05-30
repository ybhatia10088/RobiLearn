import React from 'react';
import Layout from '@/components/layout/Layout';
import ChallengeList from '@/components/challenges/ChallengeList';
import { Award, Trophy, Star } from 'lucide-react';

const ChallengesPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-dark-900 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Challenges</h1>
              <p className="text-dark-300">
                Progress through our robotics challenges from beginner to expert level
              </p>
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-900 border border-primary-700 text-primary-400 mb-1">
                  <Award size={24} />
                </div>
                <span className="text-sm text-dark-300">2/20</span>
                <span className="text-xs text-dark-400">Completed</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-900 border border-accent-700 text-accent-400 mb-1">
                  <Trophy size={24} />
                </div>
                <span className="text-sm text-dark-300">150</span>
                <span className="text-xs text-dark-400">Points</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-900 border border-secondary-700 text-secondary-400 mb-1">
                  <Star size={24} />
                </div>
                <span className="text-sm text-dark-300">4</span>
                <span className="text-xs text-dark-400">Badges</span>
              </div>
            </div>
          </div>
          
          <div className="min-h-[800px]">
            <ChallengeList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChallengesPage;
