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
    moveRobot({ direction: 'forward', speed: speed / 100 });
  };
  
  const handleMoveBackward = () => {
    if (!selectedRobot) return;
    moveRobot({ direction: 'backward', speed: speed / 100 });
  };
  
  const handleTurnLeft = () => {
    if (!selectedRobot) return;
    rotateRobot({ direction: 'left', speed: speed / 100 });
  };
  
  const handleTurnRight = () => {
    if (!selectedRobot) return;
    rotateRobot({ direction: 'right', speed: speed / 100 });
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-dark-600 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Control Panel</h3>
        <div className="flex space-x-2">
          <select
            className="input bg-dark-700 text-white py-1 px-2 text-sm"
            value={selectedRobot?.id || ''}
            onChange={(e) => {
              const robotId = e.target.value;
              const robot = availableRobots.find(r => r.id === robotId);
              if (robot) {
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
            }}
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
                min="0" 
                max="100" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div></div>
              <button 
                className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                onMouseDown={handleMoveForward}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                onTouchStart={handleMoveForward}
                onTouchEnd={stopRobot}
              >
                <ArrowUp size={20} />
              </button>
              <div></div>
              
              <button 
                className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                onMouseDown={handleTurnLeft}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                onTouchStart={handleTurnLeft}
                onTouchEnd={stopRobot}
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                onMouseDown={handleMoveBackward}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                onTouchStart={handleMoveBackward}
                onTouchEnd={stopRobot}
              >
                <ArrowDown size={20} />
              </button>
              <button 
                className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                onMouseDown={handleTurnRight}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                onTouchStart={handleTurnRight}
                onTouchEnd={stopRobot}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            
            {selectedRobot.type === 'arm' && (
              <div className="flex space-x-2 mb-6">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-2 flex-1 flex items-center justify-center"
                  onMouseDown={grabObject}
                  onMouseUp={releaseObject}
                  onTouchStart={grabObject}
                  onTouchEnd={releaseObject}
                >
                  <Grab size={18} className="mr-2" />
                  <span>Grab</span>
                </button>
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-2 flex-1 flex items-center justify-center"
                  onClick={releaseObject}
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
                <p className="text-dark-300">Status: <span className={`${robotState && robotState.isMoving ? 'text-accent-400' : 'text-white'}`}>
                  {robotState ? (robotState.isMoving ? 'Moving' : 'Idle') : 'N/A'}
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
