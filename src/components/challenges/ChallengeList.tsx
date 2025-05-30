import React, { useState } from 'react';
import { ChevronRight, Trophy, LockKeyhole, Star, Book, Tag } from 'lucide-react';
import { ChallengeCategory, DifficultyLevel, Challenge } from '@/types/challenge.types';
import { motion } from 'framer-motion';

// Sample challenge data
const challenges: Challenge[] = [
  {
    id: 'intro-1',
    title: 'Hello Robot',
    description: 'Get started with basic robot movement commands.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 10,
    objectives: [
      { id: 'obj1', description: 'Move the robot forward', completionCriteria: 'robot.position.z > 5', completed: false },
      { id: 'obj2', description: 'Turn the robot right', completionCriteria: 'robot.rotation.y > 1.5', completed: false },
    ],
    hints: [
      { id: 'hint1', text: 'Use robot.move() to move forward', unlockCost: 0 },
      { id: 'hint2', text: 'Use robot.rotate() to turn the robot', unlockCost: 5 },
    ],
    startingCode: {
      natural_language: 'Move the robot forward and then turn right',
      block: '[]',
      code: '// Your code here'
    },
    robotType: 'mobile',
    environmentId: 'simple-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['intro-2'],
  },
  {
    id: 'intro-2',
    title: 'Sensing the World',
    description: 'Learn how to use sensors to detect objects.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 15,
    objectives: [
      { id: 'obj1', description: 'Read ultrasonic sensor', completionCriteria: 'robot.getSensor("ultrasonic")', completed: false },
      { id: 'obj2', description: 'Move until obstacle detected', completionCriteria: 'distance < 2', completed: false },
    ],
    hints: [
      { id: 'hint1', text: 'Use robot.getSensor() to read sensor data', unlockCost: 5 },
      { id: 'hint2', text: 'Use a while loop to check distance continuously', unlockCost: 10 },
    ],
    startingCode: {
      natural_language: 'Move forward until you detect an obstacle',
      block: '[]',
      code: '// Your code here'
    },
    robotType: 'mobile',
    environmentId: 'simple-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['warehouse-1'],
  },
  {
    id: 'warehouse-1',
    title: 'Warehouse Navigation',
    description: 'Navigate the robot through a warehouse environment.',
    category: ChallengeCategory.WAREHOUSE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 20,
    objectives: [
      { id: 'obj1', description: 'Navigate to the pickup area', completionCriteria: 'distance(robot, pickupArea) < 1', completed: false },
      { id: 'obj2', description: 'Grab the package', completionCriteria: 'robot.isGrabbing', completed: false },
      { id: 'obj3', description: 'Deliver to the drop-off point', completionCriteria: 'distance(robot, dropoffArea) < 1', completed: false },
    ],
    hints: [
      { id: 'hint1', text: 'Plan your path to avoid obstacles', unlockCost: 10 },
      { id: 'hint2', text: 'Use grab() to pick up the package', unlockCost: 15 },
    ],
    startingCode: {
      natural_language: 'Navigate to the pickup area, grab the package, and deliver it to the drop-off point',
      block: '[]',
      code: '// Your code here'
    },
    robotType: 'mobile',
    environmentId: 'warehouse',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['warehouse-2'],
  },
  {
    id: 'surgery-1',
    title: 'Precision Movement',
    description: 'Control a robotic arm for precise medical procedures.',
    category: ChallengeCategory.SURGERY,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 30,
    objectives: [
      { id: 'obj1', description: 'Calibrate the robotic arm', completionCriteria: 'arm.calibrated', completed: false },
      { id: 'obj2', description: 'Position at the correct coordinates', completionCriteria: 'distance(arm.position, target) < 0.1', completed: false },
      { id: 'obj3', description: 'Perform the procedure', completionCriteria: 'procedure.completed', completed: false },
    ],
    hints: [
      { id: 'hint1', text: 'Use arm.calibrate() first', unlockCost: 20 },
      { id: 'hint2', text: 'Move slowly for precision', unlockCost: 25 },
    ],
    startingCode: {
      natural_language: 'Calibrate the arm, position it at the marked location, and complete the procedure',
      block: '[]',
      code: '// Your code here'
    },
    robotType: 'arm',
    environmentId: 'operating-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: [],
  },
];

const ChallengeList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  
  const filteredChallenges = challenges.filter(challenge => 
    (selectedCategory === 'all' || challenge.category === selectedCategory) &&
    (selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty)
  );
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: ChallengeCategory.INTRO, label: 'Introduction' },
    { value: ChallengeCategory.WAREHOUSE, label: 'Warehouse' },
    { value: ChallengeCategory.SURGERY, label: 'Surgery' },
    { value: ChallengeCategory.SEARCH_RESCUE, label: 'Search & Rescue' },
    { value: ChallengeCategory.MANUFACTURING, label: 'Manufacturing' },
  ];
  
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
    { value: DifficultyLevel.INTERMEDIATE, label: 'Intermediate' },
    { value: DifficultyLevel.ADVANCED, label: 'Advanced' },
    { value: DifficultyLevel.EXPERT, label: 'Expert' },
  ];
  
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return 'success';
      case DifficultyLevel.INTERMEDIATE:
        return 'primary';
      case DifficultyLevel.ADVANCED:
        return 'warning';
      case DifficultyLevel.EXPERT:
        return 'error';
      default:
        return 'primary';
    }
  };
  
  const getCategoryIcon = (category: ChallengeCategory) => {
    switch (category) {
      case ChallengeCategory.INTRO:
        return <Book size={16} />;
      case ChallengeCategory.WAREHOUSE:
        return <Tag size={16} />;
      case ChallengeCategory.SURGERY:
        return <Star size={16} />;
      case ChallengeCategory.SEARCH_RESCUE:
        return <Trophy size={16} />;
      case ChallengeCategory.MANUFACTURING:
        return <Tag size={16} />;
      default:
        return <Book size={16} />;
    }
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Robotics Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Category
            </label>
            <select
              className="input bg-dark-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">
              Difficulty
            </label>
            <select
              className="input bg-dark-700"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center text-dark-400 py-8">
            <p>No challenges found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`card cursor-pointer border-l-4 border-l-${getDifficultyColor(challenge.difficulty)}-500 ${challenge.unlocked ? '' : 'opacity-70'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`p-1.5 rounded-md bg-${getDifficultyColor(challenge.difficulty)}-900 border border-${getDifficultyColor(challenge.difficulty)}-700 mr-2 text-${getDifficultyColor(challenge.difficulty)}-400`}>
                        {getCategoryIcon(challenge.category)}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                    </div>
                    
                    <p className="text-dark-300 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className={`badge badge-${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </div>
                      <div className="badge bg-dark-700 text-dark-300">
                        {challenge.estimatedTime} min
                      </div>
                      <div className="badge bg-dark-700 text-dark-300">
                        {challenge.robotType}
                      </div>
                    </div>
                    
                    <div className="text-sm text-dark-400">
                      {challenge.objectives.length} objectives
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {challenge.completed ? (
                      <div className="p-2 rounded-full bg-success-900 border border-success-700 text-success-400">
                        <Trophy size={18} />
                      </div>
                    ) : !challenge.unlocked ? (
                      <div className="p-2 rounded-full bg-dark-700 border border-dark-600 text-dark-400">
                        <LockKeyhole size={18} />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-primary-900 border border-primary-700 text-primary-400">
                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeList;
