import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    stopRobot,
    landDrone,
    startHover
  } = useRobotStore();

    // ─── GENERIC OBJECTIVE PARSING ───
  const criteriaList = useMemo(() => {
    if (!challenge) return [];
    return challenge.objectives.map(o => {
      const d = o.description.toLowerCase();
      let type: 'move' | 'rotate' | null = null;
      let axis: 'x' | 'z' | 'y' | null = null;
      let sign: 1 | -1 | null = null;
      let threshold = 0;

      // move … forward/backward/left/right N
      const m = d.match(/move.*?(forward|backward|left|right)\s*(\d+(\.\d+)?)/);
      if (m) {
        type = 'move';
        threshold = parseFloat(m[2]);
        axis = (m[1]==='forward'||m[1]==='backward') ? 'z' : 'x';
        sign = (m[1]==='forward'||m[1]==='right') ? 1 : -1;
      }
      // rotate … N degrees left/right
      const r = d.match(/rotate.*?(\d+(\.\d+)?).*?degrees.*?(left|right)/);
      if (r) {
        type = 'rotate';
        threshold = parseFloat(r[1]);
        axis = 'y';
        sign = (r[3]==='right') ? 1 : -1;
      }
      return { objectiveId: o.id, type, axis, threshold, sign, completed: o.completed };
    });
  }, [challenge]);

  // ─── STATE REFS FOR PROGRESS ───
  const progress = useRef<Record<string, number>>({});
  const lastPos  = useRef(robotState?.position  || { x:0,y:0,z:0 });
  const lastRot  = useRef(robotState?.rotation.y || 0);

  // ─── EFFECT: WATCH ACTUAL MOTION ───
  useEffect(() => {
    if (!challenge || !robotState) return;
    const pos = robotState.position;
    const rot = robotState.rotation.y;
    const dx  = pos.x - lastPos.current.x;
    const dz  = pos.z - lastPos.current.z;
    const dy  = (rot - lastRot.current) * (180/Math.PI);

    criteriaList.forEach(c => {
      if (!c.type || c.completed) return;
      // init
      if (progress.current[c.objectiveId] == null) progress.current[c.objectiveId] = 0;
      let delta = 0;

      if (c.type==='move' && c.axis) {
        const v = c.axis==='x' ? dx : dz;
        if (v * (c.sign||1) > 0) delta = Math.abs(v);
      } else if (c.type==='rotate') {
        if (dy * (c.sign||1) > 0) delta = Math.abs(dy);
      }

      if (delta > 0) {
        progress.current[c.objectiveId] += delta;
        if (progress.current[c.objectiveId] >= c.threshold) {
          window.dispatchEvent(new CustomEvent('objectiveCompleted', {
            detail: { challengeId: challenge.id, objectiveId: c.objectiveId }
          }));
        }
      }
    });

    lastPos.current = { ...pos };
    lastRot.current = rot;
  },
  [
    robotState,
    criteriaList,
    challenge
  ]);

  
  const [speed, setSpeed] = useState(50);
  const [activeSensorTab, setActiveSensorTab] = useState('camera');
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  
  // Enhanced robot models with better descriptions and using the available spider model
  const availableRobots = [
    { id: 'mobile1', name: 'Explorer Bot', type: 'mobile', description: 'All-terrain mobile robot for exploration and navigation', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
    { id: 'arm1', name: 'Precision Arm', type: 'arm', description: 'Industrial robot arm for precise manipulation tasks', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
    { id: 'drone1', name: 'Sky Scanner', type: 'drone', description: 'Aerial drone for surveillance and mapping', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
    { id: 'spider1', name: 'Spider Walker', type: 'spider', description: 'Six-legged robot for rough terrain navigation', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
    { id: 'tank1', name: 'Heavy Mover', type: 'tank', description: 'Tracked robot for heavy-duty operations', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
    { id: 'humanoid1', name: 'Assistant Bot', type: 'humanoid', description: 'Bipedal humanoid robot for human interaction', model: '/models/spider-model/source/spiedy_sfabblend.glb' },
  ];
  
  // Fixed movement handlers with proper event handling
  const handleMoveStart = (direction: 'forward' | 'backward') => {
    if (!selectedRobot) return;
    console.log(`Moving ${direction} with speed:`, speed / 100);
    setIsPressed(direction);
    moveRobot({ direction, speed: speed / 100 });
  };
  
  const handleMoveEnd = () => {
    console.log('Stopping robot movement');
    setIsPressed(null);
    stopRobot();
  };
  
  const handleRotateStart = (direction: 'left' | 'right') => {
    if (!selectedRobot) return;
    console.log(`Turning ${direction} with speed:`, speed / 100);
    setIsPressed(direction);
    rotateRobot({ direction, speed: speed / 100 });
  };
  
  const handleRotateEnd = () => {
    console.log('Stopping robot rotation');
    setIsPressed(null);
    stopRobot();
  };
  
  // Arm joint control function
  const handleArmJoint = (joint: string, direction: string) => {
    if (!selectedRobot) return;
    console.log(`Moving ${joint} ${direction}`);
    
    moveRobot({ 
      direction: direction as 'forward' | 'backward', 
      speed: speed / 100,
      joint: joint
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
        description: robot.description,
        model: robot.model,
        basePosition: { x: 0, y: 0, z: 0 },
        baseRotation: { x: 0, y: 0, z: 0, w: 1 },
        sensors: []
      });
    }
  };

  const handleDroneHover = () => {
    if (!selectedRobot || selectedRobot.type !== 'drone') return;
    setIsHovering(!isHovering);
    
    if (!isHovering) {
      startHover();
    } else {
      landDrone();
    }
  };

  const handleDroneBoost = () => {
    if (!selectedRobot || selectedRobot.type !== 'drone') return;
    setIsBoosting(!isBoosting);
    
    if (!isBoosting) {
      // Activate boost mode
      moveRobot({ 
        direction: 'forward',
        speed: 1.0,
        joint: 'boost'
      });
    } else {
      // Deactivate boost mode
      stopRobot();
    }
  };

  // Special action handlers for different robot types
  const handleSpecialAction1 = () => {
    if (!selectedRobot) return;
    
    switch (selectedRobot.type) {
      case 'spider':
        console.log('Spider climbing action');
        // Trigger climb animation
        break;
      case 'humanoid':
        console.log('Humanoid waving action');
        // Trigger wave gesture
        break;
      case 'tank':
        console.log('Tank special weapon action');
        break;
      case 'drone':
        handleDroneBoost();
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
        // Trigger scan animation
        break;
      case 'humanoid':
        console.log('Humanoid gesture action');
        // Trigger custom gesture
        break;
      case 'tank':
        console.log('Tank defensive action');
        break;
      case 'drone':
        handleDroneHover();
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
                  onTouchStart={() => handleArmJoint('base', 'left')}
                  onTouchEnd={handleMoveEnd}
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
                  onTouchStart={() => handleArmJoint('base', 'right')}
                  onTouchEnd={handleMoveEnd}
                  disabled={!selectedRobot}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Wrist */}
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-2">Wrist (No 360°)</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className="btn bg-dark-700 hover:bg-dark-600 text-white py-3 flex items-center justify-center"
                  onMouseDown={() => handleArmJoint('wrist', 'left')}
                  onMouseUp={handleMoveEnd}
                  onMouseLeave={handleMoveEnd}
                  onTouchStart={() => handleArmJoint('wrist', 'left')}
                  onTouchEnd={handleMoveEnd}
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
                  onTouchStart={() => handleArmJoint('wrist', 'right')}
                  onTouchEnd={handleMoveEnd}
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

      case 'drone':
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleMoveStart('forward');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMoveEnd();
                }}
                disabled={!selectedRobot || !isHovering}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleRotateStart('left');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleRotateEnd();
                }}
                disabled={!selectedRobot || !isHovering}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleMoveStart('backward');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMoveEnd();
                }}
                disabled={!selectedRobot || !isHovering}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleRotateStart('right');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleRotateEnd();
                }}
                disabled={!selectedRobot || !isHovering}
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Drone-specific controls */}
            <div className="flex space-x-2 mb-4">
              <button 
                className={`btn flex-1 flex items-center justify-center transition-colors ${
                  isHovering 
                    ? 'bg-accent-600 hover:bg-accent-700' 
                    : 'bg-dark-700 hover:bg-dark-600'
                } text-white py-2`}
                onClick={handleDroneHover}
                disabled={!selectedRobot}
              >
                <Target size={18} className="mr-2" />
                <span>Hover {isHovering ? 'Off' : 'On'}</span>
              </button>
              <button 
                className={`btn flex-1 flex items-center justify-center transition-colors ${
                  isBoosting 
                    ? 'bg-secondary-600 hover:bg-secondary-700' 
                    : 'bg-dark-700 hover:bg-dark-600'
                } text-white py-2`}
                onClick={handleDroneBoost}
                disabled={!selectedRobot || !isHovering}
              >
                <Zap size={18} className="mr-2" />
                <span>Boost {isBoosting ? 'Off' : 'On'}</span>
              </button>
            </div>
          </div>
        );

      default:
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleMoveStart('forward');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMoveEnd();
                }}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleRotateStart('left');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleRotateEnd();
                }}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleMoveStart('backward');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMoveEnd();
                }}
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
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleRotateStart('right');
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleRotateEnd();
                }}
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
    <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden flex flex-col h-full">
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