import React, { useState, useEffect } from 'react';
import { useRobotStore } from '@/store/robotStore';
import { Notebook as Robot, Cpu, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Grab, Hand, Book, Zap, Target, Radar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/challenge.types';

interface ControlPanelProps {
  challenge?: Challenge | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ challenge }) => {
  const { 
    selectedRobot, 
    robotState, 
    isMoving,
    selectRobot, 
    moveRobot, 
    rotateRobot, 
    grabObject, 
    releaseObject,
    stopRobot 
  } = useRobotStore();
  
  const [speed, setSpeed] = useState(50);
  const [activeSensorTab, setActiveSensorTab] = useState('camera');
  const [isPressed, setIsPressed] = useState<string | null>(null);
  
  // Enhanced robot models with better descriptions
  const availableRobots = [
    { id: 'mobile1', name: 'Explorer Bot', type: 'mobile', description: 'All-terrain mobile robot for exploration and navigation' },
    { id: 'arm1', name: 'Precision Arm', type: 'arm', description: 'Industrial robot arm for precise manipulation tasks' },
    { id: 'drone1', name: 'Sky Scanner', type: 'drone', description: 'Aerial drone for surveillance and mapping' },
    { id: 'spider1', name: 'Spider Walker', type: 'spider', description: 'Six-legged robot for rough terrain navigation' },
    { id: 'tank1', name: 'Heavy Mover', type: 'tank', description: 'Tracked robot for heavy-duty operations' },
    { id: 'humanoid1', name: 'Assistant Bot', type: 'humanoid', description: 'Bipedal humanoid robot for human interaction' },
  ];

  // Cleanup effect for movement intervals
  useEffect(() => {
    return () => {
      if ((window as any).robotMoveInterval) {
        clearInterval((window as any).robotMoveInterval);
      }
      if ((window as any).robotRotateInterval) {
        clearInterval((window as any).robotRotateInterval);
      }
    };
  }, []);
  
  // Fixed movement handlers with proper event handling
  const handleMoveStart = (direction: 'forward' | 'backward') => {
    if (!selectedRobot) return;
    setIsPressed(direction);
    moveRobot({ direction, speed: speed / 100 });
  };
  
  const handleMoveEnd = () => {
    setIsPressed(null);
    stopRobot();
  };
  
  const handleRotateStart = (direction: 'left' | 'right') => {
    if (!selectedRobot) return;
    setIsPressed(direction);
    rotateRobot({ direction, speed: speed / 100 });
  };
  
  const handleRotateEnd = () => {
    setIsPressed(null);
    stopRobot();
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent, action: () => void) => {
    e.preventDefault(); // Prevent default touch behavior
    action();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    handleMoveEnd();
  };
  
  // Arm joint control function
  const handleArmJoint = (joint: string, direction: 'forward' | 'backward' | 'left' | 'right') => {
    if (!selectedRobot) return;
    moveRobot({ 
      direction, 
      speed: speed / 100,
      joint: joint
    });
  };
  
  const handleRobotSelect = (robotId: string) => {
    const robot = availableRobots.find(r => r.id === robotId);
    if (robot) {
      selectRobot({
        id: robot.id,
        name: robot.name,
        type: robot.type as any,
        description: robot.description,
        model: `/models/${robot.type}.glb`,
        basePosition: { x: 0, y: 0, z: 0 },
        baseRotation: { x: 0, y: 0, z: 0, w: 1 },
        sensors: []
      });
    }
  };

  // Special action handlers for different robot types
  const handleSpecialAction1 = () => {
    if (!selectedRobot) return;
    
    switch (selectedRobot.type) {
      case 'spider':
        console.log('Spider climbing action');
        break;
      case 'humanoid':
        console.log('Humanoid waving action');
        break;
      case 'tank':
        console.log('Tank special weapon action');
        break;
      case 'drone':
        console.log('Drone boost action');
        break;
      default:
        console.log('Special action 1');
    }
  };

  const handleSpecialAction2 = () => {
    if (!selectedRobot) return;
    
    switch (selectedRobot.type) {
      case 'spider':
        console.log('Spider scanning action');
        break;
      case 'humanoid':
        console.log('Humanoid gesture action');
        break;
      case 'tank':
        console.log('Tank defensive action');
        break;
      case 'drone':
        console.log('Drone hover action');
        break;
      default:
        console.log('Special action 2');
    }
  };

  const getRobotIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Robot size={20} className="text-primary-400" />;
      case 'arm': return <Grab size={20} className="text-secondary-400" />;
      case 'drone': return <Zap size={20} className="text-accent-400" />;
      case 'spider': return <Target size={20} className="text-purple-400" />;
      case 'tank': return <Radar size={20} className="text-green-400" />;
      case 'humanoid': return <Robot size={20} className="text-blue-400" />;
      default: return <Robot size={20} className="text-primary-400" />;
    }
  };

  const getControlsForRobotType = () => {
    if (!selectedRobot) return null;

    switch (selectedRobot.type) {
      case 'arm':
        return (
          <div className="space-y-4">
            {/* Base Rotation */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-2">Base Rotation</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('base', 'left')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('base', 'left'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center justify-center text-xs text-dark-400">Base</div>
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('base', 'right')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('base', 'right'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Shoulder */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-2">Shoulder</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('shoulder', 'backward')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('shoulder', 'backward'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowDown size={16} />
                </button>
                <div className="flex items-center justify-center text-xs text-dark-400">Shoulder</div>
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('shoulder', 'forward')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('shoulder', 'forward'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>

            {/* Elbow */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-2">Elbow</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('elbow', 'backward')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('elbow', 'backward'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowDown size={16} />
                </button>
                <div className="flex items-center justify-center text-xs text-dark-400">Elbow</div>
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('elbow', 'forward')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('elbow', 'forward'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>

            {/* Wrist */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-2">Wrist</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('wrist', 'left')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('wrist', 'left'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center justify-center text-xs text-dark-400">Wrist</div>
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('wrist', 'right')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={(e) => handleTouchStart(e, () => handleArmJoint('wrist', 'right'))}
                  onTouchEnd={handleTouchEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Gripper Controls */}
            <div className="flex space-x-2">
              <button 
                className="btn bg-success-600 hover:bg-success-700 text-white py-2 flex-1 flex items-center justify-center transition-colors"
                onClick={grabObject}
                disabled={!selectedRobot}
              >
                <Grab size={18} className="mr-2" />
                <span>Grab</span>
              </button>
              <button 
                className="btn bg-warning-600 hover:bg-warning-700 text-white py-2 flex-1 flex items-center justify-center transition-colors"
                onClick={releaseObject}
                disabled={!selectedRobot}
              >
                <Hand size={18} className="mr-2" />
                <span>Release</span>
              </button>
            </div>
          </div>
        );

      default:
        // Standard movement controls for mobile, drone, spider, tank, humanoid
        return (
          <div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div></div>
              <button 
                className={`btn text-white py-3 flex items-center justify-center transition-colors ${
                  isPressed === 'forward' ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'
                }`}
                onMouseDown={() => handleMoveStart('forward')}
                onMouseUp={handleMoveEnd}
                onMouseLeave={handleMoveEnd}
                onTouchStart={(e) => handleTouchStart(e, () => handleMoveStart('forward'))}
                onTouchEnd={handleTouchEnd}
                disabled={!selectedRobot}
              >
                <ArrowUp size={20} />
              </button>
              <div></div>
              
              <button 
                className={`btn text-white py-3 flex items-center justify-center transition-colors ${
                  isPressed === 'left' ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'
                }`}
                onMouseDown={() => handleRotateStart('left')}
                onMouseUp={handleRotateEnd}
                onMouseLeave={handleRotateEnd}
                onTouchStart={(e) => handleTouchStart(e, () => handleRotateStart('left'))}
                onTouchEnd={handleTouchEnd}
                disabled={!selectedRobot}
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                className={`btn text-white py-3 flex items-center justify-center transition-colors ${
                  isPressed === 'backward' ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'
                }`}
                onMouseDown={() => handleMoveStart('backward')}
                onMouseUp={handleMoveEnd}
                onMouseLeave={handleMoveEnd}
                onTouchStart={(e) => handleTouchStart(e, () => handleMoveStart('backward'))}
                onTouchEnd={handleTouchEnd}
                disabled={!selectedRobot}
              >
                <ArrowDown size={20} />
              </button>
              <button 
                className={`btn text-white py-3 flex items-center justify-center transition-colors ${
                  isPressed === 'right' ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'
                }`}
                onMouseDown={() => handleRotateStart('right')}
                onMouseUp={handleRotateEnd}
                onMouseLeave={handleRotateEnd}
                onTouchStart={(e) => handleTouchStart(e, () => handleRotateStart('right'))}
                onTouchEnd={handleTouchEnd}
                disabled={!selectedRobot}
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Special actions for specific robot types */}
            {(selectedRobot.type === 'spider' || selectedRobot.type === 'humanoid' || selectedRobot.type === 'tank' || selectedRobot.type === 'drone') && (
              <div className="flex space-x-2 mb-4">
                <button 
                  className="btn bg-accent-600 hover:bg-accent-700 text-white py-2 flex-1 flex items-center justify-center transition-colors"
                  onClick={handleSpecialAction1}
                  disabled={!selectedRobot}
                >
                  <Target size={18} className="mr-2" />
                  <span>
                    {selectedRobot.type === 'spider' ? 'Climb' : 
                     selectedRobot.type === 'humanoid' ? 'Wave' :
                     selectedRobot.type === 'tank' ? 'Weapon' :
                     selectedRobot.type === 'drone' ? 'Boost' : 'Action 1'}
                  </span>
                </button>
                <button 
                  className="btn bg-secondary-600 hover:bg-secondary-700 text-white py-2 flex-1 flex items-center justify-center transition-colors"
                  onClick={handleSpecialAction2}
                  disabled={!selectedRobot}
                >
                  <Radar size={18} className="mr-2" />
                  <span>
                    {selectedRobot.type === 'spider' ? 'Scan' : 
                     selectedRobot.type === 'humanoid' ? 'Gesture' :
                     selectedRobot.type === 'tank' ? 'Shield' :
                     selectedRobot.type === 'drone' ? 'Hover' : 'Action 2'}
                  </span>
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Control Panel</h3>
        <div className="flex space-x-2">
          <select
            className="input bg-dark-700 text-white py-1 px-2 text-sm"
            value={selectedRobot?.id || ''}
            onChange={(e) => handleRobotSelect(e.target.value)}
          >
            <option value="">Select Robot</option>
            {availableRobots.map(robot => (
              <option key={robot.id} value={robot.id}>
                {robot.name} ({robot.type})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedRobot ? (
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="bg-primary-900 p-2 rounded-md mr-3 border border-primary-700">
                {getRobotIcon(selectedRobot.type)}
              </div>
              <div>
                <h4 className="font-medium text-white">{selectedRobot.name}</h4>
                <p className="text-sm text-dark-300">Type: {selectedRobot.type}</p>
                <p className="text-xs text-dark-400">{selectedRobot.description}</p>
                <p className="text-sm text-dark-300">
                  Status: <span className={isMoving ? 'text-warning-400' : 'text-success-400'}>
                    {isMoving ? 'Moving' : 'Idle'}
                  </span>
                </p>
              </div>
            </div>
            
            {challenge && (
              <div className="mb-6 bg-dark-700 rounded-lg p-4 border border-dark-600">
                <div className="flex items-center mb-3">
                  <Book size={18} className="text-primary-400 mr-2" />
                  <h4 className="font-medium text-white">Challenge Progress</h4>
                </div>
                <div className="space-y-2">
                  {challenge.objectives.map((objective) => (
                    <div 
                      key={objective.id}
                      className="flex items-center text-sm"
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        objective.completed 
                          ? 'bg-success-500' 
                          : 'bg-dark-500'
                      }`} />
                      <span className={objective.completed ? 'text-success-400' : 'text-dark-300'}>
                        {objective.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Speed: {speed}%
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Dynamic Movement Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3">
                {selectedRobot.type === 'arm' ? 'Arm Controls' : 'Movement Controls'}
              </h4>
              
              {getControlsForRobotType()}
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-white mb-2">Robot State</h4>
              <div className="bg-dark-700 rounded-md p-3 text-sm font-mono">
                <p className="text-dark-300">Position: <span className="text-white">
                  {robotState ? `(${robotState.position.x.toFixed(2)}, ${robotState.position.y.toFixed(2)}, ${robotState.position.z.toFixed(2)})` : 'N/A'}
                </span></p>
                <p className="text-dark-300">Rotation: <span className="text-white">
                  {robotState ? `${(robotState.rotation.y * 180 / Math.PI).toFixed(2)}°` : 'N/A'}
                </span></p>
                <p className="text-dark-300">Battery: <span className={`${robotState && robotState.batteryLevel > 20 ? 'text-success-400' : 'text-warning-400'}`}>
                  {robotState ? `${robotState.batteryLevel.toFixed(1)}%` : 'N/A'}
                </span></p>
                <p className="text-dark-300">Status: <span className={`${isMoving ? 'text-accent-400' : 'text-white'}`}>
                  {isMoving ? 'Moving' : 'Idle'}
                </span></p>
                {selectedRobot.type === 'arm' && robotState?.isGrabbing && (
                  <p className="text-dark-300">Gripper: <span className="text-primary-400">
                    Grabbing Object
                  </span></p>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex border-b border-dark-600 mb-3">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeSensorTab === 'camera' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveSensorTab('camera')}
                >
                  Camera
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeSensorTab === 'lidar' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveSensorTab('lidar')}
                >
                  Lidar
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeSensorTab === 'other' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveSensorTab('other')}
                >
                  Other
                </button>
              </div>
              
              <div className="bg-dark-900 rounded-md border border-dark-700 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Cpu size={24} className="text-dark-400 mx-auto mb-2" />
                  <p className="text-dark-400 text-sm">
                    {activeSensorTab === 'camera' 
                      ? `${selectedRobot.name} camera feed` 
                      : activeSensorTab === 'lidar' 
                        ? `${selectedRobot.name} lidar data` 
                        : `${selectedRobot.name} sensor data`}
                  </p>
                  {robotState && (
                    <p className="text-primary-400 text-xs mt-2">
                      Sensor data: {(Math.random() * 10).toFixed(2)}m
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
              className="mb-4"
            >
              <Robot size={48} className="text-dark-400 mx-auto" />
            </motion.div>
            <h3 className="text-lg font-medium text-white mb-2">No Robot Selected</h3>
            <p className="text-dark-300 text-sm mb-4">
              Choose from {availableRobots.length} different robot types to begin controlling
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {availableRobots.map((robot) => (
                <div key={robot.id} className="flex items-center text-dark-400">
                  {getRobotIcon(robot.type)}
                  <span className="ml-1">{robot.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;