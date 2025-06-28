import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SceneContainer from '@/components/simulator/SceneContainer';
import ControlPanel from '@/components/simulator/ControlPanel';
import CodeEditor from '@/components/editor/CodeEditor';
import BlockEditor from '@/components/editor/BlockEditor';
import NaturalLanguageInput from '@/components/editor/NaturalLanguageInput';
import { Code, Blocks, MessageSquare, Book, ArrowLeft, CheckCircle, Target, Trophy, Play, Lightbulb, BookOpen } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';
import { Challenge, ChallengeCategory, DifficultyLevel } from '@/types/challenge.types';
import { useRobotStore } from '@/store/robotStore';
import { motion, AnimatePresence } from 'framer-motion';

type EditorTab = 'code' | 'blocks' | 'natural';

// Challenge data with proper integration
const challengeData: Record<string, Challenge> = {
  'intro-1': {
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
- Duration (in milliseconds or seconds)`
      },
      { 
        id: 'obj2', 
        description: 'Move the robot forward 5 meters',
        completionCriteria: 'distance_forward_5m',
        completed: false,
        hints: [
          'Use robot.move() with the "forward" direction',
          'Set speed between 0 and 1',
          'Calculate duration based on speed and distance'
        ]
      },
      { 
        id: 'obj3', 
        description: 'Rotate the robot 90 degrees right',
        completionCriteria: 'rotation_90_degrees',
        completed: false,
        hints: [
          'Use robot.rotate() with the "right" direction',
          'Angle is specified in degrees',
          'Wait for rotation to complete'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Start with lower speed for precise control', unlockCost: 0 },
      { id: 'hint2', text: 'Chain commands using async/await', unlockCost: 5 },
    ],
    startingCode: {
      natural_language: 'Move the robot forward and then turn right',
      block: '[]',
      code: `// Welcome to your first robot programming challenge!
// Complete the objectives by programming the robot

// Objective 1: Study the theory (completed when you read it)
// Objective 2: Move robot forward 5 meters
await robot.move({
  direction: "forward",
  speed: 0.5,
  duration: 4000  // Adjust for 5 meters
});

// Objective 3: Rotate robot 90 degrees right  
await robot.rotate({
  direction: "right",
  angle: 90
});

console.log("Challenge completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['intro-2'],
  },
  'intro-2': {
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
        theory: `Robots use various sensors:
1. Distance Sensors (Ultrasonic, Infrared)
2. Cameras (RGB, Depth)
3. Touch Sensors
4. Gyroscopes`
      },
      {
        id: 'obj5',
        description: 'Read the ultrasonic sensor',
        completionCriteria: 'sensor_read_complete',
        completed: false,
        hints: [
          'Use robot.getSensor("ultrasonic")',
          'Sensor returns distance in meters',
          'Values < 1 indicate nearby obstacles'
        ]
      }
    ],
    hints: [
      { id: 'hint3', text: 'Sensors return promises, use await', unlockCost: 5 },
      { id: 'hint4', text: 'Combine movement with sensor data', unlockCost: 10 },
    ],
    startingCode: {
      natural_language: 'Move forward until obstacle detected, then stop',
      block: '[]',
      code: `// Learn about robot sensors!

// Objective 1: Study sensor theory (completed when you read it)
// Objective 2: Read the ultrasonic sensor
const distance = await robot.getSensor("ultrasonic");
console.log("Distance to obstacle:", distance, "meters");

// Move forward while monitoring sensor
while (true) {
  const currentDistance = await robot.getSensor("ultrasonic");
  console.log("Current distance:", currentDistance);
  
  if (currentDistance < 1.0) {
    console.log("Obstacle detected! Stopping...");
    await robot.stop();
    break;
  }
  
  await robot.move({
    direction: "forward",
    speed: 0.3,
    duration: 100
  });
  
  await robot.wait(50);
}`
    },
    robotType: 'mobile',
    environmentId: 'sensor-course',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['warehouse-1'],
  },
  'warehouse-1': {
    id: 'warehouse-1',
    title: 'Warehouse Navigation',
    description: 'Navigate through a warehouse environment while avoiding obstacles.',
    category: ChallengeCategory.WAREHOUSE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj6',
        description: 'Study path planning strategies',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Path planning involves:
1. Identifying goal location
2. Detecting obstacles  
3. Finding efficient route
4. Maintaining safe distances`
      },
      {
        id: 'obj7',
        description: 'Navigate to the pickup area',
        completionCriteria: 'reached_pickup',
        completed: false,
      },
      {
        id: 'obj8',
        description: 'Pick up the package',
        completionCriteria: 'package_grabbed',
        completed: false,
      }
    ],
    hints: [
      { id: 'hint5', text: 'Break navigation into smaller steps', unlockCost: 10 },
      { id: 'hint6', text: 'Use waypoints for complex paths', unlockCost: 15 },
    ],
    startingCode: {
      natural_language: 'Navigate to pickup area and grab package',
      block: '[]',
      code: `// Warehouse navigation challenge!

// Objective 1: Study path planning (completed when you read it)
// Objective 2: Navigate to pickup area at (5, 0, 8)
// Objective 3: Grab the package

// Plan your path to coordinates (5, 0, 8)
await robot.move({
  direction: "forward",
  speed: 0.4,
  duration: 3000
});

// Add obstacle avoidance logic here
const distance = await robot.getSensor("ultrasonic");
if (distance < 2) {
  console.log("Obstacle detected, planning alternate route...");
  // Add your navigation logic
}

// When you reach the pickup area:
await robot.grab();
console.log("Package picked up!");`
    },
    robotType: 'mobile',
    environmentId: 'warehouse',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['warehouse-2'],
  }
};

const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('code');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>('// Welcome to the Robot Simulator!\n// Select a robot from the control panel and start programming\n\nconsole.log("Hello, Robot!");');
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const navigate = useNavigate();
  
  const { 
    setCurrentChallenge: setStoreChallengeId,
    challengeTracking,
    getObjectiveStatus,
    getChallengeStatus,
    markTheoryViewed,
    moveRobot,
    rotateRobot,
    grabObject,
    readSensor,
    stopRobot,
    robotState
  } = useRobotStore();

  // Load challenge from URL parameter (optional)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeId = params.get('challenge');
    
    if (challengeId && challengeData[challengeId]) {
      const challenge = challengeData[challengeId];
      setCurrentChallenge(challenge);
      setCode(challenge.startingCode.code);
      setStoreChallengeId(challengeId);
      
      console.log(`🎯 Loaded challenge: ${challenge.title}`);
    } else {
      // Standalone simulator mode
      setCurrentChallenge(null);
      setStoreChallengeId(null);
      setCode('// Welcome to the Robot Simulator!\n// Select a robot from the control panel and start programming\n\nconsole.log("Hello, Robot!");');
    }
  }, [setStoreChallengeId]);

  // Real-time objective completion listener
  useEffect(() => {
    const handleObjectiveCompleted = (event: CustomEvent) => {
      const { objectiveId, challengeId } = event.detail;
      console.log(`✅ Objective completed: ${objectiveId} in ${challengeId}`);
      
      // Update current challenge objectives if we're in challenge mode
      if (currentChallenge && challengeId === currentChallenge.id) {
        setCurrentChallenge(prev => prev ? {
          ...prev,
          objectives: prev.objectives.map(obj => 
            obj.id === objectiveId ? { ...obj, completed: true } : obj
          )
        } : null);
      }
    };

    const handleChallengeCompleted = (event: CustomEvent) => {
      const { challengeId } = event.detail;
      console.log(`🏆 Challenge completed: ${challengeId}`);
      
      if (currentChallenge && challengeId === currentChallenge.id) {
        setCurrentChallenge(prev => prev ? { ...prev, completed: true } : null);
      }
    };

    window.addEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    };
  }, [currentChallenge]);

  // Update objectives based on store state
  useEffect(() => {
    if (currentChallenge) {
      const updatedObjectives = currentChallenge.objectives.map(obj => ({
        ...obj,
        completed: getObjectiveStatus(obj.id)
      }));
      
      const hasChanges = updatedObjectives.some((obj, index) => 
        obj.completed !== currentChallenge.objectives[index]?.completed
      );
      
      if (hasChanges) {
        setCurrentChallenge(prev => prev ? {
          ...prev,
          objectives: updatedObjectives,
          completed: getChallengeStatus(prev.id)
        } : null);
      }
    }
  }, [currentChallenge, getObjectiveStatus, getChallengeStatus, challengeTracking.completedObjectives]);

  const handleCodeRun = async (codeToRun: string) => {
    console.log('🚀 Running code:', codeToRun);
    
    // Mark theory as viewed for theory-based objectives if in challenge mode
    if (currentChallenge) {
      if (currentChallenge.id === 'intro-1') {
        markTheoryViewed('movement_basics');
      } else if (currentChallenge.id === 'intro-2') {
        markTheoryViewed('sensor_basics');
      } else if (currentChallenge.id === 'warehouse-1') {
        markTheoryViewed('path_planning');
      }
    }
    
    try {
      // Create robot API that integrates with the store and tracks objectives
      const robot = {
        move: async (params: { direction: string; speed: number; duration: number }) => {
          console.log('🤖 Robot moving:', params);
          
          // Use the same pattern as CodeEditor for consistency
          const normalizedSpeed = Math.max(0.1, Math.min(1.0, params.speed));
          
          await stopRobot();
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (params.direction === 'forward' || params.direction === 'backward') {
            moveRobot({ direction: params.direction as any, speed: normalizedSpeed });
          } else {
            rotateRobot({ direction: params.direction as any, speed: normalizedSpeed });
          }
          
          // Wait for the specified duration
          await new Promise(resolve => setTimeout(resolve, params.duration));
          await stopRobot();
          
          // Update challenge tracking after movement
          const state = useRobotStore.getState();
          const newTracking = { ...state.challengeTracking };
          
          // Calculate distance moved based on speed and duration
          const distance = (normalizedSpeed * params.duration) / 1000; // rough estimation
          newTracking.totalDistanceMoved += distance;
          
          if (params.direction === 'forward') {
            newTracking.hasMovedForward = true;
            newTracking.maxForwardDistance += distance;
            console.log(`📈 Forward distance updated: ${newTracking.maxForwardDistance.toFixed(3)}m`);
          } else if (params.direction === 'backward') {
            newTracking.hasMovedBackward = true;
            newTracking.maxBackwardDistance += distance;
          }
          
          // Update store with new tracking
          useRobotStore.setState({
            challengeTracking: newTracking
          });
          
          // Check objectives after a short delay
          setTimeout(() => {
            state.checkAndCompleteObjectives();
          }, 100);
        },
        
        rotate: async (params: { direction: string; angle: number }) => {
          console.log('🔄 Robot rotating:', params);
          
          const normalizedSpeed = 0.5;
          const duration = Math.max(300, params.angle * 10); // Estimate duration based on angle
          
          await stopRobot();
          await new Promise(resolve => setTimeout(resolve, 100));
          
          rotateRobot({ direction: params.direction as any, speed: normalizedSpeed });
          await new Promise(resolve => setTimeout(resolve, duration));
          await stopRobot();
          
          // Update challenge tracking after rotation
          const state = useRobotStore.getState();
          const newTracking = { ...state.challengeTracking };
          
          // Convert angle to radians and track
          const angleInRadians = (params.angle * Math.PI) / 180;
          newTracking.totalRotations += angleInRadians;
          newTracking.totalRotationAngle += angleInRadians;
          
          if (params.direction === 'left') {
            newTracking.hasRotatedLeft = true;
          } else {
            newTracking.hasRotatedRight = true;
          }
          
          console.log(`🧭 Rotation updated: ${(newTracking.totalRotationAngle * 180 / Math.PI).toFixed(1)}°`);
          
          // Update store with new tracking
          useRobotStore.setState({
            challengeTracking: newTracking
          });
          
          // Check objectives after a short delay
          setTimeout(() => {
            state.checkAndCompleteObjectives();
          }, 100);
        },
        
        stop: async () => {
          console.log('⏹️ Robot stopping');
          stopRobot();
          return Promise.resolve();
        },
        
        wait: async (ms: number) => {
          console.log(`⏱️ Waiting ${ms}ms`);
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        getSensor: async (type: string) => {
          console.log('📡 Reading sensor:', type);
          const reading = await readSensor(type);
          console.log(`📊 Sensor reading: ${reading}`);
          return reading;
        },
        
        grab: async () => {
          console.log('🤏 Grabbing object');
          grabObject();
          return Promise.resolve();
        },
        
        get position() {
          return robotState?.position || { x: 0, y: 0, z: 0 };
        }
      };
      
      // Execute the code with the robot API
      const asyncFunction = new Function('robot', `
        return (async () => {
          ${codeToRun}
        })();
      `);
      
      await asyncFunction(robot);
      console.log('✅ Code execution completed');
      
    } catch (error) {
      console.error('❌ Code execution error:', error);
      alert(`Code Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getCompletedObjectivesCount = () => {
    if (!currentChallenge) return { completed: 0, total: 0 };
    const completed = currentChallenge.objectives.filter(obj => obj.completed).length;
    return { completed, total: currentChallenge.objectives.length };
  };

  const progress = getCompletedObjectivesCount();
  const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Handle opening theory modal and marking theory as viewed
  const handleOpenTheoryModal = () => {
    setShowTheoryModal(true);
    
    // Mark theory as viewed when modal is opened
    if (currentChallenge) {
      const theoryMap: Record<string, string> = {
        'intro-1': 'movement_basics',
        'intro-2': 'sensor_basics', 
        'warehouse-1': 'path_planning'
      };
      
      const theoryId = theoryMap[currentChallenge.id];
      if (theoryId) {
        markTheoryViewed(theoryId);
      }
    }
  };

  // Theory Modal Component
  const TheoryModal = () => {
    if (!showTheoryModal || !currentChallenge) return null;

    const theoryObjective = currentChallenge.objectives.find(obj => obj.theory);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BookOpen className="mr-2" />
                Theory - {currentChallenge.title}
              </h2>
              <button 
                onClick={() => setShowTheoryModal(false)}
                className="text-dark-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {theoryObjective && (
              <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                <pre className="text-dark-300 whitespace-pre-wrap text-sm">
                  {theoryObjective.theory}
                </pre>
              </div>
            )}
            
            <div className="bg-success-900/20 border border-success-600 rounded-lg p-4 mt-4">
              <div className="flex items-center text-success-400 mb-2">
                <CheckCircle size={16} className="mr-2" />
                <span className="font-medium">Theory Study Complete!</span>
              </div>
              <p className="text-success-300 text-sm">
                Theory-based objectives will be marked as complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hints Modal Component
  const HintsModal = () => {
    if (!showHintsModal || !currentChallenge) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Lightbulb className="mr-2" />
                Hints - {currentChallenge.title}
              </h2>
              <button 
                onClick={() => setShowHintsModal(false)}
                className="text-dark-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {currentChallenge.hints?.map((hint, index) => (
                <div key={hint.id} className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                  <h3 className="text-white font-medium mb-2">Hint #{index + 1}</h3>
                  <p className="text-dark-300">{hint.text}</p>
                </div>
              ))}
              
              {currentChallenge.objectives?.map((objective) => 
                objective.hints?.map((hint, hintIndex) => (
                  <div key={`${objective.id}-${hintIndex}`} className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <h3 className="text-white font-medium mb-2">
                      {objective.description} - Hint #{hintIndex + 1}
                    </h3>
                    <p className="text-dark-300">{hint}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-dark-900">
        {/* Challenge Header - Only show if in challenge mode */}
        {currentChallenge && (
          <>
            <div className="px-6 py-6 bg-dark-800 border-b border-dark-600">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      className="btn bg-dark-700 hover:bg-dark-600 text-white p-2.5 rounded-lg transition-colors"
                      onClick={() => navigate('/challenges')}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h1>
                      <p className="text-dark-300 text-lg">{currentChallenge.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-dark-400">
                          Progress: {progress.completed}/{progress.total} objectives ({progressPercentage}%)
                        </span>
                        {currentChallenge.completed && (
                          <span className="flex items-center text-success-400 text-sm">
                            <Trophy size={16} className="mr-1" />
                            Challenge Complete!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex space-x-3">
                    <button
                      onClick={handleOpenTheoryModal}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center text-sm"
                    >
                      <BookOpen size={14} className="mr-2" />
                      Theory
                    </button>
                    <button
                      onClick={() => setShowHintsModal(true)}
                      className="bg-warning-600 hover:bg-warning-700 text-white px-4 py-2 rounded flex items-center text-sm"
                    >
                      <Lightbulb size={14} className="mr-2" />
                      Hints
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives Panel - Only show if in challenge mode */}
            <div className="px-6 py-4 bg-dark-850 border-b border-dark-600">
              <div className="max-w-7xl mx-auto">
                <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Target size={18} className="mr-2" />
                    Challenge Objectives
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-dark-400">Overall Progress</span>
                      <span className="text-sm text-dark-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full transition-all ${
                          currentChallenge.completed ? 'bg-success-500' : 'bg-primary-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentChallenge.objectives.map((objective, index) => (
                      <motion.div
                        key={objective.id}
                        className={`p-4 rounded-lg border transition-all ${
                          objective.completed
                            ? 'bg-success-900/20 border-success-700'
                            : 'bg-dark-600 border-dark-500'
                        }`}
                        animate={objective.completed ? { backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start">
                          <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-colors mt-0.5 ${
                            objective.completed 
                              ? 'bg-success-500 text-white' 
                              : 'bg-dark-500 text-dark-300'
                          }`}>
                            <AnimatePresence>
                              {objective.completed ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckCircle size={14} />
                                </motion.div>
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium transition-colors ${
                              objective.completed ? 'text-success-300' : 'text-white'
                            }`}>
                              {objective.description}
                            </p>
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
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Standalone Simulator Header - Only show if not in challenge mode */}
        {!currentChallenge && (
          <div className="px-6 py-6 bg-dark-800 border-b border-dark-600">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-white mb-2">Robot Simulator</h1>
              <p className="text-dark-300 text-lg">Program and control robots in a virtual environment</p>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 3D Scene */}
              <div className="h-[600px] bg-dark-800 rounded-xl border border-dark-600 overflow-hidden shadow-xl">
                <SceneContainer />
              </div>
              
              {/* Code Editor */}
              <div className="editor-container shadow-xl">
                <div className="flex border-b border-dark-600 bg-dark-800 px-2">
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'code' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('code')}
                  >
                    <Code size={16} className="mr-2" />
                    <span>Code Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'blocks' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('blocks')}
                  >
                    <Blocks size={16} className="mr-2" />
                    <span>Block Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'natural' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('natural')}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    <span>Natural Language</span>
                  </button>
                </div>
                
                <div className="editor-content">
                  {activeTab === 'code' && (
                    <CodeEditor 
                      initialCode={code}
                      onCodeChange={setCode}
                      onCodeRun={handleCodeRun}
                    />
                  )}
                  {activeTab === 'blocks' && <BlockEditor />}
                  {activeTab === 'natural' && <NaturalLanguageInput />}
                </div>
              </div>
            </div>
            
            {/* Control Panel */}
            <div className="h-full">
              <ControlPanel challenge={currentChallenge} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Only show if in challenge mode */}
      {currentChallenge && (
        <>
          <TheoryModal />
          <HintsModal />
        </>
      )}
    </Layout>
  );
};

export default SimulatorPage;
