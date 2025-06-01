import React, { useState, useEffect } from 'react';
import { create } from 'zustand'; // Re-import zustand if useRobotStore is defined in the same file
import { FaPlay, FaPause, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaHandPaper, FaHandRock, FaPlane, FaCloudDownloadAlt, FaUndo, FaRedo, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaBatteryEmpty, FaWifi, FaWifiSlash } from 'react-icons/fa';

// Define types (these should ideally be in a separate '@/types/robot.types' file as you had)
// For a single file, we'll put them here.
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface RobotConfig {
  id: string;
  name: string;
  type: 'mobile' | 'arm' | 'drone' | 'spider' | 'tank' | 'humanoid'; // Added common robot types
  basePosition: Vector3;
  baseRotation: Quaternion;
  // Add other config properties as needed (e.g., joint limits for arm, max speed for mobile)
}

interface RobotState {
  robotId: string;
  position: Vector3;
  rotation: Quaternion;
  jointPositions: { [key: string]: number }; // Dynamic for different joints
  sensorReadings: any[]; // Placeholder
  isMoving: boolean;
  isGrabbing: boolean;
  batteryLevel: number; // 0-100
  errors: string[];
  currentJointCommand: { joint: string; direction: string; speed: number } | null;
}

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
}

interface JointState {
  base: number;
  shoulder: number;
  elbow: number;
  wrist: number;
  // Add other joints like 'gripper' if treated as a joint
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean; // Global flag for any movement
  moveCommands: { joint?: string; direction: string; speed: number } | null; // Unified move commands
  jointPositions: JointState; // Actual desired joint positions
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down', speed: number, joint?: string }) => void;
  rotateRobot: (params: { direction: 'left' | 'right', speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  setEnvironment: (config: EnvironmentConfig) => void;
  updateRobotPosition: (position: Vector3) => void;
  updateRobotRotation: (rotation: Quaternion) => void;
  updateJointPosition: (joint: keyof JointState, value: number) => void;
}

// Zustand Store Definition (as provided by you, with minor adjustments for `moveCommands` type)
export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  isMoving: false,
  moveCommands: null,
  jointPositions: {
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0
  },
  environment: {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'A warehouse environment with shelves, boxes, and robots.',
  },

  selectRobot: (config) => {
    set({
      selectedRobot: config,
      robotState: {
        robotId: config.id,
        position: { ...config.basePosition },
        rotation: { ...config.baseRotation },
        // Initialize jointPositions based on robot type or defaults
        jointPositions: config.type === 'arm' ? { base: 0, shoulder: 0, elbow: 0, wrist: 0 } : {},
        sensorReadings: [],
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        currentJointCommand: null,
      },
      isMoving: false,
      moveCommands: null,
      jointPositions: config.type === 'arm' ? { base: 0, shoulder: 0, elbow: 0, wrist: 0 } : { base: 0, shoulder: 0, elbow: 0, wrist: 0 } // Reset jointPositions
    });
  },

  moveRobot: (params) => {
    const { direction, speed, joint } = params;
    const state = get();

    if (!state.robotState) return;

    // Clear any existing movement intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    set({
      isMoving: true,
      moveCommands: { direction, speed, joint }, // Store the current command
      robotState: {
        ...state.robotState,
        isMoving: true,
        currentJointCommand: joint ? { joint, direction, speed } : null,
      }
    });

    // Handle mobile robot and drone movement
    if (state.selectedRobot?.type !== 'arm' || (joint && (joint === 'altitude'))) {
      const moveStep = 0.05 * speed; // Base movement speed
      const angle = state.robotState.rotation.y; // Current yaw rotation

      // Calculate deltas based on direction and current rotation
      let deltaX = 0;
      let deltaZ = 0;
      let deltaY = 0;

      if (joint === 'altitude') { // Drone altitude control
        deltaY = direction === 'up' ? moveStep : -moveStep;
      } else { // Mobile robot (forward/backward) or drone (forward/backward/strafe)
        switch (direction) {
          case 'forward':
            deltaX = Math.sin(angle) * moveStep;
            deltaZ = Math.cos(angle) * moveStep;
            break;
          case 'backward':
            deltaX = -Math.sin(angle) * moveStep;
            deltaZ = -Math.cos(angle) * moveStep;
            break;
          case 'left': // Strafe left (relative to robot's front)
            deltaX = -Math.cos(angle) * moveStep;
            deltaZ = Math.sin(angle) * moveStep;
            break;
          case 'right': // Strafe right (relative to robot's front)
            deltaX = Math.cos(angle) * moveStep;
            deltaZ = -Math.sin(angle) * moveStep;
            break;
        }
      }

      const moveInterval = setInterval(() => {
        const currentState = get();
        if (!currentState.robotState || !currentState.isMoving || !currentState.moveCommands) {
          clearInterval(moveInterval);
          (window as any).robotMoveInterval = null;
          return;
        }

        // Apply movement only if the active command matches
        if (currentState.moveCommands.direction === direction && currentState.moveCommands.joint === joint) {
          set((s) => ({
            robotState: {
              ...s.robotState!,
              isMoving: true,
              position: {
                x: s.robotState!.position.x + deltaX,
                y: s.robotState!.position.y + deltaY,
                z: s.robotState!.position.z + deltaZ,
              },
              batteryLevel: Math.max(0, s.robotState!.batteryLevel - 0.01) // Simulate battery drain
            }
          }));
        } else {
            clearInterval(moveInterval);
            (window as any).robotMoveInterval = null;
        }
      }, 16); // ~60fps update rate

      (window as any).robotMoveInterval = moveInterval;

    } else if (joint && state.selectedRobot?.type === 'arm') {
      // For arm joints, the `moveRobot` action here would typically trigger a *target*
      // update for the joint position, which then the 3D model interpolates towards.
      // The `updateJointPosition` below handles the direct state update in the store.
      // This part might be more conceptual if your 3D model handles the actual smooth interpolation.
    }
  },

  rotateRobot: (params) => {
    const { direction, speed } = params;
    const state = get();

    if (!state.robotState || state.selectedRobot?.type === 'arm') return;

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }

    set({ isMoving: true });

    const rotationStep = 0.02 * speed;
    const delta = direction === 'left' ? rotationStep : -rotationStep;

    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        (window as any).robotRotateInterval = null;
        return;
      }

      set({
        robotState: {
          ...currentState.robotState,
          isMoving: true,
          rotation: {
            ...currentState.robotState.rotation,
            y: (currentState.robotState.rotation.y + delta) % (Math.PI * 2), // Ensure rotation loops
          },
          batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.005)
        }
      });
    }, 16);

    (window as any).robotRotateInterval = rotateInterval;
  },

  grabObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: true,
      }
    });
  },

  releaseObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: false,
      }
    });
  },

  stopRobot: () => {
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }

    const state = get();
    if (!state.robotState) return;

    set({
      isMoving: false,
      moveCommands: null,
      robotState: {
        ...state.robotState,
        isMoving: false,
        currentJointCommand: null,
      }
    });
  },

  setEnvironment: (config) => {
    set({ environment: config });
  },

  updateRobotPosition: (position) => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        position,
      }
    });
  },

  updateRobotRotation: (rotation) => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        rotation,
      }
    });
  },

  updateJointPosition: (joint, value) => {
    set((state) => ({
      jointPositions: {
        ...state.jointPositions,
        [joint]: value
      },
      robotState: state.robotState ? {
        ...state.robotState,
        jointPositions: { // Also update robotState's jointPositions for consistency
          ...state.robotState.jointPositions,
          [joint]: value
        }
      } : null
    }));
  },
}));


// ControlPanel Component
const ControlPanel: React.FC = () => {
  const {
    selectedRobot,
    robotState,
    moveRobot,
    rotateRobot,
    grabObject,
    releaseObject,
    stopRobot,
    selectRobot,
    updateJointPosition,
  } = useRobotStore();

  // State for general movement speed
  const [speed, setSpeed] = useState(1.0); // Default speed multiplier

  // Define a simple list of available robots for demonstration.
  // In a real application, this might come from an API or a config file.
  const availableRobots: RobotConfig[] = [
    { id: 'mobile_1', name: 'Mobile Rover', type: 'mobile', basePosition: { x: 0, y: 0.15, z: 0 }, baseRotation: { x: 0, y: 0, z: 0, w: 1 } },
    { id: 'arm_1', name: 'Industrial Arm', type: 'arm', basePosition: { x: 0, y: 0.05, z: 0 }, baseRotation: { x: 0, y: 0, z: 0, w: 1 } },
    { id: 'drone_1', name: 'Recon Drone', type: 'drone', basePosition: { x: 0, y: 1.0, z: 0 }, baseRotation: { x: 0, y: 0, z: 0, w: 1 } },
  ];

  // Arm joint limits (should match your RobotModel's ARM_LIMITS or be passed down)
  const ARM_LIMITS: { [key: string]: { min: number, max: number } } = {
    base: { min: -Math.PI, max: Math.PI },
    shoulder: { min: -Math.PI / 2, max: Math.PI / 4 }, // Example: from -90 to +45 degrees
    elbow: { min: 0, max: Math.PI * 0.75 }, // Example: from 0 to +135 degrees
    wrist: { min: -Math.PI, max: Math.PI }
  };


  // Effect to select a default robot on mount and clean up on unmount
  useEffect(() => {
    // Select the first robot by default if none is selected
    if (!selectedRobot && availableRobots.length > 0) {
      selectRobot(availableRobots[0]);
    }
    // Cleanup function: ensures stopRobot is called when component unmounts or robot changes
    return () => {
      stopRobot();
    };
  }, [selectedRobot, selectRobot, stopRobot]);

  // Helper to get battery icon based on level
  const getBatteryIcon = (level: number) => {
    if (level > 75) return <FaBatteryFull className="text-green-400" />;
    if (level > 40) return <FaBatteryHalf className="text-yellow-400" />;
    if (level > 10) return <FaBatteryQuarter className="text-orange-400" />;
    return <FaBatteryEmpty className="text-red-500" />;
  };

  // Helper to get battery color class
  const getBatteryColorClass = (level: number) => {
    if (level > 75) return 'text-green-400';
    if (level > 40) return 'text-yellow-400';
    if (level > 10) return 'text-orange-400';
    return 'text-red-500';
  };

  // Render controls specific to the selected robot type
  const renderRobotSpecificControls = () => {
    if (!selectedRobot) return null; // Should not happen if default robot is selected

    switch (selectedRobot.type) {
      case 'mobile':
        return (
          <>
            <h3 className="text-xl font-semibold mb-3 text-light-blue-text">Movement Controls</h3>
            <div className="grid grid-cols-3 gap-2 w-48 mx-auto mb-6">
              <div></div> {/* Spacer */}
              <button
                onMouseDown={() => moveRobot({ direction: 'forward', speed })}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                aria-label="Move Forward"
              >
                <FaArrowUp />
              </button>
              <div></div> {/* Spacer */}

              <button
                onMouseDown={() => rotateRobot({ direction: 'left', speed })}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                aria-label="Rotate Left"
              >
                <FaUndo />
              </button>
              <button
                onMouseDown={() => moveRobot({ direction: 'backward', speed })}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                aria-label="Move Backward"
              >
                <FaArrowDown />
              </button>
              <button
                onMouseDown={() => rotateRobot({ direction: 'right', speed })}
                onMouseUp={stopRobot}
                onMouseLeave={stopRobot}
                className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                aria-label="Rotate Right"
              >
                <FaRedo />
              </button>
            </div>

            <div className="mb-6">
              <label htmlFor="mobile-speed" className="block text-light-blue-text text-md font-medium mb-2">
                Movement Speed: <span className="font-bold">{speed.toFixed(1)}x</span>
              </label>
              <input
                id="mobile-speed"
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
            </div>
          </>
        );

      case 'arm':
        const jointLabels: { [key in keyof JointState]: string } = {
          base: 'Base (Yaw)',
          shoulder: 'Shoulder (Pitch)',
          elbow: 'Elbow (Pitch)',
          wrist: 'Wrist (Roll/Yaw)',
        };
        // Ensure jointPositions is initialized in robotState or directly from store
        const currentJointPositions = useRobotStore.getState().jointPositions; // Get directly from store state

        return (
          <>
            <h3 className="text-xl font-semibold mb-3 text-light-blue-text">Joint Controls</h3>
            {Object.entries(jointLabels).map(([jointKey, label]) => (
              <div key={jointKey} className="mb-5 p-3 bg-medium-blue-bg rounded-lg border border-blue-700 shadow-sm">
                <h4 className="font-medium text-blue-300 mb-2">{label}</h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateJointPosition(jointKey as keyof JointState, Math.max(ARM_LIMITS[jointKey].min, currentJointPositions[jointKey as keyof JointState] - 0.1))}
                    className="p-2 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-md text-white text-lg shadow-sm transition-colors duration-150"
                    aria-label={`Decrease ${label}`}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={ARM_LIMITS[jointKey].min}
                    max={ARM_LIMITS[jointKey].max}
                    step="0.01"
                    value={currentJointPositions[jointKey as keyof JointState]}
                    onChange={(e) => updateJointPosition(jointKey as keyof JointState, parseFloat(e.target.value))}
                    className="flex-grow h-2 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                  />
                  <button
                    onClick={() => updateJointPosition(jointKey as keyof JointState, Math.min(ARM_LIMITS[jointKey].max, currentJointPositions[jointKey as keyof JointState] + 0.1))}
                    className="p-2 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-md text-white text-lg shadow-sm transition-colors duration-150"
                    aria-label={`Increase ${label}`}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400 mt-2 block text-center">
                  Current: {(currentJointPositions[jointKey as keyof JointState] * (180 / Math.PI)).toFixed(1)}°
                </span>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-blue-800">
              <h3 className="text-xl font-semibold mb-3 text-light-blue-text">Gripper Control</h3>
              <button
                onClick={robotState?.isGrabbing ? releaseObject : grabObject}
                className={`py-3 px-6 rounded-full text-white font-semibold w-full flex items-center justify-center space-x-2 shadow-md transition-colors duration-200 ${
                  robotState?.isGrabbing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {robotState?.isGrabbing ? <FaHandRock className="mr-2 text-xl" /> : <FaHandPaper className="mr-2 text-xl" />}
                {robotState?.isGrabbing ? 'Release Object' : 'Grab Object'}
              </button>
            </div>
          </>
        );

      case 'drone':
        const currentAltitude = robotState?.position.y || 0;
        const isFlying = currentAltitude > 0.15; // Arbitrary value to determine if drone is airborne

        return (
          <>
            <h3 className="text-xl font-semibold mb-3 text-light-blue-text">Flight Controls</h3>

            {/* Translational Movement */}
            <div className="mb-6 p-4 bg-medium-blue-bg rounded-lg border border-blue-700 shadow-sm">
              <h4 className="font-medium text-blue-300 mb-2">Translational (XY Plane)</h4>
              <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
                <div></div>
                <button
                  onMouseDown={() => moveRobot({ direction: 'forward', speed })}
                  onMouseUp={stopRobot}
                  onMouseLeave={stopRobot}
                  className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                  aria-label="Move Forward"
                >
                  <FaArrowUp />
                </button>
                <div></div>

                <button
                  onMouseDown={() => moveRobot({ direction: 'left', speed })} // Strafe left
                  onMouseUp={stopRobot}
                  onMouseLeave={stopRobot}
                  className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                  aria-label="Strafe Left"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onMouseDown={() => moveRobot({ direction: 'backward', speed })}
                  onMouseUp={stopRobot}
                  onMouseLeave={stopRobot}
                  className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                  aria-label="Move Backward"
                >
                  <FaArrowDown />
                </button>
                <button
                  onMouseDown={() => moveRobot({ direction: 'right', speed })} // Strafe right
                  onMouseUp={stopRobot}
                  onMouseLeave={stopRobot}
                  className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl flex justify-center items-center shadow-md transition-all duration-150"
                  aria-label="Strafe Right"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Altitude and Yaw Control */}
            <div className="mb-6 p-4 bg-medium-blue-bg rounded-lg border border-blue-700 shadow-sm flex justify-around">
              <div>
                <h4 className="font-medium text-blue-300 mb-2">Altitude (Z Axis)</h4>
                <div className="flex flex-col space-y-2">
                  <button
                    onMouseDown={() => moveRobot({ direction: 'up', speed, joint: 'altitude' })}
                    onMouseUp={stopRobot}
                    onMouseLeave={stopRobot}
                    className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl shadow-md transition-all duration-150"
                    aria-label="Ascend"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onMouseDown={() => moveRobot({ direction: 'down', speed, joint: 'altitude' })}
                    onMouseUp={stopRobot}
                    onMouseLeave={stopRobot}
                    className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl shadow-md transition-all duration-150"
                    aria-label="Descend"
                  >
                    <FaArrowDown />
                  </button>
                </div>
                <span className="text-sm text-gray-400 mt-2 block text-center">
                  Current: {currentAltitude.toFixed(2)}m
                </span>
              </div>

              <div>
                <h4 className="font-medium text-blue-300 mb-2">Yaw (Rotation)</h4>
                <div className="flex flex-col space-y-2">
                  <button
                    onMouseDown={() => rotateRobot({ direction: 'left', speed })}
                    onMouseUp={stopRobot}
                    onMouseLeave={stopRobot}
                    className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl shadow-md transition-all duration-150"
                    aria-label="Rotate Left"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onMouseDown={() => rotateRobot({ direction: 'right', speed })}
                    onMouseUp={stopRobot}
                    onMouseLeave={stopRobot}
                    className="p-4 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 rounded-lg text-white text-2xl shadow-md transition-all duration-150"
                    aria-label="Rotate Right"
                  >
                    <FaRedo />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="drone-speed" className="block text-light-blue-text text-md font-medium mb-2">
                Flight Speed: <span className="font-bold">{speed.toFixed(1)}x</span>
              </label>
              <input
                id="drone-speed"
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
            </div>

            <button
              onClick={() => {
                // Implement takeoff/landing logic using your store's movement actions
                if (isFlying) {
                  // Land: Assume 0.15m is ground level
                  // You might want a more sophisticated landing sequence
                  moveRobot({ direction: 'down', speed: 0.5, joint: 'altitude' });
                  // Add a timeout to stop after reaching ground or
                  // monitor position until at target, then call stopRobot
                  setTimeout(stopRobot, 3000); // Example: stop after 3 seconds for landing
                } else {
                  // Takeoff: Move up to a hover altitude (e.g., 1.5m)
                  moveRobot({ direction: 'up', speed: 1, joint: 'altitude' });
                  setTimeout(stopRobot, 3000); // Example: stop after 3 seconds for takeoff
                }
              }}
              className={`py-3 px-6 rounded-full text-white font-bold w-full flex items-center justify-center space-x-2 shadow-md transition-colors duration-200 ${
                isFlying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isFlying ? <FaCloudDownloadAlt className="mr-2 text-xl" /> : <FaPlane className="mr-2 text-xl" />}
              {isFlying ? 'Lan
d Drone' : 'Takeoff Drone'}
            </button>
          </>
        );

      default:
        return <p className="text-gray-400 text-center">No specific controls for this robot type yet.</p>;
    }
  };

  // Render initial selection state if no robot is selected
  if (!selectedRobot || !robotState) {
    return (
      <div className="p-6 bg-dark-blue-bg text-white rounded-xl shadow-2xl border border-blue-900" style={{ minWidth: '320px', maxWidth: '400px' }}>
        <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">Robot Control Panel</h2>
        <p className="mb-6 text-center text-gray-300">Please select a robot to begin interaction.</p>
        <div className="flex flex-col space-y-3">
          {availableRobots.map((robot) => (
            <button
              key={robot.id}
              onClick={() => selectRobot(robot)}
              className="py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 shadow-md"
            >
              Select {robot.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Main Control Panel Render
  return (
    <div className="p-6 bg-dark-blue-bg text-white rounded-xl shadow-2xl border border-blue-900" style={{ minWidth: '320px', maxWidth: '400px' }}>
      <h2 className="text-3xl font-extrabold mb-5 text-blue-400 text-center">Robot Interface</h2>

      {/* Robot Selection Dropdown */}
      <div className="mb-6">
        <label htmlFor="robot-select" className="block text-light-blue-text text-lg font-medium mb-2">Active Robot:</label>
        <select
          id="robot-select"
          className="w-full p-3 rounded-lg bg-medium-blue-bg border border-blue-600 text-white text-lg focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors duration-200"
          value={selectedRobot.id}
          onChange={(e) => {
            const newRobot = availableRobots.find(r => r.id === e.target.value);
            if (newRobot) selectRobot(newRobot);
          }}
        >
          {availableRobots.map((robot) => (
            <option key={robot.id} value={robot.id} className="bg-medium-blue-bg text-white p-2">
              {robot.name} ({robot.type.charAt(0).toUpperCase() + robot.type.slice(1)})
            </option>
          ))}
        </select>
      </div>

      {/* Global Status Bar */}
      <div className="mb-6 p-4 bg-medium-blue-bg rounded-lg flex flex-col md:flex-row justify-between items-center border border-blue-800 shadow-inner">
        <div className="text-md mb-2 md:mb-0">
          <p className="font-semibold text-blue-300 flex items-center">
            <span className="mr-2 text-xl"><FaWifi /></span>
            Connection: <span className="text-green-400 ml-1">Stable</span> {/* Static for now */}
          </p>
          <p className={`font-semibold ${getBatteryColorClass(robotState.batteryLevel)} flex items-center`}>
            {getBatteryIcon(robotState.batteryLevel)}
            <span className="ml-2">Battery: {robotState.batteryLevel.toFixed(1)}%</span>
          </p>
        </div>
        <div className="text-right text-sm">
          <p className={`font-semibold ${robotState.isMoving ? 'text-green-400' : 'text-gray-400'}`}>
            Status: {robotState.isMoving ? 'Executing Command' : 'Idle'}
          </p>
          <p className="text-gray-400">
            Pos: (X: {robotState.position.x.toFixed(2)}, Y: {robotState.position.y.toFixed(2)}, Z: {robotState.position.z.toFixed(2)})
          </p>
          <p className="text-gray-400">
            Orientation: Y: {(robotState.rotation.y * (180 / Math.PI)).toFixed(0)}°
          </p>
        </div>
      </div>

      {/* Robot Specific Controls Section */}
      <div className="mt-8 p-5 bg-dark-blue-bg rounded-lg shadow-xl border border-blue-700">
        {renderRobotSpecificControls()}
      </div>

      {/* Universal Stop Button */}
      <div className="mt-8">
        <button
          onClick={stopRobot}
          className="py-4 px-8 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xl w-full transition-colors duration-200 shadow-lg flex items-center justify-center space-x-3"
          aria-label="Stop All Robot Movement"
        >
          <FaPause className="text-2xl" />
          <span>EMERGENCY STOP</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;