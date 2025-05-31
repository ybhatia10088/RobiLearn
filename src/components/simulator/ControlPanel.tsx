import React, { useState } from 'react';
import { useRobotStore } from '@/store/robotStore';
import { Notebook as Robot, Cpu, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Grab, Hand, Book } from 'lucide-react';
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
  
  // Get available robot models
  const availableRobots = [
    { id: 'arm1', name: 'Robot Arm', type: 'arm' },
    { id: 'mobile1', name: 'Mobile Robot', type: 'mobile' },
    { id: 'drone1', name: 'Drone', type: 'drone' },
  ];
  
  const handleMoveForward = () => {
    if (!selectedRobot) return;
    console.log('Moving forward with speed:', speed / 100);
    moveRobot({ direction: 'forward', speed: speed / 100 });
  };
  
  const handleMoveBackward = () => {
    if (!selectedRobot) return;
    console.log('Moving backward with speed:', speed / 100);
    moveRobot({ direction: 'backward', speed: speed / 100 });
  };
  
  const handleTurnLeft = () => {
    if (!selectedRobot) return;
    console.log('Turning left with speed:', speed / 100);
    rotateRobot({ direction: 'left', speed: speed / 100 });
  };
  
  const handleTurnRight = () => {
    if (!selectedRobot) return;
    console.log('Turning right with speed:', speed / 100);
    rotateRobot({ direction: 'right', speed: speed / 100 });
  };
  
  const handleStop = () => {
    console.log('Stopping robot');
    stopRobot();
  };
  
  // New function for arm joint control
  const handleArmJoint = (joint: string, direction: string) => {
    if (!selectedRobot) return;
    console.log(`Moving ${joint} ${direction}`);
    
    // Use the existing moveRobot function but with joint-specific data
    moveRobot({ 
      direction: direction as 'forward' | 'backward', 
      speed: speed / 100,
      joint: joint // Add joint info
    });
  };
  
  const handleRobotSelect = (robotId: string) => {
    const robot = availableRobots.find(r => r.id === robotId);
    if (robot) {
      console.log('Selecting robot:', robot);
      selectRobot({
        id: robot.id,
        name: robot.name,
        type: robot.type as any,
        description: `A ${robot.type} robot for simulation`,
        model: `/models/${robot.type}.glb`,
        basePosition: { x: 0, y: 0, z: 0 },
        baseRotation: { x: 0, y: 0, z: 0, w: 1 },
        sensors: []
      });
    }
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-dark-600 flex justify-between items-center">
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
                {robot.name}
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
                <Robot size={20} className="text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">{selectedRobot.name}</h4>
                <p className="text-sm text-dark-300">Type: {selectedRobot.type}</p>
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
            
            {/* Movement Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3">
                {selectedRobot.type === 'arm' ? 'Arm Joint Controls' : 'Movement Controls'}
              </h4>
              
              {selectedRobot.type === 'arm' ? (
                // Robot Arm Controls - Better UI
                <div className="space-y-4">
                  {/* Base Rotation */}
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-2">Base Rotation</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('base', 'left')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div className="flex items-center justify-center text-xs text-dark-400">Base</div>
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('base', 'right')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
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
                        onMouseDown={() => handleArmJoint('shoulder', 'up')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <div className="flex items-center justify-center text-xs text-dark-400">Shoulder</div>
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('shoulder', 'down')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Elbow */}
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-2">Elbow</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('elbow', 'up')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <div className="flex items-center justify-center text-xs text-dark-400">Elbow</div>
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('elbow', 'down')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowDown size={16} />
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
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div className="flex items-center justify-center text-xs text-dark-400">Wrist</div>
                      <button 
                        className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                        onMouseDown={() => handleArmJoint('wrist', 'right')}
                        onMouseUp={handleStop}
                        onMouseLeave={handleStop}
                        disabled={!selectedRobot}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Mobile Robot / Drone Controls - Original good-looking design
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div></div>
                  <button 
                    className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                    onMouseDown={handleMoveForward}
                    onMouseUp={handleStop}
                    onMouseLeave={handleStop}
                    onTouchStart={handleMoveForward}
                    onTouchEnd={handleStop}
                    disabled={!selectedRobot}
                  >
                    <ArrowUp size={20} />
                  </button>
                  <div></div>
                  
                  <button 
                    className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                    onMouseDown={handleTurnLeft}
                    onMouseUp={handleStop}
                    onMouseLeave={handleStop}
                    onTouchStart={handleTurnLeft}
                    onTouchEnd={handleStop}
                    disabled={!selectedRobot}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                    onMouseDown={handleMoveBackward}
                    onMouseUp={handleStop}
                    onMouseLeave={handleStop}
                    onTouchStart={handleMoveBackward}
                    onTouchEnd={handleStop}
                    disabled={!selectedRobot}
                  >
                    <ArrowDown size={20} />
                  </button>
                  <button 
                    className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                    onMouseDown={handleTurnRight}
                    onMouseUp={handleStop}
                    onMouseLeave={handleStop}
                    onTouchStart={handleTurnRight}
                    onTouchEnd={handleStop}
                    disabled={!selectedRobot}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
            
            {selectedRobot.type === 'arm' && (
              <div className="flex space-x-2 mb-6">
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
            )}
            
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
                      ? 'Camera feed will appear here' 
                      : activeSensorTab === 'lidar' 
                        ? 'Lidar data visualization' 
                        : 'Other sensor data'}
                  </p>
                  {robotState && (
                    <p className="text-primary-400 text-xs mt-2">
                      Sensor data: {Math.random().toFixed(2)}m
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
              Choose a robot from the dropdown menu to begin controlling it
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
