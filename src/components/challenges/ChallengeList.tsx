import React, { useState } from 'react';
import { ChevronRight, Trophy, LockKeyhole, Star, Book, Tag, Play, CheckCircle } from 'lucide-react';
import { ChallengeCategory, DifficultyLevel, Challenge } from '@/types/challenge.types';
import { motion } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';

// Enhanced challenge data with learning content
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
        description: 'Understand basic robot movement commands',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `
          Robot movement is controlled through basic commands that specify:
          - Direction (forward, backward, left, right)
          - Speed (usually as a percentage or m/s)
          - Duration (in milliseconds or seconds)
          
          Example command:
          robot.move({
            direction: "forward",
            speed: 0.5,  // 50% speed
            duration: 2000  // 2 seconds
          });
        `
      },
      { 
        id: 'obj2', 
        description: 'Move the robot forward 5 meters',
        completionCriteria: 'robot.position.z > 5',
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
        completionCriteria: 'robot.rotation.y === Math.PI/2',
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
// Use robot.rotate() with appropriate parameters
`
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
        id: 'obj1',
        description: 'Understand different types of sensors',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `
          Robots use various sensors to perceive their environment:
          1. Distance Sensors (Ultrasonic, Infrared)
          2. Cameras (RGB, Depth)
          3. Touch Sensors
          4. Gyroscopes
          
          Each sensor provides specific data about the environment.
        `
      },
      {
        id: 'obj2',
        description: 'Read the ultrasonic sensor',
        completionCriteria: 'sensor_read_complete',
        completed: false,
        hints: [
          'Use robot.getSensor("ultrasonic")',
          'The sensor returns distance in meters',
          'Values less than 1 indicate nearby obstacles'
        ]
      },
      {
        id: 'obj3',
        description: 'Navigate using sensor data',
        completionCriteria: 'navigation_complete',
        completed: false,
        hints: [
          'Check sensor readings in a loop',
          'Use conditional statements to make decisions',
          'Maintain a safe distance from obstacles'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Sensors return promises, use await to get readings', unlockCost: 5 },
      { id: 'hint2', text: 'Combine movement and sensor data for smart navigation', unlockCost: 10 },
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
// 3. Stop when an obstacle is detected
`
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
        },
        {
          title: 'Using the Ultrasonic Sensor',
          content: `The ultrasonic sensor measures distance using sound waves:
- Returns distance in meters
- Updates several times per second
- Works best for obstacles 0.02m to 4m away
- May have difficulty with soft or angled surfaces`,
          examples: [
            {
              title: 'Reading Distance',
              code: 'const distance = await robot.getSensor("ultrasonic");',
              explanation: 'Gets the current distance reading in meters'
            },
            {
              title: 'Continuous Monitoring',
              code: `while (true) {
  const distance = await robot.getSensor("ultrasonic");
  if (distance < 0.5) {  // If closer than 0.5 meters
    await robot.stop();
    break;
  }
  await robot.wait(100);  // Wait 100ms before next reading
}`,
              explanation: 'Continuously monitors distance and stops when too close to an obstacle'
            }
          ]
        }
      ],
      quiz: [
        {
          question: 'What unit does the ultrasonic sensor use for distance?',
          options: ['Centimeters', 'Meters', 'Feet', 'Inches'],
          correctAnswer: 'Meters',
          explanation: 'The ultrasonic sensor returns distance measurements in meters.'
        },
        {
          question: 'Why should we wait between sensor readings?',
          options: [
            'To save battery',
            'To allow the sensor to update',
            'To prevent program crashes',
            'To slow the robot down'
          ],
          correctAnswer: 'To allow the sensor to update',
          explanation: 'Sensors need time to take new readings. Waiting ensures we get fresh data.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'sensor-course',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['warehouse-1'],
  },
  {
    id: 'warehouse-1',
    title: 'Warehouse Navigation',
    description: 'Learn to navigate a robot through a warehouse environment while avoiding obstacles.',
    category: ChallengeCategory.WAREHOUSE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj1',
        description: 'Plan an efficient path to the goal',
        completionCriteria: 'planning_complete',
        completed: false,
        theory: `
          Path planning involves:
          1. Identifying the goal location
          2. Detecting obstacles
          3. Finding an efficient route
          4. Maintaining safe distances
          
          We'll use sensors and algorithms to navigate safely.
        `
      },
      {
        id: 'obj2',
        description: 'Navigate to the pickup area',
        completionCriteria: 'reached_pickup',
        completed: false,
        hints: [
          'Use the map to identify the pickup area',
          'Keep track of your position',
          'Use sensors to avoid obstacles'
        ]
      },
      {
        id: 'obj3',
        description: 'Pick up the package',
        completionCriteria: 'package_grabbed',
        completed: false,
        hints: [
          'Position the robot correctly',
          'Use the grab() command',
          'Verify successful pickup'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Break down the navigation into smaller steps', unlockCost: 10 },
      { id: 'hint2', text: 'Use markers or waypoints for complex paths', unlockCost: 15 },
    ],
    startingCode: {
      natural_language: 'Navigate to the pickup area, avoiding obstacles, and grab the package',
      block: '[]',
      code: `// Welcome to warehouse navigation!
// This challenge combines movement and sensor usage

// First, let's plan our path
// The pickup area is at coordinates (5, 0, 8)

// We'll need to:
// 1. Navigate around obstacles
// 2. Reach the pickup area
// 3. Grab the package

// Add your code here
`
    },
    theory: {
      sections: [
        {
          title: 'Warehouse Navigation Basics',
          content: `Warehouse robots need to:
- Follow efficient paths
- Avoid collisions
- Handle dynamic obstacles
- Maintain precise positioning

This requires combining multiple skills and sensors.`,
          video: 'https://example.com/warehouse-navigation',
        },
        {
          title: 'Path Planning Strategies',
          content: `Effective path planning involves:
1. Breaking down the path into segments
2. Continuous obstacle monitoring
3. Dynamic path adjustment
4. Position verification`,
          examples: [
            {
              title: 'Basic Navigation',
              code: `// Move to a specific coordinate
async function moveToPosition(x, z) {
  // Calculate angle to target
  const angle = Math.atan2(z - robot.position.z, x - robot.position.x);
  
  // Rotate to face target
  await robot.rotateTo(angle);
  
  // Move to target
  while (Math.abs(x - robot.position.x) > 0.1 || 
         Math.abs(z - robot.position.z) > 0.1) {
    const distance = await robot.getSensor("ultrasonic");
    if (distance < 1) {
      // Obstacle detected, handle it
      await handleObstacle();
    } else {
      await robot.move({ direction: "forward", speed: 0.5, duration: 100 });
    }
    await robot.wait(50);
  }
}`,
              explanation: 'A basic function to move to specific coordinates while avoiding obstacles'
            }
          ]
        }
      ],
      quiz: [
        {
          question: 'What should you do when detecting an obstacle?',
          options: [
            'Ignore it and continue',
            'Stop and wait',
            'Find an alternative path',
            'Reverse direction'
          ],
          correctAnswer: 'Find an alternative path',
          explanation: 'When an obstacle is detected, the robot should plan and follow an alternative path to reach its goal.'
        },
        {
          question: 'Why is position verification important?',
          options: [
            'To save battery',
            'To maintain accurate navigation',
            'To avoid collisions',
            'To increase speed'
          ],
          correctAnswer: 'To maintain accurate navigation',
          explanation: 'Regular position verification ensures the robot stays on course and reaches its intended destination.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'warehouse',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['warehouse-2'],
  }
];

const ChallengeList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const navigate = useNavigate();
  
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

  const handleChallengeClick = (challenge: Challenge) => {
    if (!challenge.unlocked) return;
    
    if (expandedChallenge === challenge.id) {
      navigate(`/simulator?challenge=${challenge.id}`);
    } else {
      setExpandedChallenge(challenge.id);
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
        {filteredChallenges.length === 0 ? (
          <div className="text-center text-dark-400 py-8">
            <p>No challenges found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={false}
                animate={{ height: expandedChallenge === challenge.id ? 'auto' : 'auto' }}
                className={`card cursor-pointer border-l-4 ${
                  challenge.unlocked 
                    ? `border-l-${getDifficultyColor(challenge.difficulty)}-500` 
                    : 'border-l-dark-500'
                } ${challenge.unlocked ? '' : 'opacity-70'}`}
                onClick={() => handleChallengeClick(challenge)}
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
                      <div className={`badge bg-${getDifficultyColor(challenge.difficulty)}-900 text-${getDifficultyColor(challenge.difficulty)}-400 border border-${getDifficultyColor(challenge.difficulty)}-700`}>
                        {challenge.difficulty}
                      </div>
                      <div className="badge bg-dark-700 text-dark-300 border border-dark-600">
                        {challenge.estimatedTime} min
                      </div>
                      <div className="badge bg-dark-700 text-dark-300 border border-dark-600">
                        {challenge.robotType}
                      </div>
                    </div>
                    
                    {expandedChallenge === challenge.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 space-y-4"
                      >
                        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                          <h4 className="text-white font-medium mb-2">Learning Objectives</h4>
                          <ul className="space-y-2">
                            {challenge.objectives.map((objective) => (
                              <li key={objective.id} className="flex items-start">
                                <div className={`mt-1 w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                                  objective.completed 
                                    ? 'bg-success-500 text-white' 
                                    : 'bg-dark-600'
                                }`}>
                                  {objective.completed && <CheckCircle size={12} />}
                                </div>
                                <div>
                                  <p className="text-white text-sm">{objective.description}</p>
                                  {objective.theory && (
                                    <p className="text-dark-300 text-sm mt-1">
                                      {objective.theory.split('\n')[0]}...
                                    </p>
                                  )}
                                </div>
                              </li>
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
                                    {section.examples.map((example, i) => (
                                      <div key={i} className="bg-dark-800 rounded p-2 border border-dark-500">
                                        <p className="text-white text-sm font-medium mb-1">{example.title}</p>
                                        <pre className="text-primary-400 text-xs overflow-x-auto p-2 bg-dark-900 rounded">
                                          {example.code}
                                        </pre>
                                        <p className="text-dark-300 text-xs mt-1">{example.explanation}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button 
                          className="w-full btn-primary flex items-center justify-center space-x-2"
                          onClick={() => navigate(`/simulator?challenge=${challenge.id}`)}
                        >
                          <Play size={16} />
                          <span>Start Challenge</span>
                        </button>
                      </motion.div>
                    )}
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