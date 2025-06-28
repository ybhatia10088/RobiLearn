import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, LockKeyhole, Star, Book, Tag, Play, CheckCircle, Clock, Target } from 'lucide-react';
import { ChallengeCategory, DifficultyLevel, Challenge } from '@/types/challenge.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';
import { useRobotStore } from '@/store/robotStore';

// Enhanced challenge data with proper completion tracking
const challenges: Challenge[] = [
  {
    id: 'intro-1',
    title: 'Hello Robot',
    description: 'Learn the fundamentals of robot programming with basic movement commands.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 15,
    objectives: [
      { 
        id: 'obj1', 
        description: 'Study basic robot movement commands',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Robot movement is controlled through basic commands that specify:
- Direction (forward, backward, left, right)
- Speed (usually as a percentage or m/s)
- Duration (in milliseconds or seconds)

Example command:
robot.move({
  direction: "forward",
  speed: 0.5,  // 50% speed
  duration: 2000  // 2 seconds
});`
      },
      { 
        id: 'obj2', 
        description: 'Move the robot forward 5 meters',
        completionCriteria: 'distance_forward_5m',
        completed: false,
        hints: [
          'Use robot.move() with the "forward" direction',
          'Set an appropriate speed between 0 and 1',
          'Calculate the duration based on speed and distance'
        ]
      },
      { 
        id: 'obj3', 
        description: 'Rotate the robot 90 degrees right',
        completionCriteria: 'rotation_90_degrees',
        completed: false,
        hints: [
          'Use robot.rotate() with the "right" direction',
          'The angle is specified in degrees',
          'Make sure to wait for the rotation to complete'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Start with a lower speed for more precise control', unlockCost: 0 },
      { id: 'hint2', text: 'You can chain commands using async/await', unlockCost: 5 },
    ],
    startingCode: {
      natural_language: 'Move the robot forward and then turn right',
      block: '[]',
      code: `// Welcome to your first robot programming challenge!
// Follow the comments to complete each objective

// First, let's move the robot forward
// Use robot.move() with appropriate parameters

// Then, wait for the movement to complete
// Hint: Use await robot.wait()

// Finally, rotate the robot 90 degrees right
// Use robot.rotate() with appropriate parameters`
    },
    theory: {
      sections: [
        {
          title: 'Understanding Robot Movement',
          content: `Robots move through space using a coordinate system:
- X axis: Left/Right movement
- Y axis: Up/Down movement
- Z axis: Forward/Backward movement

When you command a robot to move, you're changing its position along these axes.`,
          video: 'https://example.com/robot-movement-basics',
        },
        {
          title: 'Basic Movement Commands',
          content: `The robot.move() command accepts several parameters:
- direction: The direction to move ("forward", "backward", "left", "right")
- speed: A value between 0 and 1 (0% to 100% speed)
- duration: Time in milliseconds

Example:
robot.move({ direction: "forward", speed: 0.5, duration: 2000 });`,
          examples: [
            {
              title: 'Moving Forward',
              code: 'robot.move({ direction: "forward", speed: 0.5, duration: 2000 });',
              explanation: 'Moves the robot forward at 50% speed for 2 seconds'
            },
            {
              title: 'Rotating',
              code: 'robot.rotate({ direction: "right", angle: 90 });',
              explanation: 'Rotates the robot 90 degrees to the right'
            }
          ]
        }
      ],
      quiz: [
        {
          question: 'What parameter controls the robot\'s movement speed?',
          options: ['velocity', 'speed', 'rate', 'pace'],
          correctAnswer: 'speed',
          explanation: 'The speed parameter accepts a value between 0 and 1, representing 0% to 100% of maximum speed.'
        },
        {
          question: 'How is duration specified in robot.move()?',
          options: ['Seconds', 'Milliseconds', 'Minutes', 'Steps'],
          correctAnswer: 'Milliseconds',
          explanation: 'Duration is specified in milliseconds. For example, 2000 milliseconds equals 2 seconds.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['intro-2'],
  },
  {
    id: 'intro-2',
    title: 'Using Sensors',
    description: 'Learn how to read and interpret sensor data for robot navigation.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 20,
    objectives: [
      {
        id: 'obj4',
        description: 'Study different types of sensors',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Robots use various sensors to perceive their environment:
1. Distance Sensors (Ultrasonic, Infrared)
2. Cameras (RGB, Depth)
3. Touch Sensors
4. Gyroscopes

Each sensor provides specific data about the environment.`
      },
      {
        id: 'obj5',
        description: 'Read the ultrasonic sensor',
        completionCriteria: 'sensor_read_complete',
        completed: false,
        hints: [
          'Use robot.getSensor("ultrasonic")',
          'The sensor returns distance in meters',
          'Values less than 1 indicate nearby obstacles'
        ]
      }
    ],
    hints: [
      { id: 'hint3', text: 'Sensors return promises, use await to get readings', unlockCost: 5 },
      { id: 'hint4', text: 'Combine movement and sensor data for smart navigation', unlockCost: 10 },
    ],
    startingCode: {
      natural_language: 'Move forward until you detect an obstacle, then stop',
      block: '[]',
      code: `// Let's learn about robot sensors!

// First, get a reading from the ultrasonic sensor
const distance = await robot.getSensor("ultrasonic");
console.log("Distance to obstacle:", distance, "meters");

// Now, let's move forward while checking the sensor
// Add your code here to:
// 1. Move forward
// 2. Continuously check the sensor
// 3. Stop when an obstacle is detected`
    },
    theory: {
      sections: [
        {
          title: 'Introduction to Robot Sensors',
          content: `Sensors are crucial for robots to understand their environment. They provide:
- Distance measurements
- Visual information
- Orientation data
- Touch detection

Each sensor type has specific uses and limitations.`,
          video: 'https://example.com/robot-sensors-intro',
        }
      ],
      quiz: [
        {
          question: 'What unit does the ultrasonic sensor use for distance?',
          options: ['Centimeters', 'Meters', 'Feet', 'Inches'],
          correctAnswer: 'Meters',
          explanation: 'The ultrasonic sensor returns distance measurements in meters.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'sensor-course',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['patrol-1'],
  },
  {
  id: 'patrol-1',
  title: 'Security Patrol Route',
  description: 'Program the robot to follow a patrol route with multiple waypoints and turns.',
  category: ChallengeCategory.INTRO,
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 20,
  objectives: [
    {
      id: 'obj1',
      description: 'Understand waypoint navigation',
      completionCriteria: 'theory_complete',
      completed: false,
      theory: `
        Waypoint navigation involves:
        - Planning a route with multiple stops
        - Precise turning between waypoints
        - Maintaining consistent speed
        - Position verification at each point
      `
    },
    {
      id: 'obj2',
      description: 'Visit all 4 patrol waypoints in sequence',
      completionCriteria: 'waypoints_completed',
      completed: false,
      hints: [
        'Move to (3, 0), then (3, 3), then (0, 3), then back to (0, 0)',
        'Make precise 90-degree turns at each corner',
        'Verify position at each waypoint'
      ]
    }
  ],
  startingCode: {
    natural_language: 'Follow a square patrol route visiting 4 waypoints',
    block: '[]',
    code: `// Security Patrol Mission
const waypoints = [
  {x: 3, z: 0}, {x: 3, z: 3}, {x: 0, z: 3}, {x: 0, z: 0}
];
// Add your patrol logic here`
  },
  robotType: 'mobile',
  environmentId: 'warehouse',
  unlocked: false,
  completed: false,
  nextChallengeIds: ['circle-1'],
},
{
  id: 'circle-1',
  title: 'Perfect Circle',
  description: 'Master curved movement by making the robot travel in a perfect circle.',
  category: ChallengeCategory.INTRO,
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 25,
  objectives: [
    {
      id: 'obj1',
      description: 'Understand circular motion mechanics',
      completionCriteria: 'theory_complete',
      completed: false,
      theory: `
        Circular movement requires:
        - Continuous small turns while moving forward
        - Consistent speed and turn rate
        - Radius control through turn/speed ratio
      `
    },
    {
      id: 'obj2',
      description: 'Complete one full circle with 2m radius',
      completionCriteria: 'circle_completed',
      completed: false,
      hints: [
        'Use small, frequent turns while moving forward',
        'Keep the turn rate consistent'
      ]
    }
  ],
  startingCode: {
    natural_language: 'Move in a perfect circle',
    block: '[]',
    code: `// Circle motion: small forward + small turn = circular path
for (let i = 0; i < 360; i += 5) {
  // Move forward small amount + turn right 5 degrees
}`
  },
  robotType: 'mobile',
  environmentId: 'warehouse',
  unlocked: false,
  completed: false,
  nextChallengeIds: ['grid-1'],
},
{
  id: 'grid-1',
  title: 'Grid Navigation Master',
  description: 'Navigate efficiently through a grid system using coordinate-based movement.',
  category: ChallengeCategory.INTRO,
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 20,
  objectives: [
    {
      id: 'obj1',
      description: 'Understand grid coordinate systems',
      completionCriteria: 'theory_complete',
      completed: false,
      theory: `
        Grid navigation involves:
        - Understanding X,Z coordinate system
        - Moving in cardinal directions (N,S,E,W)
        - Calculating optimal paths
      `
    },
    {
      id: 'obj2',
      description: 'Visit 5 specific grid points in sequence',
      completionCriteria: 'grid_points_visited',
      completed: false,
      hints: [
        'Points: (2,2) -> (6,2) -> (6,6) -> (2,6) -> (4,4)',
        'Move in straight lines between points'
      ]
    }
  ],
  startingCode: {
    natural_language: 'Navigate through specific grid points',
    block: '[]',
    code: `// Visit: (2,2) -> (6,2) -> (6,6) -> (2,6) -> (4,4)
const gridPoints = [{x: 2, z: 2}, {x: 6, z: 2}, {x: 6, z: 6}, {x: 2, z: 6}, {x: 4, z: 4}];`
  },
  robotType: 'mobile',
  environmentId: 'warehouse',
  unlocked: false,
  completed: false,
  nextChallengeIds: ['spiral-1'],
},
{
  id: 'spiral-1',
  title: 'Spiral Search Pattern',
  description: 'Program the robot to move in an expanding spiral pattern.',
  category: ChallengeCategory.SEARCH_RESCUE,
  difficulty: DifficultyLevel.ADVANCED,
  estimatedTime: 25,
  objectives: [
    {
      id: 'obj1',
      description: 'Understand spiral movement algorithms',
      completionCriteria: 'theory_complete',
      completed: false,
      theory: `
        Spiral patterns: 1 step, turn, 1 step, turn, 2 steps, turn, 2 steps, turn, 3 steps...
      `
    },
    {
      id: 'obj2',
      description: 'Execute a 5-layer expanding spiral',
      completionCriteria: 'spiral_completed',
      completed: false,
      hints: [
        'Pattern: Right 1, Up 1, Left 2, Down 2, Right 3...',
        'Increase step count every 2 direction changes'
      ]
    }
  ],
  startingCode: {
    natural_language: 'Create an expanding spiral pattern',
    block: '[]',
    code: `// Spiral: 1,1,2,2,3,3,4,4,5,5
const directions = ['right', 'up', 'left', 'down'];`
  },
  robotType: 'mobile',
  environmentId: 'warehouse',
  unlocked: false,
  completed: false,
  nextChallengeIds: ['drone-1'],
}
  };


const ChallengeList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [realtimeChallenges, setRealtimeChallenges] = useState<Challenge[]>(challenges);
  const navigate = useNavigate();
  
  const { 
    challengeTracking, 
    getChallengeStatus, 
    getObjectiveStatus,
    performance,
    robotState,
    setCurrentChallenge,
    markTheoryViewed
  } = useRobotStore();
  
  // Real-time objective and challenge completion listeners
  useEffect(() => {
    const handleObjectiveCompleted = (event: CustomEvent) => {
      const { objectiveId, challengeId } = event.detail;
      
      setRealtimeChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? {
                ...challenge,
                objectives: challenge.objectives.map(obj => 
                  obj.id === objectiveId 
                    ? { ...obj, completed: true }
                    : obj
                )
              }
            : challenge
        )
      );
    };

    const handleChallengeCompleted = (event: CustomEvent) => {
      const { challengeId } = event.detail;
      
      setRealtimeChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, completed: true }
            : challenge
        )
      );
    };

    window.addEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    };
  }, []);

  // Update challenge completion status based on robot store
  useEffect(() => {
    setRealtimeChallenges(prev => 
      prev.map(challenge => ({
        ...challenge,
        completed: getChallengeStatus(challenge.id),
        // Dynamic unlocking logic: intro-1 is always unlocked, others unlock when previous is complete
        unlocked: challenge.id === 'intro-1' || 
                 (challenge.id === 'intro-2' && getChallengeStatus('intro-1')) ||
                 (challenge.id === 'warehouse-1' && getChallengeStatus('intro-2')),
        objectives: challenge.objectives.map(obj => ({
          ...obj,
          completed: getObjectiveStatus(obj.id)
        }))
      }))
    );
  }, [challengeTracking.completedChallenges, challengeTracking.completedObjectives, getChallengeStatus, getObjectiveStatus]);
  
  const filteredChallenges = realtimeChallenges.filter(challenge => 
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
      case DifficultyLevel.BEGINNER: return 'success';
      case DifficultyLevel.INTERMEDIATE: return 'primary';
      case DifficultyLevel.ADVANCED: return 'warning';
      case DifficultyLevel.EXPERT: return 'error';
      default: return 'primary';
    }
  };
  
  const getCategoryIcon = (category: ChallengeCategory) => {
    switch (category) {
      case ChallengeCategory.INTRO: return <Book size={16} />;
      case ChallengeCategory.WAREHOUSE: return <Tag size={16} />;
      case ChallengeCategory.SURGERY: return <Star size={16} />;
      case ChallengeCategory.SEARCH_RESCUE: return <Trophy size={16} />;
      case ChallengeCategory.MANUFACTURING: return <Tag size={16} />;
      default: return <Book size={16} />;
    }
  };

  const getObjectiveProgress = (challenge: Challenge) => {
    const completed = challenge.objectives.filter(obj => obj.completed).length;
    const total = challenge.objectives.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const handleChallengeClick = (challenge: Challenge) => {
    if (!challenge.unlocked) return;
    setCurrentChallenge(challenge.id);
    if (expandedChallenge === challenge.id) {
      navigate(`/simulator?challenge=${challenge.id}`);
    } else {
      setExpandedChallenge(challenge.id);
    }
  };

  const ObjectiveProgressBar: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
    const progress = getObjectiveProgress(challenge);
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-dark-300">Progress</span>
          <span className="text-xs text-dark-300">{progress.completed}/{progress.total}</span>
        </div>
        <div className="w-full bg-dark-600 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all ${
              challenge.completed ? 'bg-success-500' : 'bg-primary-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  const LiveStatsPanel: React.FC = () => {
    if (!robotState) return null;

    return (
      <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 mb-4">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <Target size={16} className="mr-2" />
          Live Robot Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-dark-300">Position</span>
            <p className="text-white font-mono">
              ({robotState.position.x.toFixed(1)}, {robotState.position.z.toFixed(1)})
            </p>
          </div>
          <div>
            <span className="text-dark-300">Distance</span>
            <p className="text-white font-mono">
              {challengeTracking.totalDistanceMoved.toFixed(1)}m
            </p>
          </div>
          <div>
            <span className="text-dark-300">Rotations</span>
            <p className="text-white font-mono">
              {(challengeTracking.totalRotations / Math.PI * 180).toFixed(0)}°
            </p>
          </div>
          <div>
            <span className="text-dark-300">Battery</span>
            <p className="text-white font-mono">{robotState.batteryLevel}%</p>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Progress Summary Panel
  const ProgressSummaryPanel: React.FC = () => {
    const completedChallengesCount = Array.from(challengeTracking.completedChallenges).length;
    const totalChallenges = challenges.length;
    const completedObjectivesCount = Array.from(challengeTracking.completedObjectives).length;
    const totalObjectives = challenges.reduce((sum, challenge) => sum + challenge.objectives.length, 0);

    return (
      <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 mb-4">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <Trophy size={16} className="mr-2" />
          Your Progress
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{completedChallengesCount}</div>
            <div className="text-dark-300">Challenges</div>
            <div className="text-xs text-dark-500">of {totalChallenges} total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-400">{completedObjectivesCount}</div>
            <div className="text-dark-300">Objectives</div>
            <div className="text-xs text-dark-500">of {totalObjectives} total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-400">{challengeTracking.totalDistanceMoved.toFixed(1)}m</div>
            <div className="text-dark-300">Distance</div>
            <div className="text-xs text-dark-500">traveled</div>
          </div>
        </div>
      </div>
    );
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
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        <ProgressSummaryPanel />
        <LiveStatsPanel />
        
        {filteredChallenges.length === 0 ? (
          <div className="text-center text-dark-400 py-8">
            <p>No challenges found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredChallenges.map((challenge) => {
              const progress = getObjectiveProgress(challenge);
              return (
                <motion.div
                  key={challenge.id}
                  initial={false}
                  animate={{ height: expandedChallenge === challenge.id ? 'auto' : 'auto' }}
                  className={`card cursor-pointer border-l-4 ${
                    challenge.unlocked 
                      ? `border-l-${getDifficultyColor(challenge.difficulty)}-500` 
                      : 'border-l-dark-500'
                  } ${challenge.unlocked ? '' : 'opacity-70'} ${
                    challenge.completed ? 'bg-success-900/20 border-success-500' : ''
                  }`}
                  onClick={() => handleChallengeClick(challenge)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`p-1.5 rounded-md bg-${getDifficultyColor(challenge.difficulty)}-900 border border-${getDifficultyColor(challenge.difficulty)}-700 mr-2 text-${getDifficultyColor(challenge.difficulty)}-400`}>
                          {getCategoryIcon(challenge.category)}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                        {challenge.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 text-success-400"
                          >
                            <Trophy size={16} />
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="text-dark-300 text-sm mb-3">{challenge.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className={`badge bg-${getDifficultyColor(challenge.difficulty)}-900 text-${getDifficultyColor(challenge.difficulty)}-400 border border-${getDifficultyColor(challenge.difficulty)}-700`}>
                          {challenge.difficulty}
                        </div>
                        <div className="badge bg-dark-700 text-dark-300 border border-dark-600 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {challenge.estimatedTime} min
                        </div>
                        <div className="badge bg-dark-700 text-dark-300 border border-dark-600">
                          {challenge.robotType}
                        </div>
                        {progress.completed > 0 && (
                          <div className="badge bg-primary-900 text-primary-400 border border-primary-700">
                            {progress.completed}/{progress.total} completed
                          </div>
                        )}
                      </div>

                      {challenge.unlocked && <ObjectiveProgressBar challenge={challenge} />}
                      
                      <AnimatePresence>
                        {expandedChallenge === challenge.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-4"
                          >
                            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                              <h4 className="text-white font-medium mb-2">Learning Objectives</h4>
                              <ul className="space-y-2">
                                {challenge.objectives.map((objective) => (
                                  <motion.li 
                                    key={objective.id} 
                                    className="flex items-start"
                                    animate={objective.completed ? { backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className={`mt-1 w-4 h-4 rounded-full mr-2 flex items-center justify-center transition-colors duration-300 ${
                                      objective.completed 
                                        ? 'bg-success-500 text-white' 
                                        : 'bg-dark-600'
                                    }`}>
                                      <AnimatePresence>
                                        {objective.completed && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                          >
                                            <CheckCircle size={12} />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                    <div className="flex-1">
                                      <p className={`text-sm transition-colors duration-300 ${
                                        objective.completed ? 'text-success-300' : 'text-white'
                                      }`}>
                                        {objective.description}
                                      </p>
                                      {objective.theory && (
                                        <p className="text-dark-300 text-sm mt-1">
                                          {objective.theory.split('\n')[0]}...
                                        </p>
                                      )}
                                      {objective.completed && (
                                        <motion.p
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="text-success-400 text-xs mt-1 font-medium"
                                        >
                                          ✓ Completed!
                                        </motion.p>
                                      )}
                                    </div>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            
                            {challenge.theory && (
                              <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                                <h4 className="text-white font-medium mb-2">Learning Materials</h4>
                                {challenge.theory.sections.map((section, index) => (
                                  <div key={index} className="mb-4 last:mb-0">
                                    <h5 className="text-primary-400 font-medium mb-1">{section.title}</h5>
                                    <p className="text-dark-300 text-sm whitespace-pre-wrap">{section.content}</p>
                                    {section.examples && (
                                      <div className="mt-2 space-y-2">
                                        {section.examples.map((example, exampleIndex) => (
                                          <div key={exampleIndex} className="bg-dark-800 rounded p-3 border border-dark-500">
                                            <h6 className="text-white text-xs font-medium mb-1">{example.title}</h6>
                                            <code className="text-primary-300 text-xs block mb-1 font-mono">
                                              {example.code}
                                            </code>
                                            <p className="text-dark-400 text-xs">{example.explanation}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                {challenge.theory.quiz && (
                                  <div className="mt-4 bg-dark-800 rounded-lg p-3 border border-dark-500">
                                    <h5 className="text-warning-400 font-medium mb-2 flex items-center">
                                      <Star size={14} className="mr-1" />
                                      Quick Quiz
                                    </h5>
                                    {challenge.theory.quiz.map((question, qIndex) => (
                                      <div key={qIndex} className="mb-3 last:mb-0">
                                        <p className="text-white text-sm mb-2">{question.question}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map((option, optIndex) => (
                                            <button
                                              key={optIndex}
                                              className={`text-xs p-2 rounded border text-left transition-colors ${
                                                option === question.correctAnswer
                                                  ? 'bg-success-900/30 border-success-600 text-success-300'
                                                  : 'bg-dark-700 border-dark-600 text-dark-300 hover:border-dark-500'
                                              }`}
                                            >
                                              {option}
                                            </button>
                                          ))}
                                        </div>
                                        <p className="text-primary-400 text-xs mt-2">{question.explanation}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <button
                                className="btn-primary flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/simulator?challenge=${challenge.id}`);
                                }}
                              >
                                <Play size={16} className="mr-2" />
                                Start Challenge
                              </button>
                              {challenge.hints && challenge.hints.length > 0 && (
                                <button className="btn-secondary text-sm">
                                  View Hints ({challenge.hints.length})
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {!challenge.unlocked && (
                        <div className="flex items-center text-dark-400 text-sm">
                          <LockKeyhole size={16} className="mr-1" />
                          Locked
                        </div>
                      )}
                      <div className="text-right">
                        <ChevronRight 
                          size={20} 
                          className={`text-dark-400 transition-transform duration-200 ${
                            expandedChallenge === challenge.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeList;
