import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, LockKeyhole, Star, Book, Tag, Play, CheckCircle, Clock, Target, Award, HelpCircle, Eye, BookOpen, Code, Lightbulb, X } from 'lucide-react';

// Mock types (you'll need to import these from your actual types file)
const ChallengeCategory = {
  INTRO: 'intro',
  WAREHOUSE: 'warehouse',
  SURGERY: 'surgery',
  SEARCH_RESCUE: 'search_rescue',
  MANUFACTURING: 'manufacturing'
};

const DifficultyLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Mock robot store (replace with your actual store)
const useRobotStore = () => ({
  challengeTracking: {
    completedChallenges: ['intro-1'],
    completedObjectives: ['obj1'],
    totalDistanceMoved: 15.3,
    totalRotations: Math.PI * 2.5
  },
  getChallengeStatus: (id) => id === 'intro-1',
  getObjectiveStatus: (id) => id === 'obj1',
  performance: {},
  robotState: {
    position: { x: 2.5, z: 3.2 },
    batteryLevel: 85
  }
});

// Mock navigation hook
const useNavigate = () => (path) => console.log('Navigate to:', path);

// Enhanced challenge data
const challenges = [
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
        completed: true,
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
    completed: true,
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
        description: 'Understand different types of sensors',
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
    nextChallengeIds: ['warehouse-1'],
  }
];

const ChallengesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [realtimeChallenges, setRealtimeChallenges] = useState(challenges);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedHints, setSelectedHints] = useState([]);
  const [currentQuizAnswer, setCurrentQuizAnswer] = useState({});
  const [showQuizResults, setShowQuizResults] = useState({});
  
  const navigate = useNavigate();
  const { 
    challengeTracking, 
    getChallengeStatus, 
    getObjectiveStatus,
    performance,
    robotState
  } = useRobotStore();

  // Modal handlers
  const openModal = (type, data = null) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedHints([]);
    setCurrentQuizAnswer({});
    setShowQuizResults({});
  };

  const handleHintUnlock = (hint) => {
    if (hint.unlockCost === 0 || window.confirm(`Unlock this hint for ${hint.unlockCost} points?`)) {
      setSelectedHints(prev => [...prev, hint.id]);
    }
  };

  const handleQuizAnswer = (questionIndex, answer, correctAnswer) => {
    setCurrentQuizAnswer(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
    
    setTimeout(() => {
      setShowQuizResults(prev => ({
        ...prev,
        [questionIndex]: {
          correct: answer === correctAnswer,
          selected: answer
        }
      }));
    }, 500);
  };

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
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER: return 'green';
      case DifficultyLevel.INTERMEDIATE: return 'blue';
      case DifficultyLevel.ADVANCED: return 'yellow';
      case DifficultyLevel.EXPERT: return 'red';
      default: return 'blue';
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case ChallengeCategory.INTRO: return <Book size={16} />;
      case ChallengeCategory.WAREHOUSE: return <Tag size={16} />;
      case ChallengeCategory.SURGERY: return <Star size={16} />;
      case ChallengeCategory.SEARCH_RESCUE: return <Trophy size={16} />;
      case ChallengeCategory.MANUFACTURING: return <Tag size={16} />;
      default: return <Book size={16} />;
    }
  };

  const getObjectiveProgress = (challenge) => {
    const completed = challenge.objectives.filter(obj => obj.completed).length;
    const total = challenge.objectives.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const handleChallengeClick = (challenge) => {
    if (!challenge.unlocked) return;
    setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id);
  };

  // Modal Components
  const TheoryModal = ({ challenge }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BookOpen className="mr-2" />
              Learning Materials - {challenge.title}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          {challenge.theory?.sections.map((section, index) => (
            <div key={index} className="mb-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">{section.title}</h3>
              <div className="text-gray-300 whitespace-pre-wrap mb-4">{section.content}</div>
              
              {section.examples && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-green-400">Examples:</h4>
                  {section.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="bg-slate-800 rounded p-3 border border-slate-600">
                      <h5 className="text-white font-medium mb-2">{example.title}</h5>
                      <pre className="text-green-300 text-sm mb-2 overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                      <p className="text-gray-400 text-sm">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {section.video && (
                <div className="mt-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center">
                    <Play className="mr-2" size={16} />
                    Watch Video Tutorial
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuizModal = ({ challenge }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Star className="mr-2" />
              Knowledge Quiz - {challenge.title}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          {challenge.theory?.quiz?.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 bg-slate-700 rounded-lg">
              <p className="text-white text-lg mb-4">{question.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {question.options.map((option, optIndex) => {
                  const isSelected = currentQuizAnswer[qIndex] === option;
                  const showResult = showQuizResults[qIndex];
                  const isCorrect = option === question.correctAnswer;
                  
                  let buttonClass = "p-3 rounded border text-left transition-colors ";
                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonClass += "bg-green-600 border-green-500 text-white";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-600 border-red-500 text-white";
                    } else if (isCorrect) {
                      buttonClass += "bg-green-600 border-green-500 text-white";
                    } else {
                      buttonClass += "bg-slate-600 border-slate-500 text-gray-300";
                    }
                  } else {
                    buttonClass += isSelected 
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-600 border-slate-500 text-gray-300 hover:border-slate-400";
                  }
                  
                  return (
                    <button
                      key={optIndex}
                      className={buttonClass}
                      onClick={() => handleQuizAnswer(qIndex, option, question.correctAnswer)}
                      disabled={showResult}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {showQuizResults[qIndex] && (
                <div className="mt-3 p-3 bg-blue-900 border border-blue-600 rounded">
                  <p className="text-blue-300 text-sm">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HintsModal = ({ challenge }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Lightbulb className="mr-2" />
              Hints - {challenge.title}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {challenge.hints?.map((hint, index) => (
              <div key={hint.id} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">Hint #{index + 1}</h3>
                    {selectedHints.includes(hint.id) ? (
                      <p className="text-gray-300">{hint.text}</p>
                    ) : (
                      <p className="text-gray-500 italic">Click to unlock this hint</p>
                    )}
                  </div>
                  {!selectedHints.includes(hint.id) && (
                    <button
                      onClick={() => handleHintUnlock(hint)}
                      className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm flex items-center"
                    >
                      <HelpCircle size={14} className="mr-1" />
                      {hint.unlockCost === 0 ? 'Free' : `${hint.unlockCost} pts`}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {challenge.objectives?.map((objective) => 
              objective.hints?.map((hint, hintIndex) => (
                <div key={`${objective.id}-${hintIndex}`} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h3 className="text-white font-medium mb-2">
                    {objective.description} - Hint #{hintIndex + 1}
                  </h3>
                  <p className="text-gray-300">{hint}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CodeModal = ({ challenge }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Code className="mr-2" />
              Starting Code - {challenge.title}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="text-green-400 font-medium mb-2">Natural Language Description:</h3>
              <p className="text-gray-300">{challenge.startingCode?.natural_language}</p>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">Starting Code:</h3>
              <pre className="text-gray-300 text-sm overflow-x-auto bg-slate-800 p-3 rounded border">
                <code>{challenge.startingCode?.code}</code>
              </pre>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(challenge.startingCode?.code);
                  alert('Code copied to clipboard!');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Copy Code
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate(`/simulator?challenge=${challenge.id}`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              >
                <Play className="mr-2" size={16} />
                Open in Simulator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Learning Challenges</h1>
            <p className="text-gray-400">
              Progress through our robotics challenges from beginner to expert level
            </p>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 border border-blue-700 text-blue-400 mb-1">
                <Award size={24} />
              </div>
              <span className="text-sm text-gray-300">1/2</span>
              <span className="text-xs text-gray-500">Completed</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-900 border border-yellow-700 text-yellow-400 mb-1">
                <Trophy size={24} />
              </div>
              <span className="text-sm text-gray-300">150</span>
              <span className="text-xs text-gray-500">Points</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-900 border border-purple-700 text-purple-400 mb-1">
                <Star size={24} />
              </div>
              <span className="text-sm text-gray-300">4</span>
              <span className="text-xs text-gray-500">Badges</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
              <select
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        {robotState && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Target size={16} className="mr-2" />
              Live Robot Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Position</span>
                <p className="text-white font-mono">
                  ({robotState.position.x.toFixed(1)}, {robotState.position.z.toFixed(1)})
                </p>
              </div>
              <div>
                <span className="text-gray-400">Distance</span>
                <p className="text-white font-mono">
                  {challengeTracking.totalDistanceMoved.toFixed(1)}m
                </p>
              </div>
              <div>
                <span className="text-gray-400">Rotations</span>
                <p className="text-white font-mono">
                  {(challengeTracking.totalRotations / Math.PI * 180).toFixed(0)}°
                </p>
              </div>
              <div>
                <span className="text-gray-400">Battery</span>
                <p className="text-white font-mono">{robotState.batteryLevel}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Challenge List */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => {
            const progress = getObjectiveProgress(challenge);
            const isExpanded = expandedChallenge === challenge.id;
            
            return (
              <div
                key={challenge.id}
                className={`bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer transition-all ${
                  challenge.unlocked ? 'hover:border-slate-600' : 'opacity-70'
                } ${challenge.completed ? 'border-green-500 bg-green-900/10' : ''}`}
                onClick={() => handleChallengeClick(challenge)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`p-1.5 rounded-md bg-${getDifficultyColor(challenge.difficulty)}-900 border border-${getDifficultyColor(challenge.difficulty)}-700 mr-2 text-${getDifficultyColor(challenge.difficulty)}-400`}>
                        {getCategoryIcon(challenge.category)}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                      {challenge.completed && (
                        <CheckCircle className="ml-2 text-green-400" size={20} />
                      )}
                      {!challenge.unlocked && (
                        <LockKeyhole className="ml-2 text-gray-500" size={16} />
                      )}
                    </div>
                    
                    <p className="text-gray-400 mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${getDifficultyColor(challenge.difficulty)}-900 text-${getDifficultyColor(challenge.difficulty)}-400 border border-${getDifficultyColor(challenge.difficulty)}-700`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {challenge.estimatedTime} min
                      </span>
                      <span className="text-gray-500">
                        {progress.completed}/{progress.total} objectives
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end ml-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {challenge.unlocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/simulator?challenge=${challenge.id}`);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm"
                        >
                          <Play size={14} className="mr-1" />
                          Start
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    
                    {progress.total > 0 && (
                      <div className="w-24 bg-slate-700 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('theory', challenge);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center text-sm"
                      >
                        <BookOpen size={14} className="mr-2" />
                        Theory
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('quiz', challenge);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center text-sm"
                      >
                        <Star size={14} className="mr-2" />
                        Quiz
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('hints', challenge);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center text-sm"
                      >
                        <Lightbulb size={14} className="mr-2" />
                        Hints ({challenge.hints?.length || 0})
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('code', challenge);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center text-sm"
                      >
                        <Code size={14} className="mr-2" />
                        View Code
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('preview', challenge);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center text-sm"
                      >
                        <Eye size={14} className="mr-2" />
                        Preview
                      </button>
                    </div>

                    {/* Objectives */}
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Target size={16} className="mr-2" />
                        Objectives
                      </h4>
                      <div className="space-y-3">
                        {challenge.objectives.map((objective, index) => (
                          <div
                            key={objective.id}
                            className={`p-4 rounded-lg border ${
                              objective.completed
                                ? 'bg-green-900/20 border-green-700'
                                : 'bg-slate-700 border-slate-600'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="text-sm font-medium text-gray-400 mr-3">
                                    #{index + 1}
                                  </span>
                                  <p className="text-white">{objective.description}</p>
                                  {objective.completed && (
                                    <CheckCircle className="ml-2 text-green-400" size={16} />
                                  )}
                                </div>
                                
                                {objective.theory && (
                                  <div className="mt-2 p-3 bg-slate-800 rounded border border-slate-600">
                                    <h5 className="text-blue-400 text-sm font-medium mb-2">Theory:</h5>
                                    <pre className="text-gray-300 text-xs whitespace-pre-wrap overflow-x-auto">
                                      {objective.theory}
                                    </pre>
                                  </div>
                                )}
                                
                                {objective.hints && objective.hints.length > 0 && (
                                  <div className="mt-2">
                                    <details className="group">
                                      <summary className="text-yellow-400 text-sm cursor-pointer hover:text-yellow-300">
                                        💡 Show hints ({objective.hints.length})
                                      </summary>
                                      <div className="mt-2 space-y-1">
                                        {objective.hints.map((hint, hintIndex) => (
                                          <div key={hintIndex} className="text-gray-400 text-sm pl-4 border-l-2 border-yellow-500">
                                            {hint}
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Challenges Preview */}
                    {challenge.nextChallengeIds && challenge.nextChallengeIds.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-700">
                        <h4 className="text-white font-medium mb-3">Next Challenges:</h4>
                        <div className="flex space-x-3">
                          {challenge.nextChallengeIds.map((nextId) => {
                            const nextChallenge = challenges.find(c => c.id === nextId);
                            return nextChallenge ? (
                              <div key={nextId} className="bg-slate-700 rounded p-3 text-sm">
                                <p className="text-white font-medium">{nextChallenge.title}</p>
                                <p className="text-gray-400 text-xs mt-1">{nextChallenge.category}</p>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No challenges found */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Book size={48} className="mx-auto mb-4" />
              <p className="text-lg">No challenges found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal?.type === 'theory' && <TheoryModal challenge={activeModal.data} />}
      {activeModal?.type === 'quiz' && <QuizModal challenge={activeModal.data} />}
      {activeModal?.type === 'hints' && <HintsModal challenge={activeModal.data} />}
      {activeModal?.type === 'code' && <CodeModal challenge={activeModal.data} />}
      
      {/* Preview Modal */}
      {activeModal?.type === 'preview' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Eye className="mr-2" />
                  Challenge Preview - {activeModal.data.title}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-700 p-3 rounded">
                    <span className="text-gray-400">Robot Type:</span>
                    <p className="text-white capitalize">{activeModal.data.robotType}</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <span className="text-gray-400">Environment:</span>
                    <p className="text-white">{activeModal.data.environmentId}</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <span className="text-gray-400">Estimated Time:</span>
                    <p className="text-white">{activeModal.data.estimatedTime} minutes</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <span className="text-gray-400">Objectives:</span>
                    <p className="text-white">{activeModal.data.objectives.length} total</p>
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded">
                  <h3 className="text-white font-medium mb-2">What you'll learn:</h3>
                  <ul className="text-gray-300 space-y-1">
                    {activeModal.data.objectives.map((obj, index) => (
                      <li key={obj.id} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {obj.description}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      closeModal();
                      navigate(`/simulator?challenge=${activeModal.data.id}`);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                  >
                    <Play className="mr-2" size={16} />
                    Start Challenge
                  </button>
                  <button
                    onClick={() => openModal('theory', activeModal.data)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                  >
                    <BookOpen className="mr-2" size={16} />
                    Study First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;